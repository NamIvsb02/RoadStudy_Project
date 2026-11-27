// Kiểm tra rate limit dùng Redis: đếm đúng khi đồng thời, dùng chung giữa các instance, sống qua lần khởi động lại server,
// và tự lùi về bộ đếm RAM khi Redis mất. Tự bật một container Redis tạm (cổng 6392, tự xóa) và server riêng (cổng 5062).
// Không đụng dữ liệu DB (đăng nhập bằng email không tồn tại). Cần Docker. Chạy: node tests/ratelimit.redis.test.js
const { spawn, execFileSync } = require('child_process');
const path = require('path');

const REDIS_PORT = 6392;
const PORT = 5062;
const PASSWORD = 'test-only-password';
const CONTAINER = `roadstudy-rl-test-${Date.now()}`;
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

const startServer = () => spawn(process.execPath, ['src/app.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(PORT), STORAGE_DRIVER: 'local' },
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
const login = (email) => fetch(`http://localhost:${PORT}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password123!' }),
}).then((r) => r.status).catch(() => 0);

async function waitReady(redis) {
    for (let i = 0; i < 30 && !redis.isReady(); i++) await sleep(300);
    return redis.isReady();
}

async function main() {
    console.log('Kiểm tra rate limit dùng Redis\n');
    try { docker('version', '--format', '{{.Server.Version}}'); } catch { console.log('Dừng: Docker không chạy'); process.exit(1); }

    startRedis();
    await sleep(1500);
    let server;
    try {
        const redis = require('../src/config/redis');
        const { RedisFallbackStore } = require('../src/utils/rateLimitStore');
        check('Kết nối Redis tạm', await waitReady(redis));

        console.log('[1. Store: đếm đồng thời và dùng chung]');
        const mk = (name) => { const s = new RedisFallbackStore({ name }); s.init({ windowMs: 60000 }); return s; };
        const a = mk('t1');
        const hits = (await Promise.all(Array.from({ length: 50 }, () => a.increment('k')))).map((r) => r.totalHits).sort((x, y) => x - y);
        check('50 lần increment đồng thời cho ra đúng 1..50, không mất lượt', hits.every((h, i) => h === i + 1), hits.join(','));
        const b = mk('t1');
        check('Hai instance cùng tên dùng chung bộ đếm (lần tiếp theo = 51)', (await b.increment('k')).totalHits === 51);
        check('Limiter khác tên không đè khóa nhau', (await mk('t2').increment('k')).totalHits === 1);
        const ttl = await redis.client.pttl(redis.key('ratelimit', 't1', 'k'));
        check('Khóa có hạn xấp xỉ windowMs (không tồn tại vĩnh viễn)', ttl > 0 && ttl <= 60000, `${ttl}`);
        const r1 = await a.increment('k');
        check('resetTime nằm trong cửa sổ 60 giây', r1.resetTime.getTime() - Date.now() <= 60000 && r1.resetTime.getTime() > Date.now());
        await a.decrement('k');
        check('decrement giảm bộ đếm 1', (await a.increment('k')).totalHits === 52);
        await a.resetKey('k');
        check('resetKey xóa bộ đếm (lần sau = 1)', (await a.increment('k')).totalHits === 1);

        console.log('[2. Store: Redis mất giữa chừng thì lùi về RAM, tự quay lại]');
        docker('stop', '-t', '0', CONTAINER);
        for (let i = 0; i < 30 && redis.isReady(); i++) await sleep(300);
        const t0 = Date.now();
        const during = [];
        for (let i = 0; i < 5; i++) during.push((await a.increment("mem")).totalHits);
        check('Không ném lỗi, đếm tiếp bằng RAM: 1..5', during.join(',') === '1,2,3,4,5', during.join(','));
        check('Không bị treo chờ Redis (5 lượt dưới 1 giây)', Date.now() - t0 < 1000, `${Date.now() - t0}ms`);
        startRedis();
        await sleep(1500);
        check('Redis chạy lại, client tự nối', await waitReady(redis));
        check('Quay lại đếm bằng Redis (bộ đếm Redis bắt đầu lại từ 1)', (await a.increment('after')).totalHits === 1);

        console.log('[3. HTTP: đăng nhập 10 lần/phút theo IP + email, bằng Redis]');
        const email = `ratelimit.${STAMP}@example.com`;
        server = startServer();
        check('Server khởi động với Redis', await waitUp());
        const codes = [];
        for (let i = 0; i < 11; i++) codes.push(await login(email));
        check('10 lần đầu qua (401 sai thông tin), lần thứ 11 bị 429', codes.slice(0, 10).every((c) => c === 401) && codes[10] === 429, codes.join(','));
        await stopServer(server);
        server = startServer();
        await waitUp();
        check('Khởi động lại server: bộ đếm còn trong Redis, lần tiếp vẫn 429', (await login(email)) === 429);
        const other = await login(`other.${STAMP}@example.com`);
        check('Email khác không bị chặn lây', other === 401, `${other}`);

        console.log('[4. HTTP: Redis mất thì server vẫn giới hạn bằng RAM, không lỗi 5xx]');
        docker('stop', '-t', '0', CONTAINER);
        await sleep(1500);
        const email2 = `ratelimit2.${STAMP}@example.com`;
        const codes2 = [];
        for (let i = 0; i < 11; i++) codes2.push(await login(email2));
        check('Redis mất: vẫn 10 lần 401 rồi 429, không có 5xx', codes2.slice(0, 10).every((c) => c === 401) && codes2[10] === 429, codes2.join(','));
    } finally {
        if (server) await stopServer(server);
        try { docker('rm', '-f', CONTAINER); } catch { /* đã tự xóa */ }
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error('Lỗi khi chạy test:', e); try { docker('rm', '-f', CONTAINER); } catch { /* bỏ qua */ } process.exit(1); });
