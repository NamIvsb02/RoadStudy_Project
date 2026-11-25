// Kiểm tra khả năng chịu tải: lỗi DB quá tải trả 503, cấu hình pool, đăng ký không chờ gửi email.
// Phần 1-2 không cần DB hay server. Phần 3 tự bật một server riêng (cổng 5058) có SMTP trỏ vào địa chỉ không phản hồi,
// tạo 1 tài khoản tạm trên DB và xóa ngay. Chạy: node tests/resilience.test.js
require('dotenv').config({ quiet: true });
const { spawn } = require('child_process');
const { Prisma } = require('@prisma/client');
const errorHandler = require('../src/middlewares/errorHandler');
const AppError = require('../src/utils/AppError');
const { buildDatasourceUrl } = require('../src/config/database');
const prisma = require('../src/config/database');

let passed = 0;
let failed = 0;
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function run(err) {
    const res = { code: null, body: null, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
    const originalError = console.error;
    console.error = () => {};
    errorHandler(err, { id: 'req-test-1' }, res, () => {});
    console.error = originalError;
    return res;
}
const known = (code) => new Prisma.PrismaClientKnownRequestError('x', { code, clientVersion: 'test' });

async function main() {
    console.log('Kiểm tra khả năng chịu tải\n');

    console.log('[1. errorHandler: DB quá tải trả 503 thay vì 500]');
    for (const code of ['P2024', 'P2028']) {
        const r = run(known(code));
        check(`${code} (hết kết nối / không mở được transaction) -> 503 có Retry-After`, r.code === 503 && r.headers['Retry-After'] === '5' && r.body.success === false && /bận/.test(r.body.message), `${r.code} ${JSON.stringify(r.headers)}`);
    }
    let r = run(new Prisma.PrismaClientInitializationError("Can't reach database server", 'test', 'P1001'));
    check('Không kết nối được DB (PrismaClientInitializationError) -> 503', r.code === 503 && r.headers['Retry-After'] === '5', `${r.code}`);
    r = run(known('P2002'));
    check('P2002 vẫn là 409, không có Retry-After', r.code === 409 && !r.headers['Retry-After']);
    r = run(known('P2025'));
    check('P2025 vẫn là 404', r.code === 404);
    r = run(new AppError('Sai dữ liệu', 400));
    check('AppError giữ nguyên mã và thông báo', r.code === 400 && r.body.message === 'Sai dữ liệu');
    r = run(new Error('lỗi lạ có thông tin nội bộ postgres://user:pass@host'));
    check('Lỗi không lường trước -> 500, kèm mã truy vết, không lộ thông tin nội bộ', r.code === 500 && /req-test-1/.test(r.body.message) && !/postgres|pass/.test(r.body.message), r.body.message);

    console.log('[2. Cấu hình pool kết nối]');
    const saved = { url: process.env.DATABASE_URL, limit: process.env.DB_CONNECTION_LIMIT, timeout: process.env.DB_POOL_TIMEOUT };
    try {
        process.env.DB_CONNECTION_LIMIT = '30';
        process.env.DB_POOL_TIMEOUT = '20';
        check('Thêm connection_limit và pool_timeout vào URL không có tham số', buildDatasourceUrl('postgresql://u:p@h/db') === 'postgresql://u:p@h/db?connection_limit=30&pool_timeout=20', buildDatasourceUrl('postgresql://u:p@h/db'));
        check('Giữ tham số khác (pgbouncer) và thêm tham số mới', buildDatasourceUrl('postgresql://u:p@h:6543/db?pgbouncer=true') === 'postgresql://u:p@h:6543/db?pgbouncer=true&connection_limit=30&pool_timeout=20');
        check('Biến môi trường ghi đè tham số có sẵn trong URL', buildDatasourceUrl('postgresql://u:p@h/db?connection_limit=5') === 'postgresql://u:p@h/db?connection_limit=30&pool_timeout=20');
        check('Mật khẩu có ký tự mã hóa (%40) không bị đổi', buildDatasourceUrl('postgresql://u:p%40ss%23@h/db').startsWith('postgresql://u:p%40ss%23@h/db?'));
        process.env.DB_CONNECTION_LIMIT = '';
        process.env.DB_POOL_TIMEOUT = '';
        check('Để trống hai biến: URL giữ nguyên', buildDatasourceUrl('postgresql://u:p@h/db?x=1') === 'postgresql://u:p@h/db?x=1');
        process.env.DB_CONNECTION_LIMIT = 'abc';
        process.env.DB_POOL_TIMEOUT = '-3';
        check('Giá trị không hợp lệ (chữ, số âm): bỏ qua', buildDatasourceUrl('postgresql://u:p@h/db') === 'postgresql://u:p@h/db');
    } finally {
        process.env.DB_CONNECTION_LIMIT = saved.limit ?? '';
        process.env.DB_POOL_TIMEOUT = saved.timeout ?? '';
    }

    console.log('[3. Đăng ký không chờ gửi email]');
    const port = 5058;
    const stamp = Date.now();
    const email = `resilience.${stamp}@example.com`;
    // SMTP trỏ vào địa chỉ không phản hồi: nếu đăng ký còn chờ email thì sẽ treo ~10 giây (SMTP timeout)
    const server = spawn(process.execPath, ['src/app.js'], {
        cwd: require('path').join(__dirname, '..'),
        env: { ...process.env, PORT: String(port), SMTP_HOST: '10.255.255.1', SMTP_USER: 'x', SMTP_PASS: 'x', STORAGE_DRIVER: 'local' },
        stdio: 'ignore',
    });
    try {
        let up = false;
        for (let i = 0; i < 40 && !up; i++) {
            up = await fetch(`http://localhost:${port}/health`).then((res) => res.ok).catch(() => false);
            if (!up) await sleep(500);
        }
        check('Server thử khởi động', up);
        const t0 = Date.now();
        const res = await fetch(`http://localhost:${port}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'STUDENT', fullName: 'Resilience Test', email, password: 'Password123!' }),
        });
        const ms = Date.now() - t0;
        const json = await res.json().catch(() => null);
        check(`Đăng ký trả 201 dù SMTP không phản hồi (${ms} ms, ngưỡng 6000 ms)`, res.status === 201 && json?.success === true && ms < 6000, `${res.status} ${ms}ms ${json?.message}`);
        const account = await prisma.account.findUnique({ where: { email } });
        check('Tài khoản ở trạng thái CHO_XAC_MINH', account?.status === 'CHO_XAC_MINH');
        const otps = account ? await prisma.otpCode.count({ where: { accountId: account.id } }) : 0;
        check('Mã OTP đã được tạo trong DB trước khi trả kết quả (người dùng vẫn dùng được nút gửi lại)', otps === 1, `${otps}`);
    } finally {
        server.kill();
        const account = await prisma.account.findUnique({ where: { email } }).catch(() => null);
        if (account) {
            await prisma.otpCode.deleteMany({ where: { accountId: account.id } }).catch(() => {});
            await prisma.student.deleteMany({ where: { accountId: account.id } }).catch(() => {});
            await prisma.account.delete({ where: { id: account.id } }).catch(() => {});
        }
        console.log(`\nBản ghi còn sót: ${await prisma.account.count({ where: { email: { contains: `.${stamp}@` } } })}`);
        await prisma.$disconnect();
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    process.exit(failed ? 1 : 0);
}
main().catch(async (e) => { console.error('Lỗi khi chạy test:', e); await prisma.$disconnect().catch(() => {}); process.exit(1); });
