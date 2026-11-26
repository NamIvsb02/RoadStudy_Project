// Kiểm tra các bản sửa P2: request ID, health ready, magic bytes, account enumeration,
// rate limit ghi nội dung, nộp bài đồng thời.
// Chạy: bật `npm run dev` (server mới) rồi `node tests/hardening.p2.test.js`. Dữ liệu test được dọn trong finally.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const prisma = require('../src/config/database');
const { signAccessToken } = require('../src/utils/jwt');

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const BASE = API.replace(/\/api$/, '');
const AVATAR_DIR = path.join(__dirname, '../uploads/avatars');
let passed = 0;
let failed = 0;

const call = async (method, p, { id, role, body, form, headers: extra } = {}) => {
    const token = role ? signAccessToken({ sub: id, role }) : null;
    const headers = { ...(token && { Authorization: `Bearer ${token}` }), ...extra };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const res = await fetch(API + p, { method, headers, body: form ?? (body !== undefined ? JSON.stringify(body) : undefined) });
    let json = null;
    try { json = await res.json(); } catch (_) { }
    return { status: res.status, json, msg: json?.message, headers: res.headers };
};
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const countBy = (list, status) => list.filter((r) => r.status === status).length;
const avatarForm = (bytes, type = 'image/png') => { const f = new FormData(); f.append('avatar', new Blob([bytes], { type }), 'a.png'); return f; };

