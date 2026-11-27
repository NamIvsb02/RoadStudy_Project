// Kiểm tra các bản sửa P0: OTP/rate limit, xoay vòng refresh token, hoàn tiền và hóa đơn đồng thời.
// Chạy: bật `npm run dev` (server mới, bộ đếm rate limit trong RAM còn trống) rồi `node tests/security.p0.test.js`.
// Test chạy trên DB dùng chung: dữ liệu tạo ra được dọn trong finally.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const prisma = require('../src/config/database');
const { signAccessToken, signRefreshToken } = require('../src/utils/jwt');
const { sha256 } = require('../src/utils/hash');

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const PROOF_DIR = path.join(__dirname, '../uploads');
let passed = 0;
let failed = 0;

const call = async (method, p, { id, role, body, form } = {}) => {
    const token = role ? signAccessToken({ sub: id, role }) : null;
    const headers = { ...(token && { Authorization: `Bearer ${token}` }) };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const res = await fetch(API + p, { method, headers, body: form ?? (body !== undefined ? JSON.stringify(body) : undefined) });
    let json = null;
    try { json = await res.json(); } catch (_) { }
    return { status: res.status, json, msg: json?.message };
};
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const countBy = (list, status) => list.filter((r) => r.status === status).length;

async function main() {
    console.log(`Kiểm tra P0 bảo mật tại ${API}\n`);
    const stamp = Date.now();
    const fx = { accounts: [], students: [], teachers: [], categories: [] };
    const safe = async (fn) => { try { await fn(); } catch (e) { console.log('  (dọn lỗi)', e.message); } };

    try {
        const leader = await prisma.account.findUnique({ where: { email: 'leader@roadstudy.vn' } });
        if (!leader) throw new Error('Không thấy leader@roadstudy.vn');
        const LEADER = { id: leader.id, role: 'ADMINISTRATOR' };
        const passwordHash = await bcrypt.hash('Password123!', 4);
        const mkAcc = async (name, role, extra = {}) => {
            const a = await prisma.account.create({ data: { fullName: name, email: `${name.replace(/\s/g, '').toLowerCase()}.${stamp}@example.com`, passwordHash, role, status: 'HOAT_DONG', ...extra } });
            fx.accounts.push(a.id);
            return a;
        };
        const mkStudent = async (name, extra) => {
            const account = await mkAcc(name, 'STUDENT', extra);
            const student = await prisma.student.create({ data: { accountId: account.id } });
            fx.students.push(student.id);
            return { account, student };
        };

        // 1. OTP
        console.log('[1. OTP: giới hạn lần nhập sai và thời gian chờ gửi lại]');
        const V = await mkStudent('HV Otp', { status: 'CHO_XAC_MINH' });
        const otp = await prisma.otpCode.create({ data: { accountId: V.account.id, purpose: 'XAC_MINH_EMAIL', codeHash: await bcrypt.hash('123456', 4), expiresAt: new Date(Date.now() + 600000) } });
        let r;
        for (let i = 1; i <= 5; i++) {
            r = await call('POST', '/auth/verify-email', { body: { email: V.account.email, code: '000000' } });
            check(`Nhập sai lần ${i} -> 400`, r.status === 400, `${r.status} ${r.msg}`);
        }
        check('Lần sai thứ 5 báo "quá nhiều lần"', /quá nhiều lần/.test(r.msg || ''), r.msg);
        r = await call('POST', '/auth/verify-email', { body: { email: V.account.email, code: '123456' } });
        check('Sau 5 lần sai, nhập ĐÚNG mã vẫn bị từ chối (400)', r.status === 400, `${r.status} ${r.msg}`);
        check('Tài khoản vẫn CHO_XAC_MINH', (await prisma.account.findUnique({ where: { id: V.account.id } })).status === 'CHO_XAC_MINH');
        r = await call('POST', '/auth/resend-otp', { body: { email: V.account.email, purpose: 'XAC_MINH_EMAIL' } });
        check('Gửi lại OTP trong 60 giây -> 429', r.status === 429 && /đợi/.test(r.msg || ''), `${r.status} ${r.msg}`);

        // Một mã chỉ dùng được một lần, kể cả khi gửi đồng thời
        const V2 = await mkStudent('HV Otp Hai', { status: 'CHO_XAC_MINH' });
        await prisma.otpCode.create({ data: { accountId: V2.account.id, purpose: 'XAC_MINH_EMAIL', codeHash: await bcrypt.hash('654321', 4), expiresAt: new Date(Date.now() + 600000) } });
        const par = await Promise.all([1, 2, 3].map(() => call('POST', '/auth/verify-email', { body: { email: V2.account.email, code: '654321' } })));
        check('3 request cùng mã đúng: đúng 1 lần 200', countBy(par, 200) === 1, par.map((x) => x.status).join(','));

        // Quên mật khẩu không lộ email nào tồn tại
        const F = await mkStudent('HV Quen Mk');
        const first = await call('POST', '/auth/forgot-password', { body: { email: F.account.email } });
        const second = await call('POST', '/auth/forgot-password', { body: { email: F.account.email } });
        const ghost = await call('POST', '/auth/forgot-password', { body: { email: `khong.ton.tai.${stamp}@example.com` } });
        check('forgot-password lần 1 -> 200', first.status === 200, `${first.status} ${first.msg}`);
        check('forgot-password lần 2 trong 60 giây vẫn -> 200 (không lộ email)', second.status === 200 && second.msg === ghost.msg && ghost.status === 200, `${second.status} ${second.msg} | ${ghost.status} ${ghost.msg}`);

        // 2. Rate limit đăng nhập
        console.log('[2. Rate limit đăng nhập theo IP + email]');
        const L1 = await mkStudent('HV Dang Nhap Mot');
        const L2 = await mkStudent('HV Dang Nhap Hai');
        const logins = [];
        for (let i = 0; i < 11; i++) logins.push(await call('POST', '/auth/login', { body: { email: L1.account.email, password: 'sai-mat-khau' } }));
        check('10 lần sai đầu -> 401', logins.slice(0, 10).every((x) => x.status === 401), logins.map((x) => x.status).join(','));
        check('Lần thứ 11 -> 429', logins[10].status === 429, `${logins[10].status} ${logins[10].msg}`);
        r = await call('POST', '/auth/login', { body: { email: L2.account.email, password: 'Password123!' } });
        check('Email khác cùng IP vẫn đăng nhập được -> 200', r.status === 200, `${r.status} ${r.msg}`);

        // 3. Refresh token
        console.log('[3. Refresh token: xoay vòng nguyên tử, phát hiện dùng lại]');
        const RT = await mkStudent('HV Refresh');
        const issue = async () => {
            const token = signRefreshToken({ sub: RT.account.id, jti: `${stamp}-${Math.random()}` });
            await prisma.refreshToken.create({ data: { accountId: RT.account.id, tokenHash: sha256(token), expiresAt: new Date(Date.now() + 86400000) } });
            return token;
        };
        const refresh = (t) => call('POST', '/auth/refresh', { body: { refreshToken: t } });
        const t0 = await issue();
        const both = await Promise.all([refresh(t0), refresh(t0)]);
        check('2 request refresh song song cùng token: đúng 1 lần 200', countBy(both, 200) === 1 && countBy(both, 401) === 1, both.map((x) => x.status).join(','));

        const t1 = await issue();
        const rot = await refresh(t1);
        check('Refresh bình thường -> 200 có token mới', rot.status === 200 && !!rot.json?.data?.refreshToken, `${rot.status} ${rot.msg}`);
        const t2 = rot.json?.data?.refreshToken;
        r = await refresh(t1);
        check('Dùng lại token cũ ngay lập tức (trong 10 giây ân hạn) -> 401', r.status === 401, `${r.status} ${r.msg}`);
        const next = await refresh(t2);
        check('Trong ân hạn, token mới vẫn dùng được (hai tab không bị đăng xuất)', next.status === 200, `${next.status} ${next.msg}`);
        const t3 = next.json?.data?.refreshToken;
        console.log('  ... chờ 11 giây để token cũ quá ân hạn');
        await sleep(11000);
        r = await refresh(t1);
        check('Dùng lại token cũ sau ân hạn -> 401', r.status === 401, `${r.status} ${r.msg}`);
        r = await refresh(t3);
        check('Phát hiện dùng lại: token mới nhất cũng bị thu hồi -> 401', r.status === 401, `${r.status} ${r.msg}`);

        // Dữ liệu cho hoàn tiền / hóa đơn
        const tAcc = await mkAcc('GV P0', 'TEACHER');
        const teacher = await prisma.teacher.create({ data: { specialization: 'T', biography: 'T', teachingExperience: 'T', approvalStatus: 'DA_DUYET', accountId: tAcc.id } });
        fx.teachers.push(teacher.id);
        const cat = await prisma.category.create({ data: { categoryName: `P0 ${stamp}` } });
        fx.categories.push(cat.id);
        const course = await prisma.course.create({ data: { courseName: `Khoa P0 ${stamp}`, description: 'p0', price: 1000000, status: 'DANG_MO', startDate: new Date('2030-01-01'), endDate: new Date('2030-06-01'), categoryId: cat.id, teacherId: teacher.id } });

        // 4. Hoàn tiền đồng thời
        console.log('[4. Yêu cầu hoàn tiền gửi đồng thời]');
        const RF = await mkStudent('HV Hoan Tien');
        const regPaid = await prisma.courseRegistration.create({ data: { studentId: RF.student.id, courseId: course.id, status: 'DA_THANH_TOAN', amountPaid: 1000000 } });
        const invPaid = await prisma.invoice.create({ data: { subtotal: 1000000, totalAmount: 1000000, paymentMethod: 'CHUYEN_KHOAN', status: 'DA_THANH_TOAN', paidAt: new Date(), studentId: RF.student.id, registrationId: regPaid.id } });
        const STU_RF = { id: RF.account.id, role: 'STUDENT' };
        const refunds = await Promise.all([1, 2, 3, 4, 5].map(() => call('POST', `/invoice/${invPaid.id}/refund-request`, { ...STU_RF, body: { description: `Hoan tien ${stamp}` } })));
        check('5 yêu cầu hoàn tiền song song: đúng 1 lần 201, 4 lần 409', countBy(refunds, 201) === 1 && countBy(refunds, 409) === 4, refunds.map((x) => x.status).join(','));
        check('DB chỉ có 1 yêu cầu chờ xử lý', (await prisma.supportRequest.count({ where: { registrationId: regPaid.id } })) === 1);

        // 5. Gửi minh chứng song song với admin duyệt
        console.log('[5. Hóa đơn: gửi minh chứng song song với admin duyệt]');
        const IV = await mkStudent('HV Hoa Don');
        const regWait = await prisma.courseRegistration.create({ data: { studentId: IV.student.id, courseId: course.id, status: 'CHO_THANH_TOAN' } });
        const invWait = await prisma.invoice.create({ data: { subtotal: 1000000, totalAmount: 1000000, paymentMethod: 'CHUYEN_KHOAN', status: 'CHO_THANH_TOAN', paymentProofUrl: 'proofs/seed-p0.png', studentId: IV.student.id, registrationId: regWait.id } });
        const STU_IV = { id: IV.account.id, role: 'STUDENT' };
        const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
        const mkForm = () => { const f = new FormData(); f.append('proof', new Blob([png], { type: 'image/png' }), 'p.png'); return f; };
        const VALID = new Set(['DA_THANH_TOAN/DA_THANH_TOAN', 'CHO_THANH_TOAN/CHO_THANH_TOAN']);
        let lệch = 0;
        const outcomes = [];
        for (let i = 0; i < 10; i++) {
            await prisma.invoice.update({ where: { id: invWait.id }, data: { status: 'CHO_THANH_TOAN', paymentProofUrl: 'proofs/seed-p0.png', paidAt: null } });
            await prisma.courseRegistration.update({ where: { id: regWait.id }, data: { status: 'CHO_THANH_TOAN' } });
            const [up, ap] = await Promise.all([
                call('POST', `/invoice/${invWait.id}/proof`, { ...STU_IV, form: mkForm() }),
                call('PATCH', `/invoice/${invWait.id}/approve`, LEADER),
            ]);
            outcomes.push(`${up.status}/${ap.status}`);
            const [inv, reg] = await Promise.all([prisma.invoice.findUnique({ where: { id: invWait.id } }), prisma.courseRegistration.findUnique({ where: { id: regWait.id } })]);
            if (!VALID.has(`${inv.status}/${reg.status}`)) lệch++;
            if (inv.paymentProofUrl && inv.paymentProofUrl !== 'proofs/seed-p0.png') await safe(() => fs.promises.unlink(path.join(PROOF_DIR, inv.paymentProofUrl)));
        }
        check('10 vòng upload + approve: hóa đơn và đơn luôn cùng trạng thái hợp lệ', lệch === 0, `lệch ${lệch} vòng; kết quả upload/approve: ${outcomes.join(' ')}`);

        // 6. Chatbot: giới hạn khi gửi dồn và hạn mức ngày
        console.log('[6. Chatbot: gửi dồn và hạn mức 50 tin/24 giờ]');
        const CB = await mkStudent('HV Chatbot');
        const STU_CB = { id: CB.account.id, role: 'STUDENT' };
        const burst = await Promise.all(Array.from({ length: 20 }, (_, i) => call('POST', '/chatbot/messages', { ...STU_CB, body: { content: `khoa hoc test ${i}` } })));
        const okCount = burst.filter((x) => x.status === 201 || x.status === 200).length;
        check('Gửi 20 tin cùng lúc: tối đa 6 tin qua, còn lại 429, không lỗi 500', okCount >= 1 && okCount <= 6 && okCount + countBy(burst, 429) === 20, burst.map((x) => x.status).join(','));
        check('DB lưu đúng số tin đã qua (không vượt 6)', (await prisma.aiMessage.count({ where: { senderType: 'STUDENT', conversation: { studentId: CB.student.id } } })) === okCount);
        const CB2 = await mkStudent('HV Chatbot Hai');
        const STU_CB2 = { id: CB2.account.id, role: 'STUDENT' };
        const conv = await prisma.aiConversation.create({ data: { studentId: CB2.student.id } });
        await prisma.aiMessage.createMany({ data: Array.from({ length: 50 }, (_, i) => ({ senderType: 'STUDENT', content: `cu ${i}`, conversationId: conv.id, sentAt: new Date(Date.now() - 3600 * 1000 - i) })) });
        r = await call('POST', '/chatbot/messages', { ...STU_CB2, body: { content: 'them mot tin' } });
        check('Đã đủ 50 tin trong 24 giờ -> 429 báo hạn mức ngày', r.status === 429 && /24 giờ/.test(r.msg || ''), `${r.status} ${r.msg}`);
    } finally {
        const ids = fx.accounts;
        await safe(() => prisma.courseRecommendation.deleteMany({ where: { message: { conversation: { studentId: { in: fx.students } } } } }));
        await safe(() => prisma.aiMessage.deleteMany({ where: { conversation: { studentId: { in: fx.students } } } }));
        await safe(() => prisma.aiConversation.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.notification.deleteMany({ where: { accountId: { in: ids } } }));
        await safe(() => prisma.otpCode.deleteMany({ where: { accountId: { in: ids } } }));
        await safe(() => prisma.refreshToken.deleteMany({ where: { accountId: { in: ids } } }));
        await safe(() => prisma.supportRequest.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.invoice.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.courseRegistration.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.course.deleteMany({ where: { categoryId: { in: fx.categories } } }));
        await safe(() => prisma.category.deleteMany({ where: { id: { in: fx.categories } } }));
        await safe(() => prisma.student.deleteMany({ where: { id: { in: fx.students } } }));
        await safe(() => prisma.teacher.deleteMany({ where: { id: { in: fx.teachers } } }));
        await safe(() => prisma.account.deleteMany({ where: { id: { in: ids } } }));
        const left = {
            accounts: await prisma.account.count({ where: { email: { contains: `.${stamp}@` } } }),
            categories: await prisma.category.count({ where: { categoryName: { contains: String(stamp) } } }),
            courses: await prisma.course.count({ where: { courseName: { contains: String(stamp) } } }),
            otp: await prisma.otpCode.count({ where: { accountId: { in: ids } } }),
        };
        console.log('\nBản ghi còn sót theo hậu tố', stamp, JSON.stringify(left));
        check('Đã dọn sạch dữ liệu test', Object.values(left).every((v) => v === 0));
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    await prisma.$disconnect();
    process.exit(failed ? 1 : 0);
}
main().catch(async (e) => { console.error('Lỗi khi chạy test:', e); await prisma.$disconnect().catch(() => {}); process.exit(1); });
