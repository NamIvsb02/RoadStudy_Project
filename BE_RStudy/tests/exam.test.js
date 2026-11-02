require('dotenv').config();
const prisma = require('../src/config/database');

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;

let passed = 0;
let failed = 0;

const call = async (method, path, { actor = {}, body } = {}) => {
    const { role, userId } = actor;
    const res = await fetch(API + path, {
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

const leaksAnswer = (r) => JSON.stringify(r.json).includes('isCorrect');
const correctOf = (q) => q.options.find((o) => o.isCorrect).id;
const wrongOf = (q) => q.options.find((o) => !o.isCorrect).id;

// Tạo câu hỏi 3 đáp án, đáp án đúng ở vị trí correctIdx
const makeQ = (content, score, correctIdx) => ({
    content,
    score,
    options: [0, 1, 2].map((i) => ({ content: `Đáp án ${i + 1}`, isCorrect: i === correctIdx })),
});

async function main() {
    console.log(`Kiểm tra API Exam + Submission tại ${API}\n`);
    const stamp = Date.now();
    const fx = {};

    try {
        // ---------- Dữ liệu nền ----------
        const mkAccount = (name, role) =>
            prisma.account.create({
                data: { fullName: name, email: `${name.replace(/\s/g, '').toLowerCase()}.${stamp}@example.com`, passwordHash: 'x', role, status: 'HOAT_DONG' },
            });
        const mkTeacher = async (name) => {
            const account = await mkAccount(name, 'TEACHER');
            const teacher = await prisma.teacher.create({
                data: { specialization: 'Test', biography: 'Test', teachingExperience: 'Test', approvalStatus: 'DA_DUYET', accountId: account.id },
            });
            return { account, teacher };
        };
        const mkStudent = async (name) => {
            const account = await mkAccount(name, 'STUDENT');
            const student = await prisma.student.create({ data: { accountId: account.id } });
            return { account, student };
        };

        fx.category = await prisma.category.create({ data: { categoryName: `Exam test ${stamp}` } });
        fx.t1 = await mkTeacher('GV Exam Mot');
        fx.t2 = await mkTeacher('GV Exam Hai');
        fx.s1 = await mkStudent('HV Exam Mot');
        fx.s2 = await mkStudent('HV Exam Hai');
        fx.course = await prisma.course.create({
            data: {
                courseName: `Khóa exam ${stamp}`, description: 'Test',
                startDate: new Date(), endDate: new Date(Date.now() + 86400000),
                categoryId: fx.category.id, teacherId: fx.t1.teacher.id,
            },
        });
        await prisma.courseRegistration.create({ data: { studentId: fx.s1.student.id, courseId: fx.course.id, status: 'DA_THANH_TOAN' } });
        await prisma.courseRegistration.create({ data: { studentId: fx.s2.student.id, courseId: fx.course.id, status: 'CHO_THANH_TOAN' } });

        const ADMIN = { role: 'ADMINISTRATOR' };
        const T = { role: 'TEACHER', userId: fx.t1.account.id }; // giáo viên phụ trách khóa
        const T2 = { role: 'TEACHER', userId: fx.t2.account.id }; // giáo viên khác
        const S = { role: 'STUDENT', userId: fx.s1.account.id }; // học viên đã xác nhận đăng ký
        const S2 = { role: 'STUDENT', userId: fx.s2.account.id }; // học viên chưa xác nhận
        const courseId = fx.course.id;
        const examBody = (over = {}) => ({
            courseId, examName: `Đề test ${stamp}`, durationMinutes: 30, passingScore: 5,
            questions: [makeQ('Câu 1', 4, 0), makeQ('Câu 2', 3, 1), makeQ('Câu 3', 3, 2)],
            ...over,
        });

        // ---------- Tạo đề ----------
        console.log('[Tạo đề]');
        let r = await call('POST', '/exam', { actor: T, body: examBody() });
        check('Giáo viên tạo đề -> 201', r.status === 201, `status ${r.status} ${r.json?.message}`);
        const exam1 = r.json?.data;
        if (!exam1?.id) throw new Error('Không tạo được đề thi, dừng test. Xem log ở terminal chạy server.');
        check('Trạng thái mặc định BAN_NHAP', exam1.status === 'BAN_NHAP', exam1.status);
        check('Có 3 câu hỏi, mỗi câu 3 đáp án', exam1.questions.length === 3 && exam1.questions.every((q) => q.options.length === 3));
        check('Tổng điểm = 10.00', exam1.totalScore === '10.00', exam1.totalScore);
        const [q1, q2, q3] = exam1.questions;

        r = await call('POST', '/exam', { actor: T, body: examBody({ questions: [] }) });
        check('Đề không có câu hỏi -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ questions: [{ ...makeQ('x', 1, 0), options: [{ content: 'a', isCorrect: true }, { content: 'b', isCorrect: true }] }] }) });
        check('Câu có 2 đáp án đúng -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ questions: [{ ...makeQ('x', 1, 0), options: [{ content: 'a', isCorrect: false }, { content: 'b', isCorrect: false }] }] }) });
        check('Câu không có đáp án đúng -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ questions: [{ ...makeQ('x', 1, 0), options: [{ content: 'a', isCorrect: true }] }] }) });
        check('Câu chỉ có 1 đáp án -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ durationMinutes: 0 }) });
        check('Thời gian làm bài = 0 -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ passingScore: 20 }) });
        check('Điểm đạt lớn hơn tổng điểm -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ questions: [{ ...makeQ('a', 1, 0), questionOrder: 1 }, { ...makeQ('b', 1, 0), questionOrder: 1 }], passingScore: 1 }) });
        check('Trùng thứ tự câu hỏi -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ questions: [makeQ('x', -1, 0)] }) });
        check('Điểm câu hỏi âm -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ status: 'DANG_MO' }) });
        check('Gửi trường status khi tạo -> 400, message nêu rõ', r.status === 400 && (r.json?.message || '').includes('status'), r.json?.message);

        r = await call('POST', '/exam', { actor: T2, body: examBody() });
        check('Giáo viên không phụ trách khóa -> 403', r.status === 403, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: S, body: examBody() });
        check('Học viên tạo đề -> 403', r.status === 403, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ courseId: 'khoa-hoc-khong-ton-tai' }) });
        check('Khóa học không tồn tại -> 404', r.status === 404, `status ${r.status}`);

        r = await call('POST', '/exam', { actor: ADMIN, body: examBody({ examName: `Đề nháp ${stamp}`, passingScore: 1, questions: [makeQ('Câu nháp', 2, 0)] }) });
        check('Admin tạo đề -> 201', r.status === 201, `status ${r.status}`);
        const exam2 = r.json?.data;

        // ---------- Học viên chưa thấy đề nháp ----------
        console.log('\n[Đề nháp bị ẩn với học viên]');
        r = await call('GET', `/exam/course/${courseId}`, { actor: S });
        check('Học viên xem danh sách -> 200', r.status === 200, `status ${r.status}`);
        check('Danh sách không có đề nháp', !(r.json?.data?.items || []).some((e) => e.id === exam1.id));

        r = await call('GET', `/exam/${exam1.id}`, { actor: S });
        check('Học viên xem chi tiết đề nháp -> 404', r.status === 404, `status ${r.status}`);

        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam1.id } });
        check('Học viên làm đề nháp -> 404', r.status === 404, `status ${r.status}`);

        r = await call('GET', `/exam/course/${courseId}`, { actor: S2 });
        check('Học viên chưa xác nhận đăng ký xem danh sách -> 403', r.status === 403, `status ${r.status}`);

        // ---------- Sửa câu hỏi khi còn nháp ----------
        console.log('\n[Quản lý câu hỏi / đáp án khi đề còn nháp]');
        const q2a = exam2.questions[0];
        r = await call('POST', `/exam/${exam2.id}/questions`, { actor: T, body: makeQ('Câu thêm', 3, 1) });
        check('Thêm câu hỏi -> 201', r.status === 201, `status ${r.status} ${r.json?.message}`);
        const added = r.json?.data;
        check('Thứ tự tự động = 2', added?.questionOrder === 2, added?.questionOrder);

        r = await call('POST', `/exam/${exam2.id}/questions`, { actor: T, body: { ...makeQ('Trùng vị trí', 1, 0), questionOrder: 2 } });
        check('Thêm câu trùng thứ tự -> 409', r.status === 409, `status ${r.status}`);

        r = await call('PUT', `/exam/questions/${added.id}`, {
            actor: T,
            body: { content: 'Câu đã sửa', options: [{ content: 'X', isCorrect: false }, { content: 'Y', isCorrect: true }] },
        });
        check('Sửa câu hỏi và thay đáp án -> 200', r.status === 200 && r.json?.data?.options?.length === 2, `status ${r.status}`);
        check('Nội dung câu hỏi đã đổi', r.json?.data?.content === 'Câu đã sửa');

        r = await call('PUT', `/exam/questions/${added.id}`, { actor: T, body: { options: [{ content: 'X', isCorrect: true }, { content: 'Y', isCorrect: true }] } });
        check('Sửa thành 2 đáp án đúng -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PUT', `/exam/questions/${added.id}`, { actor: T, body: {} });
        check('Sửa với body rỗng -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PUT', `/exam/questions/${added.id}`, { actor: T2, body: { content: 'x' } });
        check('Giáo viên khác sửa câu hỏi -> 403', r.status === 403, `status ${r.status}`);

        r = await call('PUT', '/exam/questions/khong-ton-tai', { actor: T, body: { content: 'x' } });
        check('Sửa câu hỏi không tồn tại -> 404', r.status === 404, `status ${r.status}`);

        r = await call('DELETE', `/exam/questions/${added.id}`, { actor: T });
        check('Xóa câu hỏi -> 200', r.status === 200, `status ${r.status}`);

        // ---------- Luồng trạng thái ----------
        console.log('\n[Luồng trạng thái đề thi]');
        r = await call('PATCH', `/exam/${exam1.id}/status`, { actor: T, body: { status: 'DA_PHE_DUYET' } });
        check('Giáo viên tự phê duyệt -> 403', r.status === 403, `status ${r.status}`);

        r = await call('PATCH', `/exam/${exam1.id}/status`, { actor: T, body: { status: 'DANG_MO' } });
        check('Mở đề khi chưa được duyệt -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PATCH', `/exam/${exam1.id}/status`, { actor: ADMIN, body: { status: 'SAI' } });
        check('Trạng thái không hợp lệ -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PATCH', `/exam/${exam1.id}/status`, { actor: ADMIN, body: { status: 'DA_PHE_DUYET' } });
        check('Admin phê duyệt -> 200', r.status === 200 && r.json?.data?.status === 'DA_PHE_DUYET', `status ${r.status} ${r.json?.message}`);

        r = await call('PUT', `/exam/questions/${q1.id}`, { actor: T, body: { score: 5 } });
        check('Sửa câu hỏi sau khi đã duyệt -> 409', r.status === 409, `status ${r.status}`);

        r = await call('PATCH', `/exam/${exam1.id}/status`, { actor: T, body: { status: 'DANG_MO' } });
        check('Giáo viên mở đề đã duyệt -> 200', r.status === 200 && r.json?.data?.status === 'DANG_MO', `status ${r.status}`);

        r = await call('POST', '/exam', { actor: T, body: examBody({ examName: `Đề rỗng ${stamp}`, passingScore: 1, questions: [makeQ('Duy nhất', 2, 0)] }) });
        const exam3 = r.json?.data;
        await call('DELETE', `/exam/questions/${exam3.questions[0].id}`, { actor: T });
        r = await call('PATCH', `/exam/${exam3.id}/status`, { actor: ADMIN, body: { status: 'DA_PHE_DUYET' } });
        check('Duyệt đề không còn câu hỏi nào -> 400', r.status === 400, `status ${r.status}`);

        // ---------- Học viên xem đề đang mở ----------
        console.log('\n[Học viên xem đề đang mở]');
        r = await call('GET', `/exam/course/${courseId}`, { actor: S });
        const listed = (r.json?.data?.items || []).find((e) => e.id === exam1.id);
        check('Danh sách có đề đang mở', !!listed);
        check('Có questionCount = 3, attemptsUsed = 0, maxAttempts = 3', listed?.questionCount === 3 && listed?.attemptsUsed === 0 && listed?.maxAttempts === 3, JSON.stringify(listed));

        r = await call('GET', `/exam/${exam1.id}`, { actor: S });
        check('Học viên xem chi tiết đề -> 200', r.status === 200, `status ${r.status}`);
        check('Chi tiết dành cho học viên không có câu hỏi', r.json?.data?.questions === undefined);
        check('Không lộ đáp án đúng (isCorrect)', !leaksAnswer(r));

        r = await call('GET', `/exam/${exam1.id}`, { actor: S2 });
        check('Học viên chưa xác nhận đăng ký xem đề -> 403', r.status === 403, `status ${r.status}`);

        r = await call('GET', `/exam/${exam1.id}`, { actor: T });
        check('Giáo viên xem đề có isCorrect', r.status === 200 && leaksAnswer(r), `status ${r.status}`);

        r = await call('GET', `/exam/${exam1.id}`, { actor: T2 });
        check('Giáo viên khác xem đề -> 403', r.status === 403, `status ${r.status}`);

        r = await call('GET', '/exam/khong-ton-tai', { actor: ADMIN });
        check('Xem đề không tồn tại -> 404', r.status === 404, `status ${r.status}`);

        // ---------- Làm bài ----------
        console.log('\n[Làm bài và nộp bài]');
        r = await call('POST', '/submission/start', { actor: S2, body: { examId: exam1.id } });
        check('Học viên chưa xác nhận đăng ký làm bài -> 403', r.status === 403, `status ${r.status}`);

        r = await call('POST', '/submission/start', { actor: T, body: { examId: exam1.id } });
        check('Giáo viên bắt đầu làm bài -> 403', r.status === 403, `status ${r.status}`);

        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam1.id } });
        check('Bắt đầu làm bài -> 200', r.status === 200, `status ${r.status} ${r.json?.message}`);
        const a1 = r.json?.data?.attempt;
        check('Nhận đủ 3 câu hỏi', r.json?.data?.questions?.length === 3);
        check('Không lộ đáp án đúng (isCorrect)', !leaksAnswer(r));
        check('Bài làm DANG_LAM và còn thời gian', a1?.status === 'DANG_LAM' && a1?.remainingSeconds > 0 && a1?.remainingSeconds <= 1800, JSON.stringify(a1));

        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam1.id } });
        check('Bắt đầu lần nữa khi đang làm -> làm tiếp bài cũ', r.json?.data?.attempt?.id === a1.id);

        r = await call('PUT', `/submission/${a1.id}/answers`, { actor: S, body: { answers: [{ questionId: q1.id, answerOptionId: correctOf(q1) }, { questionId: q2.id, answerOptionId: wrongOf(q2) }] } });
        check('Lưu đáp án -> 200', r.status === 200 && r.json?.data?.saved === 2, `status ${r.status} ${r.json?.message}`);

        r = await call('PUT', `/submission/${a1.id}/answers`, { actor: S, body: { answers: [{ questionId: q1.id, answerOptionId: correctOf(q2) }] } });
        check('Đáp án không thuộc câu hỏi -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PUT', `/submission/${a1.id}/answers`, { actor: S, body: { answers: [{ questionId: 'cau-khong-ton-tai', answerOptionId: null }] } });
        check('Câu hỏi không thuộc đề -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PUT', `/submission/${a1.id}/answers`, { actor: S, body: { answers: [{ questionId: q2.id, answerOptionId: null }] } });
        check('Bỏ chọn một câu -> 200', r.status === 200, `status ${r.status}`);

        r = await call('PUT', `/submission/${a1.id}/answers`, { actor: S2, body: { answers: [{ questionId: q1.id, answerOptionId: null }] } });
        check('Học viên khác lưu vào bài của người khác -> 404', r.status === 404, `status ${r.status}`);

        r = await call('PUT', `/submission/${a1.id}/answers`, { actor: S, body: { answers: [{ questionId: q2.id, answerOptionId: wrongOf(q2) }] } });

        r = await call('GET', `/submission/${a1.id}`, { actor: S });
        check('Xem bài đang làm -> 200, chưa có điểm', r.status === 200 && r.json?.data?.status === 'DANG_LAM' && r.json?.data?.score === null, `status ${r.status}`);

        r = await call('POST', `/submission/${a1.id}/submit`, { actor: S, body: { answers: [{ questionId: q3.id, answerOptionId: correctOf(q3) }] } });
        check('Nộp bài kèm đáp án cuối -> 200', r.status === 200, `status ${r.status} ${r.json?.message}`);
        check('Điểm = 7.00 (đúng câu 1 và 3)', r.json?.data?.score === '7.00', r.json?.data?.score);
        check('Tổng điểm 10.00, điểm đạt 5.00, passed = true', r.json?.data?.totalScore === '10.00' && r.json?.data?.passingScore === '5.00' && r.json?.data?.passed === true);
        check('Trạng thái DA_CHAM, không phải tự nộp', r.json?.data?.status === 'DA_CHAM' && r.json?.data?.autoSubmitted === false);

        r = await call('POST', `/submission/${a1.id}/submit`, { actor: S, body: {} });
        check('Nộp lần nữa -> 409', r.status === 409, `status ${r.status}`);

        r = await call('PUT', `/submission/${a1.id}/answers`, { actor: S, body: { answers: [{ questionId: q1.id, answerOptionId: null }] } });
        check('Lưu đáp án sau khi nộp -> 400', r.status === 400, `status ${r.status}`);

        r = await call('GET', `/submission/${a1.id}`, { actor: S });
        check('Học viên xem kết quả -> 200', r.status === 200 && r.json?.data?.score === '7.00', `status ${r.status}`);
        check('Kết quả có đáp án đã chọn', r.json?.data?.questions?.find((q) => q.questionId === q1.id)?.selectedAnswerOptionId === correctOf(q1));
        check('Kết quả không lộ đáp án đúng', !leaksAnswer(r));

        r = await call('GET', `/submission/${a1.id}`, { actor: S2 });
        check('Học viên khác xem bài -> 404', r.status === 404, `status ${r.status}`);

        r = await call('GET', `/submission/${a1.id}`, { actor: T });
        const staffQ2 = r.json?.data?.questions?.find((q) => q.questionId === q2.id);
        check('Giáo viên xem bài có isCorrect từng câu', r.status === 200 && staffQ2?.isCorrect === false && staffQ2?.earnedScore === '0.00', `status ${r.status}`);

        r = await call('GET', `/submission/${a1.id}`, { actor: T2 });
        check('Giáo viên khác xem bài -> 403', r.status === 403, `status ${r.status}`);

        r = await call('GET', `/submission/me?examId=${exam1.id}`, { actor: S });
        check('Lịch sử làm bài có bài vừa nộp', r.status === 200 && (r.json?.data?.items || []).some((a) => a.id === a1.id), `status ${r.status}`);

        r = await call('GET', '/submission/me', { actor: T });
        check('Giáo viên xem lịch sử của học viên -> 403', r.status === 403, `status ${r.status}`);

        // ---------- Giới hạn 3 lần ----------
        console.log('\n[Giới hạn 3 lần làm bài]');
        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam1.id } });
        check('Lần 2: bắt đầu -> 200, bài mới', r.status === 200 && r.json?.data?.attempt?.id !== a1.id, `status ${r.status}`);
        const a2 = r.json?.data?.attempt;
        r = await call('POST', `/submission/${a2.id}/submit`, { actor: S, body: {} });
        check('Lần 2: nộp bài trống -> 0.00, không đạt', r.json?.data?.score === '0.00' && r.json?.data?.passed === false, r.json?.data?.score);

        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam1.id } });
        const a3 = r.json?.data?.attempt;
        check('Lần 3: bắt đầu -> 200', r.status === 200 && !!a3, `status ${r.status}`);
        r = await call('POST', `/submission/${a3.id}/submit`, { actor: S });
        check('Lần 3: nộp không gửi body -> 200', r.status === 200, `status ${r.status} ${r.json?.message}`);

        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam1.id } });
        check('Lần 4: bị từ chối -> 400', r.status === 400, `status ${r.status}`);

        r = await call('GET', `/exam/course/${courseId}`, { actor: S });
        check('attemptsUsed = 3', (r.json?.data?.items || []).find((e) => e.id === exam1.id)?.attemptsUsed === 3);

        // ---------- Giáo viên xem bài làm ----------
        console.log('\n[Giáo viên / admin xem các bài làm]');
        r = await call('GET', `/submission/exam/${exam1.id}`, { actor: T });
        check('Giáo viên xem danh sách bài làm -> 200, đủ 3 bài', r.status === 200 && r.json?.data?.pagination?.total === 3, `status ${r.status}`);
        check('Có thông tin học viên', !!r.json?.data?.items?.[0]?.student?.account?.fullName);
        r = await call('GET', `/submission/exam/${exam1.id}?status=DA_CHAM`, { actor: ADMIN });
        check('Admin lọc status=DA_CHAM -> 200', r.status === 200 && r.json?.data?.pagination?.total === 3, `status ${r.status}`);
        r = await call('GET', `/submission/exam/${exam1.id}`, { actor: T2 });
        check('Giáo viên khác -> 403', r.status === 403, `status ${r.status}`);
        r = await call('GET', `/submission/exam/${exam1.id}`, { actor: S });
        check('Học viên -> 403', r.status === 403, `status ${r.status}`);

        // ---------- Hết giờ ----------
        console.log('\n[Hết giờ làm bài]');
        r = await call('POST', '/exam', { actor: T, body: examBody({ examName: `Đề 1 phút ${stamp}`, durationMinutes: 1, passingScore: 5, questions: [makeQ('A', 5, 0), makeQ('B', 5, 1)] }) });
        const exam4 = r.json?.data;
        await call('PATCH', `/exam/${exam4.id}/status`, { actor: ADMIN, body: { status: 'DA_PHE_DUYET' } });
        await call('PATCH', `/exam/${exam4.id}/status`, { actor: T, body: { status: 'DANG_MO' } });
        const [e4q1, e4q2] = exam4.questions;
        const backdate = (id) => prisma.examAttempt.update({ where: { id }, data: { startTime: new Date(Date.now() - 5 * 60 * 1000) } });

        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam4.id } });
        const b1 = r.json?.data?.attempt;
        await call('PUT', `/submission/${b1.id}/answers`, { actor: S, body: { answers: [{ questionId: e4q1.id, answerOptionId: correctOf(e4q1) }] } });
        await backdate(b1.id);
        r = await call('POST', `/submission/${b1.id}/submit`, { actor: S, body: { answers: [{ questionId: e4q2.id, answerOptionId: correctOf(e4q2) }] } });
        check('Nộp muộn -> 200, tự động nộp', r.status === 200 && r.json?.data?.autoSubmitted === true, `status ${r.status} ${r.json?.message}`);
        check('Chỉ chấm đáp án đã lưu trước hạn (5.00)', r.json?.data?.score === '5.00', r.json?.data?.score);

        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam4.id } });
        const b2 = r.json?.data?.attempt;
        await backdate(b2.id);
        r = await call('PUT', `/submission/${b2.id}/answers`, { actor: S, body: { answers: [{ questionId: e4q1.id, answerOptionId: correctOf(e4q1) }] } });
        check('Lưu đáp án khi đã hết giờ -> 400', r.status === 400 && /hết thời gian/.test(r.json?.message || ''), `status ${r.status} ${r.json?.message}`);
        r = await call('GET', `/submission/${b2.id}`, { actor: S });
        check('Bài quá hạn được tự động nộp (DA_CHAM, điểm 0.00)', r.json?.data?.status === 'DA_CHAM' && r.json?.data?.score === '0.00', JSON.stringify(r.json?.data?.status));

        // ---------- Quy tắc sau khi đã có bài làm ----------
        console.log('\n[Quy tắc khi đề đã có bài làm]');
        r = await call('DELETE', `/exam/${exam1.id}`, { actor: T });
        check('Xóa đề đã có bài làm -> 409', r.status === 409, `status ${r.status}`);

        r = await call('PUT', `/exam/${exam1.id}`, { actor: T, body: { durationMinutes: 99 } });
        check('Đổi thời gian làm bài khi đã có bài làm -> 409', r.status === 409, `status ${r.status}`);

        r = await call('PUT', `/exam/${exam1.id}`, { actor: T, body: { passingScore: 20 } });
        check('Điểm đạt lớn hơn tổng điểm -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PUT', `/exam/${exam1.id}`, { actor: T, body: { examName: `Tên mới ${stamp}`, passingScore: 6 } });
        check('Đổi tên và điểm đạt -> 200', r.status === 200 && Number(r.json?.data?.passingScore) === 6, `status ${r.status}`);

        r = await call('PUT', `/exam/${exam1.id}`, { actor: T, body: {} });
        check('Sửa đề với body rỗng -> 400', r.status === 400, `status ${r.status}`);

        r = await call('PATCH', `/exam/${exam1.id}/status`, { actor: T, body: { status: 'TAM_NGUNG' } });
        check('Tạm ngưng đề -> 200', r.status === 200, `status ${r.status}`);

        r = await call('POST', '/submission/start', { actor: S, body: { examId: exam1.id } });
        check('Làm đề đã tạm ngưng -> 404', r.status === 404, `status ${r.status}`);

        r = await call('PATCH', `/exam/${exam1.id}/status`, { actor: T, body: { status: 'BAN_NHAP' } });
        check('Chuyển đề đã có bài làm về nháp -> 409', r.status === 409, `status ${r.status}`);

        r = await call('DELETE', `/exam/${exam2.id}`, { actor: T2 });
        check('Giáo viên khác xóa đề -> 403', r.status === 403, `status ${r.status}`);

        r = await call('DELETE', `/exam/${exam2.id}`, { actor: T });
        check('Xóa đề chưa có bài làm -> 200', r.status === 200, `status ${r.status}`);

        r = await call('GET', `/exam/${exam2.id}`, { actor: ADMIN });
        check('Đề đã xóa -> 404', r.status === 404, `status ${r.status}`);
    } catch (e) {
        check('Chạy test không phát sinh lỗi bất ngờ', false, e.message);
    } finally {
        // Dọn dữ liệu test theo thứ tự phụ thuộc
        const safe = async (fn) => { try { await fn(); } catch (_) { } };
        if (fx.course) {
            const examWhere = { courseId: fx.course.id };
            await safe(() => prisma.examAttemptDetail.deleteMany({ where: { attempt: { exam: examWhere } } }));
            await safe(() => prisma.examAttempt.deleteMany({ where: { exam: examWhere } }));
            await safe(() => prisma.answerOption.deleteMany({ where: { question: { exam: examWhere } } }));
            await safe(() => prisma.examQuestion.deleteMany({ where: { exam: examWhere } }));
            await safe(() => prisma.exam.deleteMany({ where: examWhere }));
            await safe(() => prisma.courseRegistration.deleteMany({ where: { courseId: fx.course.id } }));
            await safe(() => prisma.course.delete({ where: { id: fx.course.id } }));
        }
        if (fx.category) await safe(() => prisma.category.delete({ where: { id: fx.category.id } }));
        for (const k of ['s1', 's2']) if (fx[k]) await safe(() => prisma.student.delete({ where: { id: fx[k].student.id } }));
        for (const k of ['t1', 't2']) if (fx[k]) await safe(() => prisma.teacher.delete({ where: { id: fx[k].teacher.id } }));
        for (const k of ['s1', 's2', 't1', 't2']) if (fx[k]) await safe(() => prisma.account.delete({ where: { id: fx[k].account.id } }));
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