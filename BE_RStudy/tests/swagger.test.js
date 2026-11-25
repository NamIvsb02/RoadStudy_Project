// Kiểm tra Swagger: route thật, docs/api-spec.md và tài liệu OpenAPI khớp nhau; tài liệu hợp lệ; bật/tắt theo môi trường.
// Phần 1 không cần server. Phần 2 tự bật server riêng (cổng 5064) vài lần với biến môi trường khác nhau, không đụng DB.
// Chạy: node tests/swagger.test.js
const { spawn } = require('child_process');
const path = require('path');
const { buildOpenApi, listRoutes, parseSpec, routeKey } = require('../src/docs/openapi');

let passed = 0;
let failed = 0;
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 5064;

async function withServer(env, fn) {
    const server = spawn(process.execPath, ['src/app.js'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, PORT: String(PORT), STORAGE_DRIVER: 'local', REDIS_URL: '', SWAGGER_ENABLED: '', ...env },
        stdio: 'ignore',
    });
    try {
        let up = false;
        for (let i = 0; i < 40 && !up; i++) {
            up = await fetch(`http://localhost:${PORT}/health`).then((r) => r.ok).catch(() => false);
            if (!up) await sleep(500);
        }
        if (!up) throw new Error('server không khởi động');
        await fn();
    } finally {
        const exited = new Promise((r) => server.once('exit', r));
        server.kill();
        await Promise.race([exited, sleep(3000)]);
        await sleep(300);
    }
}

