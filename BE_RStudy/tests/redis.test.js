// Kiểm tra hạ tầng Redis: tắt được bằng REDIS_URL trống, Redis lỗi/mất giữa chừng không làm hỏng server, tự nối lại.
// Tự bật server riêng (cổng 5059) và một container Redis tạm (cổng 6391, chỉ nghe 127.0.0.1, tự xóa khi xong).
// Không đụng DB (chỉ SELECT 1 qua /health/ready) và không đụng container roadstudy-*. Cần Docker cho phần Redis thật.
// Chạy: node tests/redis.test.js
require('dotenv').config({ quiet: true });
const { spawn, execFileSync } = require('child_process');
const path = require('path');

let passed = 0;
let failed = 0;
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 5059;
const REDIS_PORT = 6391;
const PASSWORD = 'test-only-password';
const CONTAINER = `roadstudy-redis-test-${Date.now()}`;
const docker = (...args) => execFileSync('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

function startServer(redisUrl) {
    return spawn(process.execPath, ['src/app.js'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, PORT: String(PORT), STORAGE_DRIVER: 'local', REDIS_URL: redisUrl, REDIS_KEY_ENV: 'test' },
        stdio: 'ignore',
    });
}
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
const ready = async () => {
    const t0 = Date.now();
    const res = await fetch(`http://localhost:${PORT}/health/ready`);
    return { status: res.status, body: await res.json().catch(() => null), ms: Date.now() - t0 };
};
async function waitRedis(expected, tries = 20) {
    let r;
    for (let i = 0; i < tries; i++) {
        r = await ready();
        if (r.body?.redis === expected) return r;
        await sleep(500);
    }
    return r;
}

async function main() {
    console.log('Kiểm tra hạ tầng Redis\n');

    console.log('[1. Module config: tiền tố khóa theo môi trường]');
    const probe = (env) => execFileSync(process.execPath, ['-e', "const r=require('./src/config/redis');console.log(JSON.stringify({e:r.isEnabled(),k:r.key('cache','course'),h:null}));r.close()"], {
        cwd: path.join(__dirname, '..'), env: { ...process.env, REDIS_URL: '', ...env },
    }).toString().trim();
    const a = JSON.parse(probe({ REDIS_KEY_ENV: 'prod' }));
    check('REDIS_URL trống -> isEnabled() = false', a.e === false);
    check('Khóa có tiền tố môi trường: roadstudy:prod:cache:course', a.k === 'roadstudy:prod:cache:course', a.k);
    const b = JSON.parse(probe({ REDIS_KEY_ENV: '', NODE_ENV: 'staging' }));
    check('Không đặt REDIS_KEY_ENV thì lấy NODE_ENV', b.k === 'roadstudy:staging:cache:course', b.k);

    console.log('[2. Redis tắt (REDIS_URL trống)]');
    let server = startServer('');
    try {
        check('Server khởi động', await waitUp());
        const r = await ready();
        check('/health/ready -> 200, redis = "disabled"', r.status === 200 && r.body.redis === 'disabled', JSON.stringify(r));
    } finally { await stopServer(server); }

    console.log('[3. Redis cấu hình nhưng không chạy (cổng 6399): server vẫn phục vụ]');
    server = startServer(`redis://:${PASSWORD}@127.0.0.1:6399`);
    try {
        check('Server khởi động dù Redis chết', await waitUp());
        const r = await ready();
        check('/health/ready vẫn 200, redis = "down", không treo', r.status === 200 && r.body.redis === 'down' && r.ms < 3000, JSON.stringify(r));
        const t0 = Date.now();
        const res = await fetch(`http://localhost:${PORT}/api/category`).catch(() => null);
        check('API công khai không bị Redis chết làm chậm hoặc lỗi 5xx', res && res.status < 500 && Date.now() - t0 < 8000, `${res?.status} ${Date.now() - t0}ms`);
    } finally { await stopServer(server); }

    console.log('[4. Redis thật: ok, mất giữa chừng, tự nối lại]');
    let dockerOk = true;
    try { docker('version', '--format', '{{.Server.Version}}'); } catch { dockerOk = false; }
    if (!dockerOk) {
        console.log('  BỎ QUA  Docker không chạy, chưa kiểm chứng phần Redis thật');
    } else {
        const startRedis = () => docker('run', '-d', '--rm', '--name', CONTAINER, '-p', `127.0.0.1:${REDIS_PORT}:6379`, 'redis:7-alpine', 'redis-server', '--requirepass', PASSWORD, '--save', '', '--appendonly', 'no');
        try {
            startRedis();
            await sleep(1500);
            server = startServer(`redis://:${PASSWORD}@127.0.0.1:${REDIS_PORT}`);
            check('Server khởi động', await waitUp());
            let r = await waitRedis('ok');
            check('/health/ready -> redis = "ok"', r.status === 200 && r.body.redis === 'ok', JSON.stringify(r));

            docker('stop', '-t', '0', CONTAINER);
            r = await waitRedis('down');
            check('Redis dừng giữa chừng -> /health/ready vẫn 200, redis = "down", không treo', r.status === 200 && r.body.redis === 'down' && r.ms < 3000, JSON.stringify(r));
            const res = await fetch(`http://localhost:${PORT}/api/category`).catch(() => null);
            check('API công khai vẫn phục vụ khi Redis mất', res && res.status < 500, `${res?.status}`);

            startRedis();
            await sleep(1500);
            r = await waitRedis('ok', 30);
            check('Redis chạy lại -> server tự nối lại, redis = "ok"', r.body?.redis === 'ok', JSON.stringify(r));
        } finally {
            if (server) await stopServer(server);
            try { docker('rm', '-f', CONTAINER); } catch { /* đã tự xóa */ }
        }
    }

    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error('Lỗi khi chạy test:', e); try { docker('rm', '-f', CONTAINER); } catch { /* bỏ qua */ } process.exit(1); });
