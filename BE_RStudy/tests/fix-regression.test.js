require('dotenv').config();
const prisma = require('../src/config/database');
const { signAccessToken } = require('../src/utils/jwt');
const recoRepo = require('../src/repositories/recommendationRepository');

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
let passed = 0;
let failed = 0;

const call = async (method, p, { id, role, body, rawToken } = {}) => {
    const token = rawToken || (role ? signAccessToken({ sub: id, role }) : null);
    const res = await fetch(API + p, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let json = null;
    try { json = await res.json(); } catch (_) { }
    return { status: res.status, json, msg: json?.message };
};
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
    console.log(`Kiểm tra hồi quy các bản sửa tại ${API}\n`);
    const stamp = Date.now();
    const fx = { accounts: [], students: [], teachers: [], admins: [], categories: [] };
    const safe = async (fn) => { try { await fn(); } catch (e) { console.log('  (dọn lỗi)', e.message); } };

    try {
        const leader = await prisma.account.findUnique({ where: { email: 'leader@roadstudy.vn' } });
        if (!leader) throw new Error('Không thấy leader@roadstudy.vn');
        const mkAcc = async (name, role) => {
            const a = await prisma.account.create({ data: { fullName: name, email: `${name.replace(/\s/g, '').toLowerCase()}.${stamp}@example.com`, passwordHash: 'x', role, status: 'HOAT_DONG' } });
            fx.accounts.push(a.id);
            return a;
        };
        const mkStudent = async (name) => {
            const account = await mkAcc(name, 'STUDENT');
            const student = await prisma.student.create({ data: { accountId: account.id } });
            fx.students.push(student.id);
            return { account, student };
        };
        const tAcc = await mkAcc('GV Hoi Quy', 'TEACHER');
        const teacher = await prisma.teacher.create({ data: { specialization: 'T', biography: 'T', teachingExperience: 'T', approvalStatus: 'DA_DUYET', accountId: tAcc.id } });
        fx.teachers.push(teacher.id);
        const adAcc = await mkAcc('Admin Khong Quyen', 'ADMINISTRATOR');
        const adm = await prisma.administrator.create({ data: { accountId: adAcc.id, isLeader: false } });
        fx.admins.push(adm.id);
        const S1 = await mkStudent('HV Hoi Quy Mot');
        const S2 = await mkStudent('HV Hoi Quy Hai');

        const catOk = await prisma.category.create({ data: { categoryName: `HQ hien ${stamp}` } });
        const catHidden = await prisma.category.create({ data: { categoryName: `HQ an ${stamp}`, status: 'AN' } });
        fx.categories.push(catOk.id, catHidden.id);
        const mkCourse = (name, o = {}) => prisma.course.create({ data: {
            courseName: `${name} ${stamp}`, description: `hqdesc${stamp}`, price: 1000000, status: 'DANG_MO',
            startDate: new Date('2030-01-01T00:00:00.000Z'), endDate: new Date('2030-06-01T00:00:00.000Z'),
            categoryId: catOk.id, teacherId: teacher.id, ...o } });
        const mkReg = (studentId, courseId, status) => prisma.courseRegistration.create({ data: { studentId, courseId, status } });
        const TEACHER = { id: tAcc.id, role: 'TEACHER' };
        const STUDENT = { id: S1.account.id, role: 'STUDENT' };
        const NOPERM = { id: adAcc.id, role: 'ADMINISTRATOR' };
        const LEADER = { id: leader.id, role: 'ADMINISTRATOR' };

        // 1. Report phân quyền
        console.log('[1. Report: phân quyền]');
        const cmtForReport = await prisma.comment.create({ data: { content: 'bl bao cao', commenterAccountId: S2.account.id, courseId: (await mkCourse('Khoa BC')).id } });
        const mkReport = (extra = {}) => prisma.violationReport.create({ data: { content: 'nd', reason: 'ly do', reporterAccountId: S1.account.id, reportedAccountId: S2.account.id, commentId: cmtForReport.id, ...extra } });
        const rp = await mkReport();
        const reqs = [['GET', '/report'], ['PATCH', `/report/${rp.id}/process`, { status: 'DANG_XU_LY' }], ['PATCH', `/report/${rp.id}/reject`, { resolutionResult: 'x' }]];
        for (const [label, actor] of [['Học viên', STUDENT], ['Giáo viên', TEACHER]]) {
            for (const [m, p, b] of reqs) {
                const r = await call(m, p, { ...actor, body: b });
                check(`${label} ${m} ${p.replace(rp.id, ':id')} -> 403 "Không đủ quyền truy cập"`, r.status === 403 && r.msg === 'Không đủ quyền truy cập', `${r.status} ${r.msg}`);
            }
        }
        for (const [m, p, b] of reqs) {
            const r = await call(m, p, { ...NOPERM, body: b });
            check(`Admin thiếu quyền ${m} ${p.replace(rp.id, ':id')} -> 403 "Bạn không có quyền thực hiện chức năng này"`, r.status === 403 && r.msg === 'Bạn không có quyền thực hiện chức năng này', `${r.status} ${r.msg}`);
        }
        let r = await call('GET', '/report?limit=1', LEADER);
        check('Leader GET /report -> 200', r.status === 200, `${r.status} ${r.msg}`);
        check('Không token GET /report -> 401', (await call('GET', '/report')).status === 401);

        // 5. Thông báo báo cáo
        console.log('[5. Report: thông báo cho người gửi]');
        const notifs = (accountId, type) => prisma.notification.findMany({ where: { accountId, ...(type && { type }) } });
        const before = (await notifs(S1.account.id)).length;
        r = await call('PATCH', `/report/${rp.id}/process`, { ...LEADER, body: { status: 'DANG_XU_LY' } });
        check('Leader chuyển DANG_XU_LY -> 200', r.status === 200, `${r.status} ${r.msg}`);
        await sleep(500);
        check('DANG_XU_LY không tạo thông báo mới', (await notifs(S1.account.id)).length === before);
        r = await call('PATCH', `/report/${rp.id}/process`, { ...LEADER, body: { status: 'DA_XU_LY' } });
        check('DA_XU_LY thiếu resolutionResult -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/report/${rp.id}/process`, { ...LEADER, body: { status: 'DA_XU_LY', resolutionResult: `Da go noi dung ${stamp}` } });
        check('DA_XU_LY -> 200', r.status === 200, `${r.status} ${r.msg}`);
        await sleep(500);
        let n = await notifs(S1.account.id, 'REPORT_RESOLVED');
        check('Người gửi nhận đúng 1 REPORT_RESOLVED', n.length === 1, `có ${n.length}`);
        check('REPORT_RESOLVED body = resolutionResult, link rỗng', n[0]?.body === `Da go noi dung ${stamp}` && !n[0]?.link, JSON.stringify(n[0]));
        check('Nội dung bị báo cáo thành VI_PHAM', (await prisma.comment.findUnique({ where: { id: cmtForReport.id } })).status === 'VI_PHAM');
        r = await call('PATCH', `/report/${rp.id}/reject`, { ...LEADER, body: { resolutionResult: 'x' } });
        check('Report đã DA_XU_LY, reject -> 409', r.status === 409, `${r.status} ${r.msg}`);

        const rp2 = await mkReport();
        r = await call('PATCH', `/report/${rp2.id}/reject`, { ...LEADER, body: {} });
        check('Reject thiếu resolutionResult -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('PATCH', `/report/${rp2.id}/reject`, { ...LEADER, body: { resolutionResult: `Khong vi pham ${stamp}` } });
        check('Reject -> 200 TU_CHOI', r.status === 200 && r.json?.data?.status === 'TU_CHOI', `${r.status} ${r.msg}`);
        await sleep(500);
        n = await notifs(S1.account.id, 'REPORT_REJECTED');
        check('Người gửi nhận đúng 1 REPORT_REJECTED', n.length === 1, `có ${n.length}`);
        check('REPORT_REJECTED body = lý do, link rỗng', n[0]?.body === `Khong vi pham ${stamp}` && !n[0]?.link, JSON.stringify(n[0]));
        check('Người bị báo cáo không nhận thông báo REPORT_*', (await prisma.notification.count({ where: { accountId: S2.account.id, type: { startsWith: 'REPORT_' } } })) === 0);

        // 5b. Report: xử lý đồng thời
        console.log('[5b. Report: 2 admin xử lý cùng lúc]');
        const fire = (path, body) => call('PATCH', path, { ...LEADER, body });
        const bodyOf = (kind, i) => (kind === 'resolve' ? { status: 'DA_XU_LY', resolutionResult: `Dong thoi ${stamp} ${i}` } : { resolutionResult: `Dong thoi ${stamp} ${i}` });
        const pathOf = (kind, id) => `/report/${id}/${kind === 'resolve' ? 'process' : 'reject'}`;
        const typeOf = (kind) => (kind === 'resolve' ? 'REPORT_RESOLVED' : 'REPORT_REJECTED');
        const races = [
            ['resolve', 'resolve'],
            ['reject', 'reject'],
            ['resolve', 'reject'],
        ];
        for (const [a, b] of races) {
            const cm = await prisma.comment.create({ data: { content: 'bl race', commenterAccountId: S2.account.id, courseId: cmtForReport.courseId } });
            const rr = await mkReport({ commentId: cm.id });
            const rs = await Promise.all([fire(pathOf(a, rr.id), bodyOf(a, 1)), fire(pathOf(b, rr.id), bodyOf(b, 2))]);
            const codes = rs.map((x) => x.status).sort();
            check(`${a} + ${b} cùng lúc: đúng 1 thành công (200) và 1 xung đột (409)`, codes[0] === 200 && codes[1] === 409, JSON.stringify(rs.map((x) => [x.status, x.msg])));
            const winner = rs.findIndex((x) => x.status === 200) === 0 ? a : b;
            await sleep(500);
            const fresh = await prisma.violationReport.findUnique({ where: { id: rr.id } });
            check(`${a} + ${b}: trạng thái cuối khớp bên thắng (${winner})`, fresh.status === (winner === 'resolve' ? 'DA_XU_LY' : 'TU_CHOI'), fresh.status);
            const all = await prisma.notification.findMany({ where: { accountId: S1.account.id, type: { in: ['REPORT_RESOLVED', 'REPORT_REJECTED'] }, body: { contains: `Dong thoi ${stamp}` } } });
            const mine = all.filter((x) => x.createdAt >= rr.reportedAt);
            check(`${a} + ${b}: người báo cáo chỉ nhận thông báo của bên thắng`, mine.filter((x) => x.type === typeOf(winner)).length >= 1 && mine.every((x) => x.type === typeOf(winner)), JSON.stringify(mine.map((x) => x.type)));
            const cmt = await prisma.comment.findUnique({ where: { id: rr.commentId } });
            check(`${a} + ${b}: nội dung ${winner === 'resolve' ? 'thành VI_PHAM' : 'giữ nguyên HIEN_THI'}`, cmt.status === (winner === 'resolve' ? 'VI_PHAM' : 'HIEN_THI'), cmt.status);
        }
        const rrStart = await mkReport({ commentId: (await prisma.comment.create({ data: { content: 'bl race 2', commenterAccountId: S2.account.id, courseId: cmtForReport.courseId } })).id });
        const starts = await Promise.all([fire(`/report/${rrStart.id}/process`, { status: 'DANG_XU_LY' }), fire(`/report/${rrStart.id}/process`, { status: 'DANG_XU_LY' })]);
        check('2 lần DANG_XU_LY cùng lúc: 1 thành công, 1 từ chối 409', starts.map((x) => x.status).sort().join() === '200,409', JSON.stringify(starts.map((x) => [x.status, x.msg])));

        // 2. Comment công khai
        console.log('[2. Comment công khai]');
        const cOpen = await mkCourse('Khoa BL mo');
        const c1 = await prisma.comment.create({ data: { content: 'bl cua S1', commenterAccountId: S1.account.id, courseId: cOpen.id } });
        const c2 = await prisma.comment.create({ data: { content: 'bl cua S2', commenterAccountId: S2.account.id, courseId: cOpen.id } });
        r = await call('GET', `/comment/course/${cOpen.id}`);
        let items = r.json?.data?.items || [];
        check('Khách GET -> 200, có 2 bình luận', r.status === 200 && items.length === 2, `${r.status} ${items.length}`);
        check('Khách: mọi isMine=false', items.length > 0 && items.every((i) => i.isMine === false));
        r = await call('GET', `/comment/course/${cOpen.id}`, STUDENT);
        items = r.json?.data?.items || [];
        check('Tác giả: isMine=true đúng bình luận của mình', r.status === 200 && items.find((i) => i.id === c1.id)?.isMine === true && items.find((i) => i.id === c2.id)?.isMine === false, JSON.stringify(items.map((i) => [i.id === c1.id, i.isMine])));
        r = await call('GET', `/comment/course/${cOpen.id}`, { rawToken: 'token.sai.hoan.toan' });
        check('Token sai -> 401', r.status === 401, `${r.status}`);
        const cHidden = await mkCourse('Khoa BL danh muc an', { categoryId: catHidden.id });
        r = await call('GET', `/comment/course/${cHidden.id}`);
        check('Khóa thuộc danh mục AN -> 404', r.status === 404, `${r.status}`);
        const cDraft = await mkCourse('Khoa BL nhap', { status: 'BAN_NHAP' });
        r = await call('GET', `/comment/course/${cDraft.id}`);
        check('Khóa không DANG_MO -> 404', r.status === 404, `${r.status}`);
        r = await call('POST', `/comment/course/${cOpen.id}`, { body: { content: 'x' } });
        check('POST bình luận không token -> 401', r.status === 401, `${r.status}`);

        // 3. PUT /course
        console.log('[3. Course PUT: khóa có học viên]');
        const MSG = 'Khóa học đã có học viên đăng ký nên không thể đổi học phí hoặc thời gian học';
        for (const st of ['DA_THANH_TOAN', 'CHO_THANH_TOAN']) {
            const c = await mkCourse(`Khoa PUT ${st}`);
            await mkReg(S1.student.id, c.id, st);
            const put = (body) => call('PUT', `/course/${c.id}`, { ...TEACHER, body });
            r = await put({ price: 2000000 });
            check(`[${st}] đổi price -> 409`, r.status === 409 && r.msg === MSG, `${r.status} ${r.msg}`);
            r = await put({ startDate: '2030-02-01T00:00:00.000Z' });
            check(`[${st}] đổi startDate -> 409`, r.status === 409 && r.msg === MSG, `${r.status} ${r.msg}`);
            r = await put({ endDate: '2030-07-01T00:00:00.000Z' });
            check(`[${st}] đổi endDate -> 409`, r.status === 409 && r.msg === MSG, `${r.status} ${r.msg}`);
            r = await put({ price: 1000000, startDate: '2030-01-01T00:00:00.000Z', endDate: '2030-06-01T00:00:00.000Z' });
            check(`[${st}] gửi lại đúng giá trị cũ -> 200`, r.status === 200, `${r.status} ${r.msg}`);
            r = await put({ courseName: `Doi ten ${st} ${stamp}` });
            check(`[${st}] chỉ đổi courseName -> 200`, r.status === 200 && r.json?.data?.courseName === `Doi ten ${st} ${stamp}`, `${r.status} ${r.msg}`);
        }
        const cNo = await mkCourse('Khoa PUT chua don');
        r = await call('PUT', `/course/${cNo.id}`, { ...TEACHER, body: { price: 1500000, startDate: '2030-02-01T00:00:00.000Z', endDate: '2030-07-01T00:00:00.000Z' } });
        check('Khóa chưa có đơn đổi giá/ngày -> 200', r.status === 200 && Number(r.json?.data?.price) === 1500000, `${r.status} ${r.msg}`);
        const cOld = await mkCourse('Khoa PUT don huy');
        await mkReg(S1.student.id, cOld.id, 'DA_HUY');
        await mkReg(S2.student.id, cOld.id, 'HOAN_TIEN');
        r = await call('PUT', `/course/${cOld.id}`, { ...TEACHER, body: { price: 1700000, startDate: '2030-03-01T00:00:00.000Z' } });
        check('Chỉ đơn DA_HUY/HOAN_TIEN đổi giá/ngày -> 200', r.status === 200 && Number(r.json?.data?.price) === 1700000, `${r.status} ${r.msg}`);

        // 4. Từ chối khóa
        console.log('[4. Từ chối khóa học]');
        const mkPending = () => mkCourse('Khoa cho duyet', { status: 'CHO_DUYET' });
        const rej = (id, body) => call('POST', `/course/${id}/reject`, { ...LEADER, body });
        const cR = await mkPending();
        r = await call('POST', `/course/${cR.id}/reject`, LEADER);
        check('reject không body -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await rej(cR.id, { reason: '' });
        check('reject reason rỗng -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await rej(cR.id, { reason: 'ok', extra: 1 });
        check('reject trường thừa -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await rej(cR.id, { reason: 'a'.repeat(501) });
        check('reject reason > 500 ký tự -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await call('POST', `/course/${cR.id}/reject`, { ...NOPERM, body: { reason: 'x' } });
        check('Admin thiếu quyền QUAN_LY_KHOA_HOC -> 403', r.status === 403, `${r.status} ${r.msg}`);
        check('Khóa vẫn CHO_DUYET sau các lần lỗi', (await prisma.course.findUnique({ where: { id: cR.id } })).status === 'CHO_DUYET');
        const reason = `Anh bia mo ${stamp}`;
        r = await rej(cR.id, { reason });
        check('reject hợp lệ -> 200, BAN_NHAP', r.status === 200 && r.json?.data?.status === 'BAN_NHAP', `${r.status} ${r.msg}`);
        await sleep(500);
        n = await notifs(tAcc.id, 'COURSE_REJECTED');
        check('Giáo viên có đúng 1 COURSE_REJECTED', n.length === 1, `có ${n.length}`);
        check('Body chứa "Lý do: <reason>"', n[0]?.body?.includes(`Lý do: ${reason}`), JSON.stringify(n[0]));
        const cB = await rej((await mkCourse('Khoa 500', { status: 'CHO_DUYET' })).id, { reason: 'a'.repeat(500) });
        check('reject đúng 500 ký tự -> 200', cB.status === 200, `${cB.status} ${cB.msg}`);

        const cS = await mkPending();
        const st = (id, body) => call('PATCH', `/course/${id}/status`, { ...LEADER, body });
        r = await st(cS.id, { status: 'BAN_NHAP' });
        check('PATCH status BAN_NHAP không reason -> 400', r.status === 400, `${r.status} ${r.msg}`);
        r = await st(cS.id, { status: 'BAN_NHAP', reason: '' });
        check('PATCH status BAN_NHAP reason rỗng -> 400', r.status === 400, `${r.status} ${r.msg}`);
        check('Khóa vẫn CHO_DUYET', (await prisma.course.findUnique({ where: { id: cS.id } })).status === 'CHO_DUYET');
        r = await st(cS.id, { status: 'BAN_NHAP', reason: 'Thieu noi dung' });
        check('PATCH status BAN_NHAP có reason -> 200', r.status === 200 && r.json?.data?.status === 'BAN_NHAP', `${r.status} ${r.msg}`);
        await sleep(500);
        n = await notifs(tAcc.id, 'COURSE_REJECTED');
        check('Có thêm COURSE_REJECTED chứa lý do (PATCH)', n.some((x) => x.body?.includes('Lý do: Thieu noi dung')), `có ${n.length}`);
        const cA = await mkPending();
        r = await st(cA.id, { status: 'DA_PHE_DUYET' });
        check('CHO_DUYET -> DA_PHE_DUYET không cần reason -> 200', r.status === 200, `${r.status} ${r.msg}`);
        r = await st(cA.id, { status: 'DANG_MO' });
        check('DA_PHE_DUYET -> DANG_MO -> 200 (chuyển khác không cần reason)', r.status === 200, `${r.status} ${r.msg}`);

        // 6. Chatbot repository
        console.log('[6. Chatbot: findOpenCourses bỏ khóa danh mục AN]');
        const cands = await recoRepo.findOpenCourses({ maxPrice: null, limit: 100000 });
        const ids = new Set(cands.map((c) => c.id));
        check('Không trả khóa của danh mục AN', !ids.has(cHidden.id));
        check('Có trả khóa DANG_MO của danh mục hiển thị (đối chứng)', ids.has(cOpen.id));
        const cands2 = await recoRepo.findCandidates({ keywords: [`hqdesc${stamp}`], maxPrice: null, limit: 100 });
        check('findCandidates cũng không trả khóa danh mục AN', !cands2.some((c) => c.id === cHidden.id) && cands2.some((c) => c.id === cOpen.id));
    } finally {
        await safe(() => prisma.notification.deleteMany({ where: { accountId: { in: fx.accounts } } }));
        await safe(() => prisma.violationReport.deleteMany({ where: { OR: [{ reporterAccountId: { in: fx.accounts } }, { reportedAccountId: { in: fx.accounts } }] } }));
        await safe(() => prisma.reply.deleteMany({ where: { OR: [{ replierAccountId: { in: fx.accounts } }, { comment: { commenterAccountId: { in: fx.accounts } } }] } }));
        await safe(() => prisma.comment.deleteMany({ where: { commenterAccountId: { in: fx.accounts } } }));
        await safe(() => prisma.invoice.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.courseRegistration.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.course.deleteMany({ where: { categoryId: { in: fx.categories } } }));
        await safe(() => prisma.category.deleteMany({ where: { id: { in: fx.categories } } }));
        await safe(() => prisma.student.deleteMany({ where: { id: { in: fx.students } } }));
        await safe(() => prisma.teacher.deleteMany({ where: { id: { in: fx.teachers } } }));
        await safe(() => prisma.administrator.deleteMany({ where: { id: { in: fx.admins } } }));
        await safe(() => prisma.account.deleteMany({ where: { id: { in: fx.accounts } } }));
        const left = {
            accounts: await prisma.account.count({ where: { email: { contains: `.${stamp}@` } } }),
            categories: await prisma.category.count({ where: { categoryName: { contains: String(stamp) } } }),
            courses: await prisma.course.count({ where: { courseName: { contains: String(stamp) } } }),
            notifications: await prisma.notification.count({ where: { accountId: { in: fx.accounts } } }),
        };
        console.log('\nBản ghi còn sót theo hậu tố', stamp, JSON.stringify(left));
        check('Đã dọn sạch dữ liệu test', Object.values(left).every((v) => v === 0));
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    await prisma.$disconnect();
    process.exit(failed ? 1 : 0);
}
main().catch(async (e) => { console.error('Lỗi khi chạy test:', e); await prisma.$disconnect().catch(() => {}); process.exit(1); });