async function main() {
    console.log('Kiểm tra Swagger / OpenAPI\n');

    console.log('[1. Route thật, api-spec.md và OpenAPI khớp nhau]');
    const routes = listRoutes();
    const spec = parseSpec();
    const routeKeys = new Set(routes.map((r) => routeKey(r.method, r.path)));
    const specKeys = new Set(Object.keys(spec.endpoints));
    const missingInSpec = [...routeKeys].filter((k) => !specKeys.has(k));
    const missingRoute = [...specKeys].filter((k) => !routeKeys.has(k));
    check('Mọi route đều có mục trong api-spec.md (API chưa có trong spec thì chưa xong)', missingInSpec.length === 0, missingInSpec.join(', '));
    check('Mọi mục trong api-spec.md đều có route thật (spec không mô tả API không tồn tại)', missingRoute.length === 0, missingRoute.join(', '));
    check('Không có route trùng (cùng phương thức và đường dẫn)', routeKeys.size === routes.length, `${routes.length} route, ${routeKeys.size} khóa`);

    const doc = buildOpenApi();
    const ops = Object.entries(doc.paths).flatMap(([p, ms]) => Object.entries(ms).map(([m, o]) => ({ p, m, o })));
    check(`OpenAPI có đủ ${routes.length} endpoint`, ops.length === routes.length, `${ops.length}`);
    check('Mỗi module trong api-spec.md là một nhóm (tag) có tên', doc.tags.length === Object.keys(spec.modules).length && doc.tags.every((t) => t.name), `${doc.tags.length} tag, ${Object.keys(spec.modules).length} module`);

    console.log('[2. Tài liệu hợp lệ]');
    const ids = ops.map((x) => x.o.operationId);
    check('operationId không trùng', new Set(ids).size === ids.length);
    const badParams = ops.filter(({ p, o }) => {
        const inPath = [...p.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
        const declared = o.parameters.filter((x) => x.in === 'path').map((x) => x.name).sort().join(',');
        return inPath !== declared;
    });
    check('Tham số {x} trong đường dẫn đều được khai báo', badParams.length === 0, badParams.map((x) => `${x.m} ${x.p}`).join(', '));
    const json = JSON.stringify(doc);
    const refs = [...json.matchAll(/"\$ref":"#\/components\/schemas\/(\w+)"/g)].map((m) => m[1]);
    check('Mọi $ref đều trỏ tới schema có thật', refs.every((r) => doc.components.schemas[r]), [...new Set(refs)].join(','));
    const fallback = ops.filter(({ o }) => {
        const s = o.requestBody?.content['application/json']?.schema;
        return s && s.type === 'object' && !s.properties && !s.oneOf && !s.anyOf && !s.allOf;
    });
    check('Mọi body validator đều chuyển được sang JSON Schema (không rơi về object rỗng)', fallback.length === 0, fallback.map((x) => `${x.m} ${x.p}`).join(', '));
    const noDesc = ops.filter(({ o }) => /Chưa có mô tả/.test(o.description));
    check('Mọi endpoint đều có mô tả lấy từ api-spec.md', noDesc.length === 0, noDesc.map((x) => `${x.m} ${x.p}`).join(', '));

    const op = (m, p) => doc.paths[p]?.[m];
    check('Endpoint cần đăng nhập có bearerAuth và lỗi 401 (GET /notification)', JSON.stringify(op('get', '/notification')?.security) === '[{"bearerAuth":[]}]' && op('get', '/notification')?.responses['401']);
    check('Endpoint công khai không yêu cầu token (GET /course)', JSON.stringify(op('get', '/course')?.security) === '[]');
    check('Query của GET /course lấy từ bảng trong spec (có categoryId, sort)', ['categoryId', 'sort', 'page'].every((n) => op('get', '/course')?.parameters.some((x) => x.name === n && x.in === 'query')));
    const inv = op('get', '/invoice');
    check('Quyền admin hiện trong mô tả và có lỗi 403 (GET /invoice cần QUAN_LY_THANH_TOAN)', /QUAN_LY_THANH_TOAN/.test(inv?.description) && inv?.responses['403']);
    check('Query dạng pending=true không bị đọc nhầm enum', JSON.stringify(inv?.parameters.find((x) => x.name === 'pending')?.schema.enum) === '["true"]', JSON.stringify(inv?.parameters.find((x) => x.name === 'pending')));
    check('Upload ảnh đại diện là multipart/form-data, trường avatar dạng file', op('post', '/account/avatar')?.requestBody?.content['multipart/form-data']?.schema.properties.avatar?.format === 'binary');
    const reg = op('post', '/auth/register');
    check('POST /auth/register trả 201, có body JSON và lỗi 409, 429', reg?.responses['201'] && reg?.requestBody?.content['application/json'] && reg?.responses['409'] && reg?.responses['429']);
    check('Chỉ Leader hiện trong mô tả (POST /admin/administrators)', /Chỉ Leader/.test(op('post', '/admin/administrators')?.description));

    console.log('[3. Bật/tắt theo môi trường (server thật, cổng 5064)]');
    await withServer({ NODE_ENV: 'development' }, async () => {
        const res = await fetch(`http://localhost:${PORT}/api-docs.json`);
        const body = await res.json().catch(() => null);
        check('Dev: /api-docs.json -> 200, đủ endpoint', res.status === 200 && Object.values(body?.paths || {}).flatMap(Object.keys).length === routes.length, `${res.status}`);
        const ui = await fetch(`http://localhost:${PORT}/api-docs/`);
        const html = await ui.text();
        const csp = ui.headers.get('content-security-policy') || '';
        check('Dev: /api-docs/ -> 200, là trang Swagger UI', ui.status === 200 && /swagger-ui/.test(html), `${ui.status}`);
        check('Trang /api-docs giữ CSP (script-src self) nhưng bỏ upgrade-insecure-requests', /script-src 'self'/.test(csp) && !/upgrade-insecure-requests/.test(csp), csp);
        const api = await fetch(`http://localhost:${PORT}/api/category`);
        check('API thường vẫn giữ nguyên CSP mặc định của helmet', /upgrade-insecure-requests/.test(api.headers.get('content-security-policy') || ''));
    });
    await withServer({ NODE_ENV: 'production' }, async () => {
        check('Production mặc định: /api-docs.json -> 404', (await fetch(`http://localhost:${PORT}/api-docs.json`)).status === 404);
        check('Production mặc định: /api-docs/ -> 404', (await fetch(`http://localhost:${PORT}/api-docs/`)).status === 404);
    });
    await withServer({ NODE_ENV: 'production', SWAGGER_ENABLED: 'true' }, async () => {
        check('Production + SWAGGER_ENABLED=true: /api-docs.json -> 200', (await fetch(`http://localhost:${PORT}/api-docs.json`)).status === 200);
    });
    await withServer({ NODE_ENV: 'development', SWAGGER_ENABLED: 'false' }, async () => {
        check('Dev + SWAGGER_ENABLED=false: /api-docs.json -> 404', (await fetch(`http://localhost:${PORT}/api-docs.json`)).status === 404);
    });

    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error('Lỗi khi chạy test:', e); process.exit(1); });
