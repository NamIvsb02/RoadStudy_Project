// Kiểm tra luồng tiền: minh chứng thanh toán, duyệt/từ chối hóa đơn, yêu cầu hoàn tiền (học viên và admin).
// Chạy: bật `npm run dev` rồi `node tests/invoice.test.js`. Test chạy trên DB dùng chung và dọn dữ liệu trong finally.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prisma = require('../src/config/database');
const { signAccessToken } = require('../src/utils/jwt');

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const UPLOAD_ROOT = path.join(__dirname, '../uploads');
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
const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
const pngForm = () => { const f = new FormData(); f.append('proof', new Blob([png], { type: 'image/png' }), 'p.png'); return f; };
const textForm = () => { const f = new FormData(); f.append('proof', new Blob(['xin chao'], { type: 'text/plain' }), 'p.txt'); return f; };

async function main() {
    console.log(`Kiểm tra luồng hóa đơn và hoàn tiền tại ${API}\n`);
    const stamp = Date.now();
    const fx = { accounts: [], students: [], teachers: [], categories: [], invoices: [] };
    const safe = async (fn) => { try { await fn(); } catch (e) { console.log('  (dọn lỗi)', e.message); } };

    try {
        const leader = await prisma.account.findUnique({ where: { email: 'leader@roadstudy.vn' } });
        if (!leader) throw new Error('Không thấy leader@roadstudy.vn');
        const LEADER = { id: leader.id, role: 'ADMINISTRATOR' };
        const mkAcc = async (name, role) => {
            const a = await prisma.account.create({ data: { fullName: name, email: `${name.replace(/\s/g, '').toLowerCase()}.${stamp}@example.com`, passwordHash: 'x', role, status: 'HOAT_DONG' } });
            fx.accounts.push(a.id);
            return a;
        };
        const mkStudent = async (name) => {
            const account = await mkAcc(name, 'STUDENT');
            const student = await prisma.student.create({ data: { accountId: account.id } });
            fx.students.push(student.id);
            return { account, student, auth: { id: account.id, role: 'STUDENT' } };
        };
        const tAcc = await mkAcc('GV Hoa Don', 'TEACHER');
        const teacher = await prisma.teacher.create({ data: { specialization: 'T', biography: 'T', teachingExperience: 'T', approvalStatus: 'DA_DUYET', accountId: tAcc.id } });
        fx.teachers.push(teacher.id);
        const adAcc = await mkAcc('Admin Khong Quyen HD', 'ADMINISTRATOR');
        const adm = await prisma.administrator.create({ data: { accountId: adAcc.id, isLeader: false } });
        const NOPERM = { id: adAcc.id, role: 'ADMINISTRATOR' };
        const cat = await prisma.category.create({ data: { categoryName: `HD ${stamp}` } });
        fx.categories.push(cat.id);
        const mkCourse = (name, price) => prisma.course.create({ data: { courseName: `${name} ${stamp}`, description: 'hd', price, status: 'DANG_MO', startDate: new Date('2030-01-01'), endDate: new Date('2030-06-01'), categoryId: cat.id, teacherId: teacher.id } });
        const paidCourse = await mkCourse('Khoa Co Phi', 1000000);
        const freeCourse = await mkCourse('Khoa Mien Phi', 0);

        const S1 = await mkStudent('HV Hoa Don Mot');
        const S2 = await mkStudent('HV Hoa Don Hai');

        // Tạo đơn + hóa đơn; mỗi lần gọi là một đơn riêng (mỗi đơn có luồng riêng)
        const mkInvoice = async (student, { course = paidCourse, status = 'CHO_THANH_TOAN', proof = false, paidAgoHours = null } = {}) => {
            const total = Number(course.price);
            const paid = status === 'DA_THANH_TOAN';
            const reg = await prisma.courseRegistration.create({ data: { studentId: student.student.id, courseId: course.id, status, amountPaid: paid ? total : 0 } });
            const inv = await prisma.invoice.create({ data: {
                subtotal: total, totalAmount: total, paymentMethod: 'CHUYEN_KHOAN', status,
                paidAt: paid ? new Date(Date.now() - (paidAgoHours ?? 0) * 3600 * 1000) : null,
                paymentProofUrl: proof ? 'proofs/seed-inv.png' : null,
                studentId: student.student.id, registrationId: reg.id } });
            fx.invoices.push(inv.id);
            return { reg, inv };
        };
        const state = async ({ reg, inv }) => ({
            reg: (await prisma.courseRegistration.findUnique({ where: { id: reg.id } })).status,
            inv: await prisma.invoice.findUnique({ where: { id: inv.id } }),
        });
        let r;
        const uuid = () => crypto.randomUUID();

        // 1. Gửi minh chứng
        console.log('[1. Gửi ảnh minh chứng]');
        const A = await mkInvoice(S1);
        r = await call('POST', `/invoice/${A.inv.id}/proof`);
        check('Không token -> 401', r.status === 401, `${r.status}`);
        r = await call('POST', `/invoice/${A.inv.id}/proof`, { ...LEADER, form: pngForm() });
        check('Admin gửi minh chứng -> 403', r.status === 403, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${A.inv.id}/proof`, { ...S2.auth, form: pngForm() });
        check('Học viên khác gửi minh chứng -> 404', r.status === 404, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${A.inv.id}/proof`, { ...S1.auth, form: textForm() });
        check('Sai định dạng (text/plain) -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${A.inv.id}/proof`, S1.auth);
        check('Không đính kèm file -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${A.inv.id}/proof`, { ...S1.auth, form: pngForm() });
        check('Gửi ảnh hợp lệ -> 200, vẫn CHO_THANH_TOAN', r.status === 200 && r.json?.data?.status === 'CHO_THANH_TOAN', `${r.status} ${r.msg}`);
        check('Hóa đơn đã lưu đường dẫn minh chứng', /^(proofs\/|https:\/\/res\.cloudinary\.com\/)/.test((await state(A)).inv.paymentProofUrl || ''));
        const getProof = (actor) => fetch(API + `/invoice/${A.inv.id}/proof`, { headers: actor ? { Authorization: `Bearer ${signAccessToken({ sub: actor.id, role: actor.role })}` } : {} });
        const proofRes = await getProof(S1.auth);
        const proofBytes = Buffer.from(await proofRes.arrayBuffer());
        check('Chủ hóa đơn xem minh chứng -> 200, đúng ảnh PNG', proofRes.status === 200 && /^image\//.test(proofRes.headers.get('content-type') || '') && proofBytes.subarray(1, 4).toString() === 'PNG', `${proofRes.status} ${proofRes.headers.get('content-type')}`);
        check('Học viên khác xem minh chứng -> 404', (await getProof(S2.auth)).status === 404);
        check('Không đăng nhập xem minh chứng -> 401', (await getProof(null)).status === 401);
        check('Leader xem minh chứng -> 200', (await getProof(LEADER)).status === 200);
        const Free = await mkInvoice(S1, { course: freeCourse, status: 'DA_THANH_TOAN' });
        r = await call('POST', `/invoice/${Free.inv.id}/proof`, { ...S1.auth, form: pngForm() });
        check('Hóa đơn đã thanh toán gửi thêm minh chứng -> 400', r.status === 400, `${r.status} ${r.msg}`);

        // 2. Admin duyệt / từ chối thanh toán
        console.log('[2. Admin duyệt và từ chối thanh toán]');
        const NoProof = await mkInvoice(S1);
        r = await call('PATCH', `/invoice/${NoProof.inv.id}/approve`, LEADER);
        check('Duyệt khi chưa có minh chứng -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/${A.inv.id}/approve`, S1.auth);
        check('Học viên duyệt hóa đơn -> 403', r.status === 403, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/${A.inv.id}/approve`, NOPERM);
        check('Admin thiếu quyền duyệt -> 403', r.status === 403, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/${uuid()}/approve`, LEADER);
        check('Duyệt hóa đơn không tồn tại -> 404', r.status === 404, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/${A.inv.id}/reject`, { ...LEADER, body: {} });
        check('Từ chối thiếu lý do -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/${A.inv.id}/reject`, { ...LEADER, body: { reason: 'Anh mo' } });
        check('Từ chối kèm lý do -> 200 THAT_BAI', r.status === 200 && r.json?.data?.status === 'THAT_BAI', `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/${A.inv.id}/approve`, LEADER);
        check('Duyệt hóa đơn đã bị từ chối (chưa gửi lại) -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${A.inv.id}/proof`, { ...S1.auth, form: pngForm() });
        const afterResend = await state(A);
        check('Gửi lại sau khi bị từ chối -> 200, về CHO_THANH_TOAN, xóa lý do cũ', r.status === 200 && afterResend.inv.status === 'CHO_THANH_TOAN' && afterResend.inv.rejectionReason === null, `${r.status} ${r.msg} ${afterResend.inv.status}`);
        const both = await Promise.all([call('PATCH', `/invoice/${A.inv.id}/approve`, LEADER), call('PATCH', `/invoice/${A.inv.id}/approve`, LEADER)]);
        const codes = both.map((x) => x.status).sort();
        check('2 admin duyệt cùng lúc: đúng 1 lần 200, lần kia 400 hoặc 409', codes[0] === 200 && [400, 409].includes(codes[1]), codes.join(','));
        const approved = await state(A);
        check('Sau duyệt: hóa đơn và đơn cùng DA_THANH_TOAN, có paidAt', approved.inv.status === 'DA_THANH_TOAN' && approved.reg === 'DA_THANH_TOAN' && !!approved.inv.paidAt, `${approved.inv.status}/${approved.reg}`);

        // 3. Yêu cầu hoàn tiền: học viên
        console.log('[3. Yêu cầu hoàn tiền của học viên]');
        const P = await mkInvoice(S1, { status: 'DA_THANH_TOAN', paidAgoHours: 1 });
        const body = { description: `Muon hoan tien ${stamp}` };
        r = await call('POST', `/invoice/${P.inv.id}/refund-request`, { ...S1.auth, body: {} });
        check('Thiếu lý do -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${P.inv.id}/refund-request`, { ...S2.auth, body });
        check('Hóa đơn của học viên khác -> 404', r.status === 404, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${P.inv.id}/refund-request`, { ...LEADER, body });
        check('Admin gửi yêu cầu hoàn tiền -> 403', r.status === 403, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${Free.inv.id}/refund-request`, { ...S1.auth, body });
        check('Khóa miễn phí -> 400', r.status === 400, `${r.status} ${r.msg}`);
        const Late = await mkInvoice(S1, { status: 'DA_THANH_TOAN', paidAgoHours: 25 });
        r = await call('POST', `/invoice/${Late.inv.id}/refund-request`, { ...S1.auth, body });
        check('Quá 24 giờ kể từ khi thanh toán -> 400', r.status === 400, `${r.status} ${r.msg}`);
        const Unsent = await mkInvoice(S1);
        r = await call('POST', `/invoice/${Unsent.inv.id}/refund-request`, { ...S1.auth, body });
        check('Chưa gửi minh chứng, chưa thanh toán -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('POST', `/invoice/${P.inv.id}/refund-request`, { ...S1.auth, body });
        check('Trong 24 giờ -> 201', r.status === 201, `${r.status} ${r.msg}`);
        const reqId = r.json?.data?.id;
        r = await call('POST', `/invoice/${P.inv.id}/refund-request`, { ...S1.auth, body });
        check('Gửi lần hai khi còn yêu cầu chờ -> 409', r.status === 409, `${r.status} ${r.msg}`);
        const Sent = await mkInvoice(S1, { proof: true });
        r = await call('POST', `/invoice/${Sent.inv.id}/refund-request`, { ...S1.auth, body });
        check('Đã gửi minh chứng, admin chưa duyệt -> 201', r.status === 201, `${r.status} ${r.msg}`);
        const sentReqId = r.json?.data?.id;
        r = await call('GET', '/invoice/refund-requests/me', S1.auth);
        check('Học viên xem yêu cầu của mình -> 200', r.status === 200 && r.json?.data?.items?.length >= 2, `${r.status} ${r.msg}`);

        // 4. Yêu cầu hoàn tiền: admin
        console.log('[4. Admin xử lý yêu cầu hoàn tiền]');
        r = await call('GET', '/invoice/refund-requests', S1.auth);
        check('Học viên xem danh sách yêu cầu của admin -> 403', r.status === 403, `${r.status} ${r.msg}`);
        r = await call('GET', '/invoice/refund-requests', NOPERM);
        check('Admin thiếu quyền XU_LY_HOAN_TIEN -> 403', r.status === 403, `${r.status} ${r.msg}`);
        r = await call('GET', '/invoice/refund-requests', LEADER);
        check('Leader xem danh sách -> 200', r.status === 200, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/refund-requests/${uuid()}/approve`, { ...LEADER, body: {} });
        check('Chấp thuận yêu cầu không tồn tại -> 404', r.status === 404, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/refund-requests/${reqId}/complete`, { ...LEADER, body: {} });
        check('Hoàn tất khi chưa chấp thuận -> 409', r.status === 409, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/refund-requests/${reqId}/approve`, { ...LEADER, body: { adminNote: 'ok' } });
        check('Chấp thuận -> 200 CHO_HOAN_TIEN', r.status === 200 && r.json?.data?.status === 'CHO_HOAN_TIEN', `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/refund-requests/${reqId}/approve`, { ...LEADER, body: {} });
        check('Chấp thuận lần hai -> 409', r.status === 409, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/refund-requests/${reqId}/reject`, { ...LEADER, body: { adminNote: 'khong' } });
        check('Từ chối yêu cầu đã chấp thuận -> 409', r.status === 409, `${r.status} ${r.msg}`);
        const done = await Promise.all([call('PATCH', `/invoice/refund-requests/${reqId}/complete`, { ...LEADER, body: {} }), call('PATCH', `/invoice/refund-requests/${reqId}/complete`, { ...LEADER, body: {} })]);
        const doneCodes = done.map((x) => x.status).sort();
        check('2 admin hoàn tất cùng lúc: đúng 1 lần 200, lần kia 409', doneCodes[0] === 200 && doneCodes[1] === 409, doneCodes.join(','));
        const refunded = await state(P);
        check('Sau hoàn tất: đơn và hóa đơn cùng HOAN_TIEN', refunded.reg === 'HOAN_TIEN' && refunded.inv.status === 'HOAN_TIEN', `${refunded.reg}/${refunded.inv.status}`);

        r = await call('PATCH', `/invoice/refund-requests/${sentReqId}/reject`, { ...LEADER, body: {} });
        check('Từ chối thiếu lý do -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/refund-requests/${sentReqId}/reject`, { ...LEADER, body: { adminNote: 'Hoan tat thanh toan', cancelRegistration: true } });
        const cancelled = await state(Sent);
        check('Từ chối kèm hủy đơn chưa thanh toán -> 200, đơn và hóa đơn DA_HUY', r.status === 200 && cancelled.reg === 'DA_HUY' && cancelled.inv.status === 'DA_HUY', `${r.status} ${r.msg} ${cancelled.reg}/${cancelled.inv.status}`);

        const P2 = await mkInvoice(S2, { status: 'DA_THANH_TOAN', paidAgoHours: 1 });
        r = await call('POST', `/invoice/${P2.inv.id}/refund-request`, { ...S2.auth, body });
        const p2Req = r.json?.data?.id;
        r = await call('PATCH', `/invoice/refund-requests/${p2Req}/reject`, { ...LEADER, body: { adminNote: 'Khong dat dieu kien', cancelRegistration: true } });
        check('Từ chối kèm hủy nhưng đơn đã thanh toán -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/invoice/refund-requests/${p2Req}/reject`, { ...LEADER, body: { adminNote: 'Khong dat dieu kien' } });
        const keep = await state(P2);
        check('Từ chối thường -> 200, đơn vẫn DA_THANH_TOAN', r.status === 200 && keep.reg === 'DA_THANH_TOAN', `${r.status} ${r.msg} ${keep.reg}`);
        r = await call('POST', `/invoice/${P2.inv.id}/refund-request`, { ...S2.auth, body });
        check('Sau khi bị từ chối, gửi yêu cầu mới -> 201', r.status === 201, `${r.status} ${r.msg}`);
    } finally {
        const ids = fx.accounts;
        const invoices = await prisma.invoice.findMany({ where: { id: { in: fx.invoices } }, select: { paymentProofUrl: true } }).catch(() => []);
        for (const inv of invoices) {
            if (inv.paymentProofUrl && inv.paymentProofUrl !== 'proofs/seed-inv.png') await safe(() => fs.promises.unlink(path.join(UPLOAD_ROOT, inv.paymentProofUrl)));
        }
        await safe(() => prisma.notification.deleteMany({ where: { OR: [{ accountId: { in: ids } }, { body: { contains: String(stamp) } }] } }));
        await safe(() => prisma.supportRequest.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.invoice.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.courseRegistration.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.course.deleteMany({ where: { categoryId: { in: fx.categories } } }));
        await safe(() => prisma.category.deleteMany({ where: { id: { in: fx.categories } } }));
        await safe(() => prisma.student.deleteMany({ where: { id: { in: fx.students } } }));
        await safe(() => prisma.teacher.deleteMany({ where: { id: { in: fx.teachers } } }));
        await safe(() => prisma.administrator.deleteMany({ where: { accountId: { in: ids } } }));
        await safe(() => prisma.account.deleteMany({ where: { id: { in: ids } } }));
        const left = {
            accounts: await prisma.account.count({ where: { email: { contains: `.${stamp}@` } } }),
            categories: await prisma.category.count({ where: { categoryName: { contains: String(stamp) } } }),
            courses: await prisma.course.count({ where: { courseName: { contains: String(stamp) } } }),
            notifications: await prisma.notification.count({ where: { body: { contains: String(stamp) } } }),
        };
        console.log('\nBản ghi còn sót theo hậu tố', stamp, JSON.stringify(left));
        check('Đã dọn sạch dữ liệu test', Object.values(left).every((v) => v === 0));
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    await prisma.$disconnect();
    process.exit(failed ? 1 : 0);
}
main().catch(async (e) => { console.error('Lỗi khi chạy test:', e); await prisma.$disconnect().catch(() => {}); process.exit(1); });