async function main() {
    console.log(`Kiểm tra P2 tại ${API}\n`);
    const stamp = Date.now();
    const fx = { accounts: [], students: [], teachers: [], categories: [] };
    const safe = async (fn) => { try { await fn(); } catch (e) { console.log('  (dọn lỗi)', e.message); } };

    try {
        const mkAcc = async (name, role, extra = {}) => {
            const a = await prisma.account.create({ data: { fullName: name, email: `${name.replace(/\s/g, '').toLowerCase()}.${stamp}@example.com`, passwordHash: 'x', role, status: 'HOAT_DONG', ...extra } });
            fx.accounts.push(a.id);
            return a;
        };
        const mkStudent = async (name, extra) => {
            const account = await mkAcc(name, 'STUDENT', extra);
            const student = await prisma.student.create({ data: { accountId: account.id } });
            fx.students.push(student.id);
            return { account, student, auth: { id: account.id, role: 'STUDENT' } };
        };
        let r;

        // ========== 1. Request ID và health ready ==========
        console.log('[1. Request ID và health/ready]');
        let res = await fetch(`${BASE}/health/ready`);
        check('GET /health/ready -> 200', res.status === 200, `${res.status}`);
        check('Phản hồi có header X-Request-Id', /^[\w-]{8,}$/.test(res.headers.get('x-request-id') || ''), res.headers.get('x-request-id'));
        res = await fetch(`${BASE}/health`, { headers: { 'X-Request-Id': 'trace-abc-123' } });
        check('X-Request-Id hợp lệ của client được giữ nguyên', res.headers.get('x-request-id') === 'trace-abc-123', res.headers.get('x-request-id'));
        res = await fetch(`${BASE}/health`, { headers: { 'X-Request-Id': 'bad id <script>' } });
        check('X-Request-Id có ký tự lạ bị thay bằng mã mới', res.headers.get('x-request-id') !== 'bad id <script>' && !!res.headers.get('x-request-id'));
        r = await call('GET', '/khong-co-route');
        check('Lỗi 404 vẫn có X-Request-Id', !!r.headers.get('x-request-id'));

        // ========== 2. Magic bytes khi upload ==========
        console.log('[2. Upload: kiểm tra nội dung thật của file]');
        const U = await mkStudent('HV Upload');
        const before = fs.readdirSync(AVATAR_DIR).length;
        r = await call('POST', '/account/avatar', { ...U.auth, form: avatarForm(Buffer.from('day khong phai anh, chi la van ban')) });
        check('Văn bản đội lốt image/png -> 400', r.status === 400 && /không đúng định dạng/.test(r.msg || ''), `${r.status} ${r.msg}`);
        r = await call('POST', '/account/avatar', { ...U.auth, form: avatarForm(Buffer.from('%PDF-1.4 gia'), 'image/jpeg') });
        check('File PDF đội lốt image/jpeg -> 400', r.status === 400, `${r.status} ${r.msg}`);
        check('File giả đã bị xóa khỏi đĩa', fs.readdirSync(AVATAR_DIR).length === before, `${before} -> ${fs.readdirSync(AVATAR_DIR).length}`);

        // ========== 3. Account enumeration ==========
        console.log('[3. verify-email không lộ email nào đã đăng ký]');
        const Verified = await mkStudent('HV Da Xac Minh');
        const ghost = await call('POST', '/auth/verify-email', { body: { email: `khong.ton.tai.${stamp}@example.com`, code: '123456' } });
        const verified = await call('POST', '/auth/verify-email', { body: { email: Verified.account.email, code: '123456' } });
        check('Email không tồn tại -> 400', ghost.status === 400, `${ghost.status} ${ghost.msg}`);
        check('Email đã xác minh -> cùng mã lỗi và cùng thông báo', verified.status === ghost.status && verified.msg === ghost.msg, `${verified.status} ${verified.msg} | ${ghost.status} ${ghost.msg}`);

        // ========== Dữ liệu cho comment và bài thi ==========
        const tAcc = await mkAcc('GV P2', 'TEACHER');
        const teacher = await prisma.teacher.create({ data: { specialization: 'T', biography: 'T', teachingExperience: 'T', approvalStatus: 'DA_DUYET', accountId: tAcc.id } });
        fx.teachers.push(teacher.id);
        const cat = await prisma.category.create({ data: { categoryName: `P2 ${stamp}` } });
        fx.categories.push(cat.id);
        const course = await prisma.course.create({ data: { courseName: `Khoa P2 ${stamp}`, description: 'p2', price: 0, status: 'DANG_MO', startDate: new Date('2030-01-01'), endDate: new Date('2030-06-01'), categoryId: cat.id, teacherId: teacher.id } });

        // ========== 4. Rate limit ghi nội dung ==========
        console.log('[4. Rate limit bình luận: 10 lần/phút/tài khoản]');
        const C = await mkStudent('HV Binh Luan');
        await prisma.courseRegistration.create({ data: { studentId: C.student.id, courseId: course.id, status: 'DA_THANH_TOAN' } });
        const posts = [];
        for (let i = 0; i < 11; i++) posts.push(await call('POST', `/comment/course/${course.id}`, { ...C.auth, body: { content: `binh luan ${i}` } }));
        check('10 bình luận đầu thành công', posts.slice(0, 10).every((x) => x.status === 201), posts.map((x) => x.status).join(','));
        check('Bình luận thứ 11 trong 1 phút -> 429', posts[10].status === 429, `${posts[10].status} ${posts[10].msg}`);
        r = await call('GET', `/comment/course/${course.id}`, C.auth);
        check('Đọc bình luận không bị giới hạn -> 200', r.status === 200, `${r.status}`);
        const C2 = await mkStudent('HV Binh Luan Hai');
        await prisma.courseRegistration.create({ data: { studentId: C2.student.id, courseId: course.id, status: 'DA_THANH_TOAN' } });
        r = await call('POST', `/comment/course/${course.id}`, { ...C2.auth, body: { content: 'nguoi khac van gui duoc' } });
        check('Tài khoản khác không bị ảnh hưởng -> 201', r.status === 201, `${r.status} ${r.msg}`);

        // ========== 5. Nộp bài đồng thời ==========
        console.log('[5. Nộp bài: điểm luôn khớp đáp án đã lưu]');
        const S = await mkStudent('HV Nop Bai');
        const exam = await prisma.exam.create({ data: { examName: `De P2 ${stamp}`, durationMinutes: 30, passingScore: 5, status: 'DANG_MO', maxAttempts: 10, courseId: course.id } });
        const question = await prisma.examQuestion.create({ data: { content: 'cau 1', score: 1, questionOrder: 1, examId: exam.id } });
        const good = await prisma.answerOption.create({ data: { content: 'dung', isCorrect: true, questionId: question.id } });
        const bad = await prisma.answerOption.create({ data: { content: 'sai', isCorrect: false, questionId: question.id } });
        let mismatched = 0;
        let wrongCodes = 0;
        for (let i = 0; i < 6; i++) {
            const attempt = await prisma.examAttempt.create({ data: { studentId: S.student.id, examId: exam.id } });
            const submit = (optionId) => call('POST', `/submission/${attempt.id}/submit`, { ...S.auth, body: { answers: [{ questionId: question.id, answerOptionId: optionId }] } });
            const results = await Promise.all([submit(good.id), submit(bad.id)]);
            if (countBy(results, 200) !== 1 || countBy(results, 409) !== 1) wrongCodes++;
            const done = await prisma.examAttempt.findUnique({ where: { id: attempt.id }, include: { details: true } });
            const stored = done.details[0]?.answerOptionId;
            const expected = stored === good.id ? 1 : 0;
            if (done.status !== 'DA_CHAM' || Number(done.score) !== expected) mismatched++;
        }
        check('2 request nộp cùng lúc: đúng 1 lần 200, 1 lần 409', wrongCodes === 0, `${wrongCodes}/6 vòng sai mã trạng thái`);
        check('Điểm luôn khớp đáp án đã lưu (6 vòng)', mismatched === 0, `${mismatched}/6 vòng lệch`);
        const saving = await prisma.examAttempt.create({ data: { studentId: S.student.id, examId: exam.id } });
        r = await call('POST', `/submission/${saving.id}/submit`, { ...S.auth, body: { answers: [{ questionId: question.id, answerOptionId: good.id }] } });
        const late = await call('PUT', `/submission/${saving.id}/answers`, { ...S.auth, body: { answers: [{ questionId: question.id, answerOptionId: bad.id }] } });
        const final = await prisma.examAttempt.findUnique({ where: { id: saving.id }, include: { details: true } });
        check('Lưu đáp án sau khi đã nộp -> 400/409 và không ghi đè đáp án', [400, 409].includes(late.status) && final.details[0]?.answerOptionId === good.id, `${late.status} ${late.msg}`);
    } finally {
        const ids = fx.accounts;
        await safe(() => prisma.notification.deleteMany({ where: { accountId: { in: ids } } }));
        await safe(() => prisma.examAttemptDetail.deleteMany({ where: { attempt: { studentId: { in: fx.students } } } }));
        await safe(() => prisma.examAttempt.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.answerOption.deleteMany({ where: { question: { exam: { course: { categoryId: { in: fx.categories } } } } } }));
        await safe(() => prisma.examQuestion.deleteMany({ where: { exam: { course: { categoryId: { in: fx.categories } } } } }));
        await safe(() => prisma.exam.deleteMany({ where: { course: { categoryId: { in: fx.categories } } } }));
        await safe(() => prisma.reply.deleteMany({ where: { comment: { commenterAccountId: { in: ids } } } }));
        await safe(() => prisma.comment.deleteMany({ where: { commenterAccountId: { in: ids } } }));
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
            exams: await prisma.exam.count({ where: { examName: { contains: String(stamp) } } }),
        };
        console.log('\nBản ghi còn sót theo hậu tố', stamp, JSON.stringify(left));
        check('Đã dọn sạch dữ liệu test', Object.values(left).every((v) => v === 0));
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    await prisma.$disconnect();
    process.exit(failed ? 1 : 0);
}
main().catch(async (e) => { console.error('Lỗi khi chạy test:', e); await prisma.$disconnect().catch(() => {}); process.exit(1); });
