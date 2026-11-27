// Kiểm tra cache Redis cho API công khai: cache-aside, chống bão cache, làm mới theo số phiên bản, Redis lỗi vẫn chạy.
// Tự bật container Redis tạm (cổng 6393, tự xóa) và server riêng (cổng 5063). Cần Docker.
// Phần 2 chỉ ĐỌC DB dùng chung, trừ 1 danh mục tạm được tạo, sửa rồi xóa ngay (tên có dấu thời gian).
// Chạy: node tests/cache.test.js
const { spawn, execFileSync } = require('child_process');
const path = require('path');

const REDIS_PORT = 6393;
const PORT = 5063;
const PASSWORD = 'test-only-password';
const CONTAINER = `roadstudy-cache-test-${Date.now()}`;
const STAMP = Date.now();
process.env.REDIS_URL = `redis://:${PASSWORD}@127.0.0.1:${REDIS_PORT}`;
process.env.REDIS_KEY_ENV = `test-${STAMP}`;
process.env.REDIS_COMMAND_TIMEOUT_MS = '300';

let passed = 0;
let failed = 0;
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const docker = (...args) => execFileSync('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const startRedis = () => docker('run', '-d', '--rm', '--name', CONTAINER, '-p', `127.0.0.1:${REDIS_PORT}:6379`, 'redis:7-alpine', 'redis-server', '--requirepass', PASSWORD, '--save', '', '--appendonly', 'no');

const startServer = (extraEnv = {}) => spawn(process.execPath, ['src/app.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(PORT), STORAGE_DRIVER: 'local', ...extraEnv },
    stdio: 'ignore',
});
async function waitUp() {
    for (let i = 0; i < 40; i++) {
        if (await fetch(`http://localhost:${PORT}/health`).then((r) => r.ok).catch(() => false)) return true;
        await sleep(500);
    }
    return false;
}
async function stopServer(server) {
    const exited = new Promise((r) => server.once('exit', r));
    server.kill();
    await Promise.race([exited, sleep(3000)]);
    await sleep(300);
}
const get = async (p) => {
    const t0 = Date.now();
    const res = await fetch(`http://localhost:${PORT}${p}`);
    return { status: res.status, body: await res.json().catch(() => null), ms: Date.now() - t0 };
};
async function waitReady(redis) {
    for (let i = 0; i < 30 && !redis.isReady(); i++) await sleep(300);
    return redis.isReady();
}

async function main() {
    console.log('Kiểm tra cache Redis cho API công khai\n');
    try { docker('version', '--format', '{{.Server.Version}}'); } catch { console.log('Dừng: Docker không chạy'); process.exit(1); }

    startRedis();
    await sleep(1500);
    let server;
    let tempCategoryId = null;
    let prisma = null;
    try {
        const redis = require('../src/config/redis');
        const cache = require('../src/utils/cache');
        check('Kết nối Redis tạm', await waitReady(redis));

        console.log('[1. cache.getOrSet]');
        let calls = 0;
        const loader = async () => { calls++; await sleep(30); return { n: calls, d: new Date(0), price: '150000' }; };
        const first = await cache.getOrSet('t:one', { a: 1, b: 2 }, loader);
        const second = await cache.getOrSet('t:one', { b: 2, a: 1 }, loader);
        check('Lần 2 lấy từ cache (loader chỉ gọi 1 lần), thứ tự trường không đổi khóa', calls === 1 && second.n === 1, `calls=${calls}`);
        check('Kết quả từ cache giống lần đầu khi đi qua JSON (ngày thành chuỗi ISO)', JSON.stringify(first) === JSON.stringify(second));
        await cache.getOrSet('t:one', { a: 1, b: 3 }, loader);
        check('Tham số khác thì khóa khác (gọi loader lần nữa)', calls === 2);

        calls = 0;
        const burst = await Promise.all(Array.from({ length: 50 }, () => cache.getOrSet('t:burst', { x: 1 }, loader)));
        check('50 request đồng thời cùng khóa chưa có cache: loader chỉ chạy 1 lần (chống bão cache)', calls === 1 && burst.every((b) => b.n === 1), `calls=${calls}`);

        calls = 0;
        await cache.getOrSet('t:ver', { x: 1 }, loader);
        await cache.bump();
        await cache.getOrSet('t:ver', { x: 1 }, loader);
        check('bump() làm mới: lần đọc sau gọi lại loader', calls === 2, `calls=${calls}`);

        let thrown = false;
        try { await cache.getOrSet('t:err', { x: 1 }, async () => { throw new Error('404 giả'); }); } catch { thrown = true; }
        calls = 0;
        await cache.getOrSet('t:err', { x: 1 }, loader);
        check('Loader ném lỗi thì lỗi được trả đi và KHÔNG bị cache', thrown && calls === 1);

        const keys = await redis.client.keys(redis.key('cache', 't:one', '*'));
        const ttl = await redis.client.ttl(keys[0]);
        check('Khóa cache có TTL trong khoảng 48 đến 72 giây (60 giây ±20%)', ttl >= 47 && ttl <= 72, `${ttl}`);
        check('Khóa nằm dưới tiền tố môi trường', keys[0].startsWith(`roadstudy:test-${STAMP}:cache:`), keys[0]);

        console.log('[2. Redis mất giữa chừng: vẫn trả dữ liệu, bump bù khi Redis về]');
        docker('stop', '-t', '0', CONTAINER);
        for (let i = 0; i < 30 && redis.isReady(); i++) await sleep(300);
        calls = 0;
        const t0 = Date.now();
        const down = await cache.getOrSet('t:down', { x: 1 }, loader);
        check('Redis mất: getOrSet vẫn trả dữ liệu từ loader, nhanh', down.n === 1 && Date.now() - t0 < 1000, `${Date.now() - t0}ms`);
        await cache.bump();
        startRedis();
        await sleep(1500);
        check('Redis chạy lại', await waitReady(redis));
        calls = 0;
        await cache.getOrSet('t:pending', { x: 1 }, loader);
        check('Lần đọc đầu sau khi Redis về chạy loader (bump bị lỡ đã được bù, không phục vụ cache cũ)', calls === 1);

        console.log('[3. HTTP: API công khai qua cache cho kết quả giống hệt khi không có cache]');
        const noCache = startServer({ REDIS_URL: '' });
        check('Server không Redis khởi động', await waitUp());
        const paths = ['/api/category?limit=100', '/api/teacher?limit=8', '/api/course?limit=12'];
        const baseline = {};
        for (const p of paths) baseline[p] = (await get(p)).body;
        const courseId = baseline['/api/course?limit=12']?.data?.items?.[0]?.id;
        if (courseId) baseline[`/api/course/${courseId}`] = (await get(`/api/course/${courseId}`)).body;
        await stopServer(noCache);

        server = startServer();
        check('Server có Redis khởi động', await waitUp());
        for (const p of Object.keys(baseline)) {
            const miss = await get(p);
            const hit = await get(p);
            check(`${p}: lần miss và lần hit đều giống bản không cache`, JSON.stringify(miss.body) === JSON.stringify(baseline[p]) && JSON.stringify(hit.body) === JSON.stringify(baseline[p]), `${miss.status}/${hit.status}`);
        }
        check('Khóa học không tồn tại vẫn 404 và không bị cache', (await get('/api/course/00000000-0000-0000-0000-000000000000')).status === 404);
        const q1 = await get('/api/course?q=l%E1%BA%ADp&limit=5');
        const before = (await redis.client.keys(redis.key('cache', 'course:list', '*'))).length;
        await get('/api/course?q=zzz%20khac&limit=5');
        const after = (await redis.client.keys(redis.key('cache', 'course:list', '*'))).length;
        check('Tìm kiếm theo từ khóa không tạo khóa cache', q1.status === 200 && before === after, `${before} -> ${after}`);

        console.log('[4. Làm mới cache khi dữ liệu thật đổi (tạo, sửa, xóa 1 danh mục tạm)]');
        prisma = require('../src/config/database');
        const name = `Cache Test ${STAMP}`;
        const has = async () => (await get('/api/category?limit=100')).body.data.items.some((c) => c.categoryName === name);
        check('Trước khi tạo: danh mục chưa có (và danh sách đã nằm trong cache)', (await has()) === false);
        const created = await prisma.category.create({ data: { categoryName: name, description: 'tạm', status: 'HOAT_DONG' } });
        tempCategoryId = created.id;
        check('Sau khi tạo danh mục: API thấy ngay (cache đã làm mới)', (await has()) === true);
        await prisma.category.update({ where: { id: created.id }, data: { status: 'AN' } });
        check('Sau khi ẩn danh mục: API không còn trả nó', (await has()) === false);
        const v0 = await redis.client.get(redis.key('cache', 'version'));
        await prisma.account.updateMany({ where: { id: 'khong-ton-tai' }, data: { passwordHash: 'x' } });
        await prisma.review.updateMany({ where: { id: 'khong-ton-tai' }, data: { status: 'HIEN_THI' } });
        const v1 = await redis.client.get(redis.key('cache', 'version'));
        await prisma.account.updateMany({ where: { id: 'khong-ton-tai' }, data: { fullName: 'x' } });
        const v2 = await redis.client.get(redis.key('cache', 'version'));
        check('Ghi Account đổi mật khẩu KHÔNG làm mới cache', Number(v1) === Number(v0) + 1, `${v0} -> ${v1} (chỉ review bump)`);
        check('Ghi Account đổi tên làm mới cache', Number(v2) === Number(v1) + 1, `${v1} -> ${v2}`);
    } finally {
        if (server) await stopServer(server);
        try { if (tempCategoryId && prisma) await prisma.category.delete({ where: { id: tempCategoryId } }); } catch { /* đã xóa */ }
        if (prisma) console.log(`\nDanh mục tạm còn sót: ${await prisma.category.count({ where: { categoryName: `Cache Test ${STAMP}` } })}`);
        try { docker('rm', '-f', CONTAINER); } catch { /* đã tự xóa */ }
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error('Lỗi khi chạy test:', e); try { docker('rm', '-f', CONTAINER); } catch { /* bỏ qua */ } process.exit(1); });
