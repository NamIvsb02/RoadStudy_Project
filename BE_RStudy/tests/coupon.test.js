require('dotenv').config();
const prisma = require('../src/config/database');
const couponService = require('../src/services/couponService');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}/api/coupon`;
const ADMIN = 'ADMINISTRATOR';
const STUDENT = 'STUDENT';
const prefix = `TEST_${Date.now()}`; // mọi mã test đều bắt đầu bằng prefix này để dọn dữ liệu
const COURSE_PRICE = 1000000;

let passed = 0;
let failed = 0;

const call = async (method, path, { role, userId, body } = {}) => {
    const res = await fetch(BASE + path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(role && { 'x-dev-role': role }),
            ...(userId && { 'x-dev-user-id': userId }),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
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

const codes = (r) => (r.json?.data?.items || []).map((i) => i.code);
const valid = { startDate: '2026-01-01T00:00:00Z', endDate: '2030-12-31T23:59:59Z', usageLimit: 2 };

async function main() {
    console.log(`Kiểm tra API Coupon tại ${BASE}\n`);
    const fx = {}; // dữ liệu nền (category, giáo viên, học viên, khóa học, đăng ký) để test áp mã
    const invoiceIds = [];

    try {
        // ---------- Dữ liệu nền ----------
        const stamp = Date.now();
        fx.category = await prisma.category.create({ data: { categoryName: `Coupon test ${stamp}` } });
        fx.teacherAcc = await prisma.account.create({
            data: { fullName: 'GV Coupon', email: `gv.coupon.${stamp}@example.com`, passwordHash: 'x', role: 'TEACHER', status: 'HOAT_DONG' },
        });
        fx.teacher = await prisma.teacher.create({
            data: { specialization: 'Test', biography: 'Test', teachingExperience: 'Test', accountId: fx.teacherAcc.id },
        });
        fx.studentAcc = await prisma.account.create({
            data: { fullName: 'HV Coupon', email: `hv.coupon.${stamp}@example.com`, passwordHash: 'x', role: 'STUDENT', status: 'HOAT_DONG' },
        });
        fx.student = await prisma.student.create({ data: { accountId: fx.studentAcc.id } });
        fx.course = await prisma.course.create({
            data: {
                courseName: `Khóa coupon ${stamp}`, description: 'Test', price: COURSE_PRICE,
                startDate: new Date(), endDate: new Date(Date.now() + 86400000),
                categoryId: fx.category.id, teacherId: fx.teacher.id,
            },
        });
        fx.registration = await prisma.courseRegistration.create({
            data: { studentId: fx.student.id, courseId: fx.course.id },
        });
        const makeInvoice = async (couponId, status) => {
            const inv = await prisma.invoice.create({
                data: {
                    subtotal: COURSE_PRICE, discountAmountApplied: 100000, totalAmount: 900000, paymentMethod: 'THE',
                    status, studentId: fx.student.id, registrationId: fx.registration.id, discountCodeId: couponId,
                },
            });
            invoiceIds.push(inv.id);
            return inv;
        };

        // ---------- Tạo mới ----------
        console.log('[Tạo mới]');
        const codeA = `${prefix}_A`;
        let r = await call('POST', '', { role: ADMIN, body: { code: codeA.toLowerCase(), discountPercentage: 10, ...valid } });
        check('Tạo mã giảm theo % -> 201', r.status === 201, `status ${r.status}`);
        const idA = r.json?.data?.id;
        check('Trả về id', !!idA);
        if (!idA) throw new Error('Không tạo được mã giảm giá, dừng test. Xem log ở terminal chạy server.');
        check('Mã được chuẩn hóa viết hoa', r.json.data.code === codeA, r.json.data.code);
        check('usedCount mặc định là 0', r.json.data.usedCount === 0, r.json.data.usedCount);
        check('Trạng thái mặc định là HOAT_DONG', r.json.data.status === 'HOAT_DONG', r.json.data.status);

        const codeB = `${prefix}_B`;
        r = await call('POST', '', { role: ADMIN, body: { code: codeB, discountAmount: 50000, ...valid } });
        check('Tạo mã giảm theo số tiền -> 201', r.status === 201, `status ${r.status}`);
        const idB = r.json?.data?.id;

        r = await call('POST', '', { role: ADMIN, body: { code: codeA, discountPercentage: 5, ...valid } });
        check('Trùng mã (khác hoa thường) -> 409', r.status === 409, `status ${r.status}`);

        r = await call('POST', '', { role: ADMIN, body: { code: `${prefix}_X1`, discountAmount: 1000, discountPercentage: 5, ...valid } });
        check('Nhập cả số tiền và % -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '', { role: ADMIN, body: { code: `${prefix}_X2`, ...valid } });
        check('Không nhập loại giảm nào -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '', { role: ADMIN, body: { code: `${prefix}_X3`, discountPercentage: 5, ...valid, startDate: '2030-01-01T00:00:00Z', endDate: '2029-01-01T00:00:00Z' } });
        check('Ngày kết thúc trước ngày bắt đầu -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '', { role: ADMIN, body: { code: `${prefix}_X4`, discountPercentage: 5, usedCount: 5, ...valid } });
        check('Gửi usedCount -> 400', r.status === 400, `status ${r.status}`);
        check('Message nêu rõ trường usedCount', (r.json?.message || '').includes('usedCount'), r.json?.message);

        r = await call('POST', '', { role: ADMIN, body: { code: `${prefix}_X5`, discountPercentage: 150, ...valid } });
        check('Phần trăm > 100 -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '', { role: ADMIN, body: { code: `${prefix}_X6`, discountPercentage: 5, ...valid, usageLimit: 0 } });
        check('usageLimit = 0 -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '', { role: ADMIN, body: { code: 'co khoang trang', discountPercentage: 5, ...valid } });
        check('Mã chứa ký tự không hợp lệ -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '', { role: STUDENT, body: { code: `${prefix}_X7`, discountPercentage: 5, ...valid } });
        check('Học viên tạo -> 403', r.status === 403, `status ${r.status}`);

        // ---------- Xem ----------
        console.log('\n[Xem danh sách / chi tiết]');
        r = await call('GET', `?q=${prefix}`, { role: ADMIN });
        check('Danh sách -> 200', r.status === 200, `status ${r.status}`);
        check('Danh sách có mã vừa tạo', codes(r).includes(codeA) && codes(r).includes(codeB));
        check('Có thông tin phân trang', typeof r.json?.data?.pagination?.total === 'number');

        r = await call('GET', `?q=${prefix}&page=1&limit=1`, { role: ADMIN });
        check('Phân trang limit=1 -> tối đa 1 phần tử', (r.json?.data?.items || []).length <= 1);

        r = await call('GET', `?q=${prefix}&status=TAM_NGUNG`, { role: ADMIN });
        check('Lọc status=TAM_NGUNG không thấy mã đang hoạt động', !codes(r).includes(codeA));

        r = await call('GET', `/${idA}`, { role: ADMIN });
        check('Chi tiết -> 200', r.status === 200 && r.json?.data?.code === codeA, `status ${r.status}`);

        r = await call('GET', '/id-khong-ton-tai', { role: ADMIN });
        check('Chi tiết id không tồn tại -> 404', r.status === 404, `status ${r.status}`);

        r = await call('GET', '', { role: STUDENT });
        check('Học viên xem danh sách -> 403', r.status === 403, `status ${r.status}`);

        // ---------- Sửa ----------
        console.log('\n[Sửa]');
        r = await call('PUT', `/${idA}`, { role: ADMIN, body: { usageLimit: 5 } });
        check('Sửa usageLimit -> 200', r.status === 200 && r.json?.data?.usageLimit === 5, `status ${r.status}`);

        r = await call('PUT', `/${idA}`, { role: ADMIN, body: { discountAmount: 50000 } });
        check('Đổi sang giảm theo số tiền -> 200', r.status === 200, `status ${r.status}`);
        check('discountPercentage tự về null', r.json?.data?.discountPercentage === null);
        check('discountAmount = 50000', Number(r.json?.data?.discountAmount) === 50000);

        r = await call('PUT', `/${idA}`, { role: ADMIN, body: { discountPercentage: 20 } });
        check('Đổi lại sang giảm theo % -> 200', r.status === 200, `status ${r.status}`);
        check('discountAmount tự về null', r.json?.data?.discountAmount === null);

        r = await call('PUT', `/${idA}`, { role: ADMIN, body: { endDate: '2020-01-01T00:00:00Z' } });
        check('Sửa ngày kết thúc trước ngày bắt đầu -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PUT', `/${idA}`, { role: ADMIN, body: { usedCount: 99 } });
        check('Sửa usedCount -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PUT', `/${idA}`, { role: ADMIN, body: { code: codeB } });
        check('Đổi sang mã đã tồn tại -> 409', r.status === 409, `status ${r.status}`);

        r = await call('PUT', '/id-khong-ton-tai', { role: ADMIN, body: { usageLimit: 3 } });
        check('Sửa id không tồn tại -> 404', r.status === 404, `status ${r.status}`);

        r = await call('PUT', `/${idA}`, { role: STUDENT, body: { usageLimit: 3 } });
        check('Học viên sửa -> 403', r.status === 403, `status ${r.status}`);

        // ---------- Trạng thái ----------
        console.log('\n[Tạm ngưng / kích hoạt]');
        r = await call('PATCH', `/${idA}/status`, { role: ADMIN, body: { status: 'TAM_NGUNG' } });
        check('Tạm ngưng -> 200', r.status === 200 && r.json?.data?.status === 'TAM_NGUNG', `status ${r.status}`);

        r = await call('PATCH', `/${idA}/status`, { role: ADMIN, body: { status: 'SAI' } });
        check('Trạng thái sai -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/validate', { role: STUDENT, body: { code: codeA } });
        check('Validate mã đang tạm ngưng -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PATCH', `/${idA}/status`, { role: ADMIN, body: { status: 'HOAT_DONG' } });
        check('Kích hoạt lại -> 200', r.status === 200, `status ${r.status}`);

        // ---------- Validate ----------
        console.log('\n[Validate mã]');
        r = await call('POST', '/validate', { role: STUDENT, body: { code: codeA.toLowerCase() } });
        check('Validate không courseId -> 200', r.status === 200, `status ${r.status}`);
        check('Trả loại giảm PERCENTAGE', r.json?.data?.discountType === 'PERCENTAGE', r.json?.data?.discountType);

        r = await call('POST', '/validate', { role: STUDENT, body: { code: codeA, courseId: fx.course.id } });
        check('Giảm 20% khóa 1.000.000: subtotal đúng', r.json?.data?.subtotal === '1000000.00', r.json?.data?.subtotal);
        check('Số tiền giảm = 200000.00', r.json?.data?.discountAmountApplied === '200000.00', r.json?.data?.discountAmountApplied);
        check('Tổng phải trả = 800000.00', r.json?.data?.totalAmount === '800000.00', r.json?.data?.totalAmount);

        r = await call('POST', '/validate', { role: ADMIN, body: { code: codeA } });
        check('Admin validate (để test) -> 200', r.status === 200, `status ${r.status}`);

        const codeBig = `${prefix}_BIG`;
        await call('POST', '', { role: ADMIN, body: { code: codeBig, discountAmount: 5000000, ...valid } });
        r = await call('POST', '/validate', { role: STUDENT, body: { code: codeBig, courseId: fx.course.id } });
        check('Giảm vượt giá gốc: số tiền giảm bằng giá gốc', r.json?.data?.discountAmountApplied === '1000000.00', r.json?.data?.discountAmountApplied);
        check('Tổng phải trả không âm (= 0.00)', r.json?.data?.totalAmount === '0.00', r.json?.data?.totalAmount);

        r = await call('POST', '/validate', { role: STUDENT, body: { code: `${prefix}_KHONGCO` } });
        check('Mã không tồn tại -> 404', r.status === 404, `status ${r.status}`);

        r = await call('POST', '/validate', { role: STUDENT, body: { code: codeA, courseId: 'id-khong-ton-tai' } });
        check('Khóa học không tồn tại -> 404', r.status === 404, `status ${r.status}`);

        r = await call('POST', '/validate', { role: STUDENT, body: {} });
        check('Thiếu code -> 400', r.status === 400, `status ${r.status}`);

        const codeOld = `${prefix}_OLD`;
        await call('POST', '', { role: ADMIN, body: { code: codeOld, discountPercentage: 5, usageLimit: 1, startDate: '2020-01-01T00:00:00Z', endDate: '2020-12-31T00:00:00Z' } });
        r = await call('POST', '/validate', { role: STUDENT, body: { code: codeOld } });
        check('Mã hết hạn -> 400', r.status === 400 && /hết hạn/.test(r.json?.message || ''), r.json?.message);

        const codeFuture = `${prefix}_FUT`;
        await call('POST', '', { role: ADMIN, body: { code: codeFuture, discountPercentage: 5, usageLimit: 1, startDate: '2099-01-01T00:00:00Z', endDate: '2099-12-31T00:00:00Z' } });
        r = await call('POST', '/validate', { role: STUDENT, body: { code: codeFuture } });
        check('Mã chưa đến ngày bắt đầu -> 400', r.status === 400 && /chưa có hiệu lực/.test(r.json?.message || ''), r.json?.message);

        r = await call('POST', '/validate', { body: { code: codeA } });
        check('Không gửi vai trò (mặc định học viên) vẫn validate được -> 200', r.status === 200, `status ${r.status}`);

        // ---------- Mỗi học viên dùng 1 lần ----------
        console.log('\n[Mỗi học viên chỉ dùng mỗi mã 1 lần]');
        const codeS = `${prefix}_S`;
        r = await call('POST', '', { role: ADMIN, body: { code: codeS, discountPercentage: 10, ...valid, usageLimit: 100 } });
        const idS = r.json?.data?.id;
        const asStudent = { role: STUDENT, userId: fx.studentAcc.id, body: { code: codeS } };

        r = await call('POST', '/validate', asStudent);
        check('Học viên chưa dùng mã -> 200', r.status === 200, `status ${r.status}`);

        const inv = await makeInvoice(idS, 'THAT_BAI');
        r = await call('POST', '/validate', asStudent);
        check('Hóa đơn THAT_BAI -> vẫn dùng lại được (200)', r.status === 200, `status ${r.status}`);

        await prisma.invoice.update({ where: { id: inv.id }, data: { status: 'DA_HUY' } });
        r = await call('POST', '/validate', asStudent);
        check('Hóa đơn DA_HUY -> vẫn dùng lại được (200)', r.status === 200, `status ${r.status}`);

        for (const st of ['CHO_THANH_TOAN', 'DA_THANH_TOAN', 'HOAN_TIEN']) {
            await prisma.invoice.update({ where: { id: inv.id }, data: { status: st } });
            r = await call('POST', '/validate', asStudent);
            check(`Hóa đơn ${st} -> đã dùng (400)`, r.status === 400 && /đã sử dụng/.test(r.json?.message || ''), `status ${r.status} ${r.json?.message}`);
        }

        r = await call('POST', '/validate', { role: STUDENT, userId: fx.studentAcc.id, body: { code: codeA } });
        check('Học viên đó vẫn dùng được mã khác -> 200', r.status === 200, `status ${r.status}`);

        r = await call('DELETE', `/${idS}`, { role: ADMIN });
        check('Xóa mã đã có hóa đơn (usedCount = 0) -> 409', r.status === 409, `status ${r.status}`);

        // ---------- Lượt dùng ----------
        console.log('\n[Lượt dùng / usedCount]');
        const codeC = `${prefix}_C`;
        r = await call('POST', '', { role: ADMIN, body: { code: codeC, discountPercentage: 10, ...valid, usageLimit: 2 } });
        const idC = r.json?.data?.id;
        const couponC = await prisma.discountCode.findUnique({ where: { id: idC } });

        await prisma.$transaction((tx) => couponService.consumeCoupon(tx, couponC));
        await prisma.$transaction((tx) => couponService.consumeCoupon(tx, couponC));
        let row = await prisma.discountCode.findUnique({ where: { id: idC } });
        check('consumeCoupon 2 lần -> usedCount = 2', row.usedCount === 2, row.usedCount);

        let blocked = false;
        try {
            await prisma.$transaction((tx) => couponService.consumeCoupon(tx, couponC));
        } catch (e) {
            blocked = e.statusCode === 400;
        }
        check('consumeCoupon lần 3 (vượt giới hạn) bị từ chối', blocked);
        row = await prisma.discountCode.findUnique({ where: { id: idC } });
        check('usedCount vẫn = 2 sau khi bị từ chối', row.usedCount === 2, row.usedCount);

        r = await call('POST', '/validate', { role: STUDENT, body: { code: codeC } });
        check('Mã hết lượt -> 400', r.status === 400 && /hết lượt/.test(r.json?.message || ''), r.json?.message);

        r = await call('PUT', `/${idC}`, { role: ADMIN, body: { usageLimit: 1 } });
        check('Giảm usageLimit xuống dưới usedCount -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PUT', `/${idC}`, { role: ADMIN, body: { code: `${prefix}_C2` } });
        check('Đổi mã đã được sử dụng -> 409', r.status === 409, `status ${r.status}`);

        r = await call('DELETE', `/${idC}`, { role: ADMIN });
        check('Xóa mã đã được sử dụng -> 409', r.status === 409, `status ${r.status}`);

        const codeL = `${prefix}_L`;
        r = await call('POST', '', { role: ADMIN, body: { code: codeL, discountPercentage: 10, ...valid, usageLimit: 1 } });
        const idL = r.json?.data?.id;
        const couponL = await prisma.discountCode.findUnique({ where: { id: idL } });
        const results = await Promise.allSettled(
            Array.from({ length: 5 }, () => prisma.$transaction((tx) => couponService.consumeCoupon(tx, couponL)))
        );
        row = await prisma.discountCode.findUnique({ where: { id: idL } });
        check('5 request đồng thời, usageLimit = 1 -> chỉ 1 thành công', results.filter((x) => x.status === 'fulfilled').length === 1);
        check('usedCount không vượt usageLimit', row.usedCount === 1, row.usedCount);

        // ---------- Xóa ----------
        console.log('\n[Xóa]');
        r = await call('DELETE', `/${idB}`, { role: STUDENT });
        check('Học viên xóa -> 403', r.status === 403, `status ${r.status}`);

        r = await call('DELETE', `/${idB}`, { role: ADMIN });
        check('Xóa mã chưa dùng -> 200', r.status === 200, `status ${r.status}`);

        r = await call('GET', `/${idB}`, { role: ADMIN });
        check('Mã đã xóa không còn -> 404', r.status === 404, `status ${r.status}`);

        r = await call('DELETE', `/${idB}`, { role: ADMIN });
        check('Xóa lần nữa -> 404', r.status === 404, `status ${r.status}`);
    } catch (e) {
        check('Chạy test không phát sinh lỗi bất ngờ', false, e.message);
    } finally {
        // Dọn dữ liệu test (thứ tự: hóa đơn -> mã -> đăng ký -> khóa học -> ...)
        const safe = async (fn) => { try { await fn(); } catch (_) { } };
        await safe(() => prisma.invoice.deleteMany({ where: { id: { in: invoiceIds } } }));
        await safe(() => prisma.discountCode.deleteMany({ where: { code: { startsWith: prefix } } }));
        if (fx.registration) await safe(() => prisma.courseRegistration.delete({ where: { id: fx.registration.id } }));
        if (fx.course) await safe(() => prisma.course.delete({ where: { id: fx.course.id } }));
        if (fx.category) await safe(() => prisma.category.delete({ where: { id: fx.category.id } }));
        if (fx.student) await safe(() => prisma.student.delete({ where: { id: fx.student.id } }));
        if (fx.teacher) await safe(() => prisma.teacher.delete({ where: { id: fx.teacher.id } }));
        if (fx.studentAcc) await safe(() => prisma.account.delete({ where: { id: fx.studentAcc.id } }));
        if (fx.teacherAcc) await safe(() => prisma.account.delete({ where: { id: fx.teacherAcc.id } }));
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
