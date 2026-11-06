require('dotenv').config();
const fs = require('fs');
const path = require('path');
const prisma = require('../src/config/database');
const { signAccessToken } = require('../src/utils/jwt');

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;

let LEADER_ID = null;
let passed = 0;
let failed = 0;

const tokenOf = ({ role, userId }) =>
    role ? signAccessToken({ sub: userId || (role === 'ADMINISTRATOR' ? LEADER_ID : `test-${role}`), role }) : null;

const call = async (method, p, { actor = {}, body, form, raw } = {}) => {
    const token = tokenOf(actor);
    const res = await fetch(API + p, {
        method,
        headers: {
            ...(form ? {} : { 'Content-Type': 'application/json' }),
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: form || (body !== undefined ? JSON.stringify(body) : undefined),
    });
    if (raw) return { status: res.status, type: res.headers.get('content-type') || '' };
    let json = null;
    try {
        json = await res.json();
    } catch (_) { }
    return { status: res.status, json };
};

const check = (name, condition, detail = '') => {
    if (condition) {
        passed++;
        console.log(`  PASS  ${name}`);
    } else {
        failed++;
        console.log(`  FAIL  ${name}${detail ? `  -> ${detail}` : ''}`);
    }
};

// Ảnh PNG 1x1 để thử tải minh chứng
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const proofForm = (type = 'image/png', name = 'proof.png') => {
    const f = new FormData();
    f.append('proof', new Blob([type === 'image/png' ? PNG : 'hello'], { type }), name);
    return f;
};

async function main() {
    console.log(`Kiểm tra API Enrollment + Invoice tại ${API}\n`);
    const stamp = Date.now();
    const fx = { accounts: [], students: [] };
    let couponId = null;

    try {
        // ---------- Dữ liệu nền ----------
        const leader = await prisma.account.findUnique({ where: { email: 'leader@roadstudy.vn' } });
        const adminNoPerm = await prisma.account.findUnique({ where: { email: 'admin@roadstudy.vn' } });
        if (!leader || !adminNoPerm) throw new Error('Không thấy tài khoản seed leader@/admin@roadstudy.vn, hãy chạy: npx prisma migrate reset');
        LEADER_ID = leader.id;

        const mkAccount = (name, role) =>
            prisma.account.create({
                data: { fullName: name, email: `${name.replace(/\s/g, '').toLowerCase()}.${stamp}@example.com`, passwordHash: 'x', role, status: 'HOAT_DONG' },
            });
        const mkStudent = async (name) => {
            const account = await mkAccount(name, 'STUDENT');
            const student = await prisma.student.create({ data: { accountId: account.id } });
            fx.accounts.push(account.id);
            fx.students.push(student.id);
            return { account, student };
        };
        const teacherAcc = await mkAccount('GV Dang Ky', 'TEACHER');
        fx.accounts.push(teacherAcc.id);
        fx.teacher = await prisma.teacher.create({
            data: { specialization: 'Test', biography: 'Test', teachingExperience: 'Test', approvalStatus: 'DA_DUYET', accountId: teacherAcc.id },
        });
        fx.category = await prisma.category.create({ data: { categoryName: `Enroll test ${stamp}` } });
        const mkCourse = (name, price, status = 'DANG_MO') =>
            prisma.course.create({
                data: {
                    courseName: `${name} ${stamp}`, description: 'Test', price, status,
                    startDate: new Date(), endDate: new Date(Date.now() + 86400000),
                    categoryId: fx.category.id, teacherId: fx.teacher.id,
                },
            });
        const c1 = await mkCourse('Khoa 1', 1000000);
        const c2 = await mkCourse('Khoa 2', 500000);
        const c3 = await mkCourse('Khoa 3', 300000);
        const cDraft = await mkCourse('Khoa nhap', 100000, 'BAN_NHAP');
        const cFree = await mkCourse('Khoa mien phi', 0);

        const coupon = await prisma.discountCode.create({
            data: {
                code: `TEST_${stamp}_P`, discountPercentage: 10, usageLimit: 5, status: 'HOAT_DONG',
                startDate: new Date(Date.now() - 86400000), endDate: new Date(Date.now() + 30 * 86400000),
            },
        });
        couponId = coupon.id;
        const usedCount = async () => (await prisma.discountCode.findUnique({ where: { id: couponId } })).usedCount;
        const reg = (id) => prisma.courseRegistration.findUnique({ where: { id } });
        const inv = (id) => prisma.invoice.findUnique({ where: { id } });

        const h1 = await mkStudent('HV Dang Ky Mot');
        const h2 = await mkStudent('HV Dang Ky Hai');
        const h3 = await mkStudent('HV Dang Ky Ba');
        const S1 = { role: 'STUDENT', userId: h1.account.id };
        const S2 = { role: 'STUDENT', userId: h2.account.id };
        const S3 = { role: 'STUDENT', userId: h3.account.id };
        const LEADER = { role: 'ADMINISTRATOR' };
        const ADMIN_NOPERM = { role: 'ADMINISTRATOR', userId: adminNoPerm.id };
        const TEACHER = { role: 'TEACHER', userId: teacherAcc.id };

        // ---------- Đăng ký ----------
        console.log('[Đăng ký khóa học]');
        let r = await call('POST', '/enrollment', { body: { courseId: c1.id } });
        check('Không có token -> 401', r.status === 401, `status ${r.status}`);

        r = await call('POST', '/enrollment', { actor: TEACHER, body: { courseId: c1.id } });
        check('Giáo viên đăng ký -> 403', r.status === 403, `status ${r.status}`);

        r = await call('POST', '/enrollment', { actor: S1, body: {} });
        check('Thiếu courseId -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id, status: 'DA_THANH_TOAN' } });
        check('Gửi trường lạ -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: cDraft.id } });
        check('Khóa chưa mở đăng ký -> 404', r.status === 404, `status ${r.status}`);

        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id, discountCode: 'KHONG_TON_TAI' } });
        check('Mã giảm giá không tồn tại -> 404 và không tạo đơn', r.status === 404 && (await prisma.courseRegistration.count({ where: { studentId: h1.student.id } })) === 0, `status ${r.status}`);

        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id, discountCode: coupon.code.toLowerCase() } });
        check('Đăng ký kèm mã giảm giá -> 201', r.status === 201, `status ${r.status} ${r.json?.message}`);
        const regA = r.json?.data?.registration;
        const invA = r.json?.data?.invoice;
        if (!regA?.id) throw new Error('Không tạo được đăng ký, dừng test. Xem log ở terminal chạy server.');
        check('Đơn CHO_THANH_TOAN, hóa đơn 900000 (giảm 10%)', regA.status === 'CHO_THANH_TOAN' && invA.status === 'CHO_THANH_TOAN' && Number(invA.totalAmount) === 900000 && Number(invA.discountAmountApplied) === 100000, JSON.stringify(invA));
        check('usedCount tăng lên 1', (await usedCount()) === 1);
        check('Có thông tin chuyển khoản (nội dung RSxxxxxxxx)', /^RS[0-9A-F]{8}$/.test(r.json?.data?.paymentInfo?.transferContent || ''), JSON.stringify(r.json?.data?.paymentInfo));

        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id } });
        check('Đăng ký lại khi đơn cũ còn chờ -> 200, trả lại đơn cũ', r.status === 200 && r.json?.data?.registration?.id === regA.id, `status ${r.status}`);
        check('Không tạo thêm đơn và không tăng usedCount', (await prisma.courseRegistration.count({ where: { studentId: h1.student.id, courseId: c1.id } })) === 1 && (await usedCount()) === 1);

        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c2.id, discountCode: coupon.code } });
        check('Dùng lại mã đang giữ cho khóa khác -> 400', r.status === 400 && /đã sử dụng/.test(r.json?.message || ''), `status ${r.status} ${r.json?.message}`);

        r = await call('POST', '/enrollment', { actor: S2, body: { courseId: cFree.id } });
        check('Khóa miễn phí -> 201, tự động DA_THANH_TOAN', r.status === 201 && r.json?.data?.registration?.status === 'DA_THANH_TOAN' && r.json?.data?.invoice?.status === 'DA_THANH_TOAN', JSON.stringify(r.json?.data?.registration));

        // ---------- Hủy trước khi gửi minh chứng ----------
        console.log('\n[Hủy đăng ký trước khi gửi minh chứng]');
        r = await call('POST', `/enrollment/${regA.id}/cancel`, { actor: S2 });
        check('Học viên khác hủy đơn của người khác -> 404', r.status === 404, `status ${r.status}`);

        r = await call('POST', `/enrollment/${regA.id}/cancel`, { actor: S1 });
        check('Hủy đơn chưa gửi minh chứng -> 200', r.status === 200, `status ${r.status} ${r.json?.message}`);
        check('Đơn và hóa đơn đều DA_HUY', (await reg(regA.id)).status === 'DA_HUY' && (await inv(invA.id)).status === 'DA_HUY');
        check('Trả lại lượt mã giảm giá (usedCount về 0)', (await usedCount()) === 0);

        r = await call('POST', `/enrollment/${regA.id}/cancel`, { actor: S1 });
        check('Hủy lần nữa -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id, discountCode: coupon.code } });
        check('Đăng ký lại sau khi hủy -> 201, tạo đơn mới', r.status === 201 && r.json?.data?.registration?.id !== regA.id, `status ${r.status}`);
        const regB = r.json?.data?.registration;
        const invB = r.json?.data?.invoice;
        check('Đơn cũ vẫn được giữ lại (2 đơn cùng khóa)', (await prisma.courseRegistration.count({ where: { studentId: h1.student.id, courseId: c1.id } })) === 2);
        check('usedCount lại là 1', (await usedCount()) === 1);

        // ---------- Gửi minh chứng ----------
        console.log('\n[Gửi minh chứng thanh toán]');
        r = await call('POST', `/invoice/${invB.id}/proof`, { actor: S1, form: new FormData() });
        check('Không chọn tệp -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', `/invoice/${invB.id}/proof`, { actor: S1, form: proofForm('text/plain', 'a.txt') });
        check('Tệp không phải ảnh -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', `/invoice/${invB.id}/proof`, { actor: S2, form: proofForm() });
        check('Học viên khác gửi minh chứng vào hóa đơn người khác -> 404', r.status === 404, `status ${r.status}`);

        r = await call('POST', `/invoice/${invB.id}/proof`, { actor: S1, form: proofForm() });
        check('Gửi minh chứng -> 200', r.status === 200, `status ${r.status} ${r.json?.message}`);
        check('Hóa đơn có minh chứng, vẫn CHO_THANH_TOAN', r.json?.data?.hasPaymentProof === true && r.json?.data?.status === 'CHO_THANH_TOAN');
        check('Đường dẫn minh chứng là API có đăng nhập', r.json?.data?.paymentProofUrl === `/api/invoice/${invB.id}/proof`, r.json?.data?.paymentProofUrl);

        r = await call('GET', `/invoice/${invB.id}/proof`, { actor: S1, raw: true });
        check('Chủ hóa đơn xem ảnh minh chứng -> 200 (image)', r.status === 200 && r.type.startsWith('image/'), `status ${r.status} ${r.type}`);
        r = await call('GET', `/invoice/${invB.id}/proof`, { actor: S2, raw: true });
        check('Học viên khác xem ảnh -> 404', r.status === 404, `status ${r.status}`);
        r = await call('GET', `/invoice/${invB.id}/proof`, { actor: LEADER, raw: true });
        check('Admin có quyền xem ảnh -> 200', r.status === 200, `status ${r.status}`);
        r = await call('GET', `/invoice/${invB.id}/proof`, { actor: ADMIN_NOPERM, raw: true });
        check('Admin thường (không có quyền) xem ảnh -> 403', r.status === 403, `status ${r.status}`);

        r = await call('POST', `/enrollment/${regB.id}/cancel`, { actor: S1 });
        check('Hủy trực tiếp sau khi đã gửi minh chứng -> 409', r.status === 409, `status ${r.status}`);

        // ---------- Xem hóa đơn ----------
        console.log('\n[Xem hóa đơn / đăng ký]');
        r = await call('GET', '/invoice/me', { actor: S1 });
        check('Hóa đơn của tôi -> 200, có phân trang', r.status === 200 && typeof r.json?.data?.pagination?.total === 'number' && r.json.data.items.length >= 2, `status ${r.status}`);
        r = await call('GET', `/invoice/${invB.id}`, { actor: S1 });
        check('Chi tiết hóa đơn -> 200, có paymentInfo', r.status === 200 && !!r.json?.data?.paymentInfo, `status ${r.status}`);
        r = await call('GET', `/invoice/${invB.id}`, { actor: S2 });
        check('Học viên khác xem hóa đơn -> 404', r.status === 404, `status ${r.status}`);
        r = await call('GET', '/enrollment/me', { actor: S1 });
        check('Khóa học của tôi -> 200', r.status === 200 && r.json?.data?.items?.length >= 2, `status ${r.status}`);
        r = await call('GET', `/enrollment/${regB.id}`, { actor: S1 });
        check('Chi tiết đơn đăng ký -> 200, có invoice', r.status === 200 && r.json?.data?.invoice?.id === invB.id, `status ${r.status}`);
        r = await call('GET', '/invoice', { actor: S1 });
        check('Học viên xem danh sách admin -> 403', r.status === 403, `status ${r.status}`);
        r = await call('GET', '/invoice?pending=true', { actor: ADMIN_NOPERM });
        check('Admin thường (không có quyền) xem danh sách -> 403', r.status === 403, `status ${r.status}`);
        r = await call('GET', '/invoice?pending=true', { actor: LEADER });
        check('Leader xem hóa đơn chờ duyệt -> 200, có hóa đơn vừa gửi', r.status === 200 && r.json?.data?.items?.some((i) => i.id === invB.id), `status ${r.status}`);

        // ---------- Duyệt thanh toán ----------
        console.log('\n[Admin duyệt thanh toán]');
        r = await call('PATCH', `/invoice/${invB.id}/approve`, { actor: S1 });
        check('Học viên duyệt -> 403', r.status === 403, `status ${r.status}`);
        r = await call('PATCH', `/invoice/${invB.id}/approve`, { actor: ADMIN_NOPERM });
        check('Admin thường duyệt -> 403', r.status === 403, `status ${r.status}`);
        r = await call('PATCH', `/invoice/${invB.id}/approve`, { actor: LEADER });
        check('Leader duyệt -> 200', r.status === 200 && r.json?.data?.status === 'DA_THANH_TOAN' && !!r.json?.data?.paidAt, `status ${r.status} ${r.json?.message}`);
        const regBdb = await reg(regB.id);
        check('Đăng ký DA_THANH_TOAN, amountPaid = 900000', regBdb.status === 'DA_THANH_TOAN' && Number(regBdb.amountPaid) === 900000, `${regBdb.status} ${regBdb.amountPaid}`);
        r = await call('PATCH', `/invoice/${invB.id}/approve`, { actor: LEADER });
        check('Duyệt lần nữa -> 400', r.status === 400, `status ${r.status}`);
        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id } });
        check('Đăng ký khóa đã thanh toán -> 409', r.status === 409, `status ${r.status}`);

        // ---------- Từ chối thanh toán ----------
        console.log('\n[Admin từ chối thanh toán]');
        r = await call('POST', '/enrollment', { actor: S2, body: { courseId: c3.id } });
        const regC = r.json?.data?.registration;
        const invC = r.json?.data?.invoice;
        r = await call('PATCH', `/invoice/${invC.id}/reject`, { actor: LEADER, body: { reason: 'Sai nội dung' } });
        check('Từ chối khi chưa có minh chứng -> 400', r.status === 400, `status ${r.status}`);
        await call('POST', `/invoice/${invC.id}/proof`, { actor: S2, form: proofForm() });
        r = await call('PATCH', `/invoice/${invC.id}/reject`, { actor: LEADER, body: {} });
        check('Từ chối không có lý do -> 400', r.status === 400, `status ${r.status}`);
        r = await call('PATCH', `/invoice/${invC.id}/reject`, { actor: LEADER, body: { reason: 'Sai nội dung chuyển khoản' } });
        check('Từ chối kèm lý do -> 200, THAT_BAI', r.status === 200 && r.json?.data?.status === 'THAT_BAI' && r.json?.data?.rejectionReason === 'Sai nội dung chuyển khoản', `status ${r.status} ${r.json?.message}`);
        check('Đăng ký vẫn CHO_THANH_TOAN', (await reg(regC.id)).status === 'CHO_THANH_TOAN');
        r = await call('POST', `/invoice/${invC.id}/proof`, { actor: S2, form: proofForm() });
        check('Gửi lại minh chứng -> về CHO_THANH_TOAN, xóa lý do cũ', r.status === 200 && r.json?.data?.status === 'CHO_THANH_TOAN' && r.json?.data?.rejectionReason === null, `status ${r.status}`);
        await call('PATCH', `/invoice/${invC.id}/reject`, { actor: LEADER, body: { reason: 'Vẫn sai' } });
        r = await call('POST', '/enrollment', { actor: S2, body: { courseId: c3.id } });
        check('Đăng ký lại sau khi bị từ chối -> 201, tạo đơn mới', r.status === 201 && r.json?.data?.registration?.id !== regC.id, `status ${r.status} ${r.json?.message}`);
        check('Đơn bị từ chối trước đó chuyển DA_HUY', (await reg(regC.id)).status === 'DA_HUY');

        // ---------- Hoàn tiền sau khi đã thanh toán ----------
        console.log('\n[Yêu cầu hoàn tiền sau khi thanh toán]');
        r = await call('POST', `/invoice/${invB.id}/refund-request`, { actor: S1, body: {} });
        check('Yêu cầu không có lý do -> 400', r.status === 400, `status ${r.status}`);
        r = await call('POST', `/invoice/${invB.id}/refund-request`, { actor: S2, body: { description: 'x' } });
        check('Học viên khác gửi yêu cầu -> 404', r.status === 404, `status ${r.status}`);
        r = await call('POST', `/invoice/${invB.id}/refund-request`, { actor: S1, body: { description: 'Tôi muốn hoàn tiền' } });
        check('Gửi yêu cầu trong 24 giờ -> 201, CHO_XU_LY', r.status === 201 && r.json?.data?.status === 'CHO_XU_LY', `status ${r.status} ${r.json?.message}`);
        const rf1 = r.json?.data;
        r = await call('POST', `/invoice/${invB.id}/refund-request`, { actor: S1, body: { description: 'Lần hai' } });
        check('Gửi thêm khi còn yêu cầu chờ -> 409', r.status === 409, `status ${r.status}`);
        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id } });
        check('Đăng ký lại khi còn yêu cầu hoàn tiền -> 409', r.status === 409, `status ${r.status}`);

        r = await call('GET', '/invoice/refund-requests', { actor: ADMIN_NOPERM });
        check('Admin thường xem yêu cầu hoàn tiền -> 403', r.status === 403, `status ${r.status}`);
        r = await call('GET', '/invoice/refund-requests?status=CHO_XU_LY', { actor: LEADER });
        check('Leader xem danh sách yêu cầu -> 200', r.status === 200 && r.json?.data?.items?.some((i) => i.id === rf1.id), `status ${r.status}`);
        r = await call('GET', '/invoice/refund-requests/me', { actor: S1 });
        check('Học viên xem yêu cầu của mình -> 200', r.status === 200 && r.json?.data?.items?.length === 1, `status ${r.status}`);

        r = await call('PATCH', `/invoice/refund-requests/${rf1.id}/complete`, { actor: LEADER, body: {} });
        check('Hoàn tất khi chưa chấp thuận -> 409', r.status === 409, `status ${r.status}`);
        r = await call('PATCH', `/invoice/refund-requests/${rf1.id}/approve`, { actor: LEADER, body: { adminNote: 'Đã kiểm tra' } });
        check('Chấp thuận -> CHO_HOAN_TIEN', r.status === 200 && r.json?.data?.status === 'CHO_HOAN_TIEN', `status ${r.status} ${r.json?.message}`);
        check('Chưa chuyển đăng ký/hóa đơn sang HOAN_TIEN', (await reg(regB.id)).status === 'DA_THANH_TOAN' && (await inv(invB.id)).status === 'DA_THANH_TOAN');
        r = await call('PATCH', `/invoice/refund-requests/${rf1.id}/reject`, { actor: LEADER, body: { adminNote: 'x' } });
        check('Từ chối yêu cầu đã chấp thuận -> 409', r.status === 409, `status ${r.status}`);
        r = await call('PATCH', `/invoice/refund-requests/${rf1.id}/complete`, { actor: LEADER, body: {} });
        check('Hoàn tất hoàn tiền -> DA_XU_LY', r.status === 200 && r.json?.data?.status === 'DA_XU_LY', `status ${r.status} ${r.json?.message}`);
        check('Đăng ký và hóa đơn chuyển HOAN_TIEN', (await reg(regB.id)).status === 'HOAN_TIEN' && (await inv(invB.id)).status === 'HOAN_TIEN');
        check('Hoàn tiền không trả lượt mã giảm giá', (await usedCount()) === 1);
        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id, discountCode: coupon.code } });
        check('Hóa đơn HOAN_TIEN vẫn tính là đã dùng mã -> 400', r.status === 400, `status ${r.status} ${r.json?.message}`);
        r = await call('POST', '/enrollment', { actor: S1, body: { courseId: c1.id } });
        check('Sau khi hoàn tiền xong được đăng ký lại -> 201', r.status === 201, `status ${r.status} ${r.json?.message}`);

        // ---------- Quá 24 giờ ----------
        console.log('\n[Quá hạn 24 giờ]');
        r = await call('POST', '/enrollment', { actor: S3, body: { courseId: c2.id } });
        const invD = r.json?.data?.invoice;
        await call('POST', `/invoice/${invD.id}/proof`, { actor: S3, form: proofForm() });
        r = await call('PATCH', `/invoice/${invD.id}/approve`, { actor: LEADER });
        await prisma.invoice.update({ where: { id: invD.id }, data: { paidAt: new Date(Date.now() - 25 * 3600 * 1000) } });
        r = await call('POST', `/invoice/${invD.id}/refund-request`, { actor: S3, body: { description: 'Muộn' } });
        check('Yêu cầu sau 24 giờ kể từ paidAt -> 400', r.status === 400 && /24 giờ/.test(r.json?.message || ''), `status ${r.status} ${r.json?.message}`);

        // ---------- Hủy sau khi gửi minh chứng ----------
        console.log('\n[Hủy sau khi gửi minh chứng, kèm hoàn tiền]');
        r = await call('POST', '/enrollment', { actor: S3, body: { courseId: c1.id, discountCode: coupon.code } });
        const regE = r.json?.data?.registration;
        const invE = r.json?.data?.invoice;
        check('Học viên 3 đăng ký khóa 1 kèm mã -> 201', r.status === 201, `status ${r.status} ${r.json?.message}`);
        const usedBefore = await usedCount();
        r = await call('POST', `/invoice/${invE.id}/refund-request`, { actor: S3, body: { description: 'Hủy' } });
        check('Chưa gửi minh chứng thì không yêu cầu hoàn tiền được -> 400', r.status === 400, `status ${r.status}`);
        await call('POST', `/invoice/${invE.id}/proof`, { actor: S3, form: proofForm() });
        r = await call('POST', `/invoice/${invE.id}/refund-request`, { actor: S3, body: { description: 'Tôi muốn hủy, đã chuyển khoản' } });
        check('Đã gửi minh chứng, chưa duyệt -> gửi yêu cầu hủy + hoàn tiền -> 201', r.status === 201, `status ${r.status} ${r.json?.message}`);
        const rf2 = r.json?.data;
        r = await call('PATCH', `/invoice/${invE.id}/approve`, { actor: LEADER });
        check('Duyệt thanh toán khi còn yêu cầu hoàn tiền chờ -> 409', r.status === 409, `status ${r.status}`);
        r = await call('PATCH', `/invoice/refund-requests/${rf2.id}/reject`, { actor: LEADER, body: {} });
        check('Từ chối không có lý do -> 400', r.status === 400, `status ${r.status}`);
        r = await call('PATCH', `/invoice/refund-requests/${rf2.id}/reject`, { actor: LEADER, body: { adminNote: 'Không có giao dịch', cancelRegistration: true } });
        check('Từ chối yêu cầu kèm hủy đơn -> TU_CHOI', r.status === 200 && r.json?.data?.status === 'TU_CHOI' && r.json?.data?.adminNote === 'Không có giao dịch', `status ${r.status} ${r.json?.message}`);
        check('Đơn và hóa đơn chuyển DA_HUY, trả lượt mã', (await reg(regE.id)).status === 'DA_HUY' && (await inv(invE.id)).status === 'DA_HUY' && (await usedCount()) === usedBefore - 1);

        // ---------- Quy tắc khác ----------
        console.log('\n[Khác]');
        r = await call('GET', '/enrollment/me?status=DA_HUY', { actor: S1 });
        check('Lọc đơn theo status=DA_HUY -> chỉ có đơn đã hủy', r.status === 200 && r.json?.data?.items?.length >= 1 && r.json.data.items.every((i) => i.status === 'DA_HUY'), `status ${r.status}`);
        r = await call('GET', '/invoice/khong-ton-tai', { actor: LEADER });
        check('Xem hóa đơn không tồn tại -> 404', r.status === 404, `status ${r.status}`);
    } catch (e) {
        check('Chạy test không phát sinh lỗi bất ngờ', false, e.message);
    } finally {
        // Dọn dữ liệu test (kể cả ảnh minh chứng đã tải lên)
        const safe = async (fn) => { try { await fn(); } catch (_) { } };
        const proofs = await prisma.invoice.findMany({ where: { studentId: { in: fx.students }, paymentProofUrl: { not: null } }, select: { paymentProofUrl: true } }).catch(() => []);
        for (const p of proofs) await safe(() => fs.promises.unlink(path.join(__dirname, '../uploads', p.paymentProofUrl)));
        await safe(() => prisma.supportRequest.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.invoice.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.courseRegistration.deleteMany({ where: { studentId: { in: fx.students } } }));
        if (couponId) await safe(() => prisma.discountCode.delete({ where: { id: couponId } }));
        if (fx.category) {
            await safe(() => prisma.course.deleteMany({ where: { categoryId: fx.category.id } }));
            await safe(() => prisma.category.delete({ where: { id: fx.category.id } }));
        }
        await safe(() => prisma.student.deleteMany({ where: { id: { in: fx.students } } }));
        if (fx.teacher) await safe(() => prisma.teacher.delete({ where: { id: fx.teacher.id } }));
        await safe(() => prisma.account.deleteMany({ where: { id: { in: fx.accounts } } }));
    }

    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    await prisma.$disconnect();
    process.exit(failed ? 1 : 0);
}

main().catch(async (e) => {
    console.error('\nLỗi khi chạy test (server đã chạy chưa? đúng port chưa?):', e.message);
    await prisma.$disconnect().catch(() => { });
    process.exit(1);
});