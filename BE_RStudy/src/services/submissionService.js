const { Prisma } = require("@prisma/client");
const AppError = require("../utils/AppError");
const repo = require("../repositories/submissionRepository");
const examRepo = require("../repositories/examRepository");
const { MAX_ATTEMPTS, assertCanManageCourse } = require("./examService");

const { Decimal } = Prisma;
const GRACE_MS = 10 * 1000; // cho phép trễ nhẹ do mạng khi lưu/nộp bài

// ---------- Thời gian ----------
const deadlineOf = (attempt) =>
    new Date(attempt.startTime.getTime() + attempt.exam.durationMinutes * 60 * 1000);
const isExpired = (attempt, now = new Date()) => now.getTime() > deadlineOf(attempt).getTime() + GRACE_MS;
const remainingSeconds = (attempt, now = new Date()) =>
    Math.max(0, Math.floor((deadlineOf(attempt).getTime() - now.getTime()) / 1000));

const fixed = (value) => (value == null ? null : new Decimal(value).toFixed(2));

// ---------- Chấm điểm ----------
// Chấm theo đáp án đã lưu trên server, đóng bài. Trả false nếu bài đã được đóng bởi request khác.
async function gradeAndClose(attempt, endTime) {
    const questions = await repo.findQuestionsWithOptions(attempt.examId);
    const chosen = new Map(attempt.details.map((d) => [d.questionId, d.answerOptionId]));

    let score = new Decimal(0);
    for (const q of questions) {
        const picked = chosen.get(q.id);
        if (picked && q.options.some((o) => o.id === picked && o.isCorrect)) score = score.add(q.score);
    }
    return repo.closeAttempt(attempt.id, score, endTime);
}

// Hết giờ mà chưa nộp: tự nộp với các đáp án đã chọn
async function autoSubmitIfExpired(attempt) {
    if (attempt.status === "DANG_LAM" && isExpired(attempt)) {
        await gradeAndClose(attempt, deadlineOf(attempt));
        return repo.findAttemptById(attempt.id);
    }
    return attempt;
}

// ---------- Định dạng dữ liệu trả về ----------
function toAttemptDto(attempt, totalScore) {
    const finished = attempt.status !== "DANG_LAM";
    const dto = {
        id: attempt.id,
        examId: attempt.examId,
        examName: attempt.exam.examName,
        status: attempt.status,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
        deadline: deadlineOf(attempt),
        score: fixed(attempt.score),
        passingScore: fixed(attempt.exam.passingScore),
        passed: attempt.score == null ? null : new Decimal(attempt.score).gte(attempt.exam.passingScore),
    };
    if (totalScore !== undefined) dto.totalScore = fixed(totalScore);
    if (!finished) dto.remainingSeconds = remainingSeconds(attempt);
    return dto;
}

// Chi tiết từng câu. Học viên: chỉ thấy đáp án ĐÃ CHỌN, không thấy đáp án đúng. Giáo viên/admin: thấy đầy đủ.
async function buildQuestionDetails(attempt, { staff }) {
    const questions = await repo.findQuestionsWithOptions(attempt.examId);
    const chosen = new Map(attempt.details.map((d) => [d.questionId, d.answerOptionId]));

    return questions.map((q) => {
        const selectedAnswerOptionId = chosen.get(q.id) || null;
        const base = {
            questionId: q.id,
            content: q.content,
            score: fixed(q.score),
            questionOrder: q.questionOrder,
            selectedAnswerOptionId,
        };
        if (!staff) {
            return { ...base, options: q.options.map((o) => ({ id: o.id, content: o.content })) };
        }
        const correct = q.options.some((o) => o.id === selectedAnswerOptionId && o.isCorrect);
        return {
            ...base,
            options: q.options.map((o) => ({ id: o.id, content: o.content, isCorrect: o.isCorrect })),
            isCorrect: correct,
            earnedScore: correct ? fixed(q.score) : "0.00",
        };
    });
}

// ---------- Truy cập bài làm ----------
async function requireStudentId(accountId) {
    const studentId = await examRepo.findStudentIdByAccountId(accountId);
    if (!studentId) throw new AppError("Chỉ học viên mới được làm bài thi", 403);
    return studentId;
}

async function loadOwnAttempt(accountId, attemptId) {
    const studentId = await requireStudentId(accountId);
    const attempt = await repo.findAttemptById(attemptId);
    if (!attempt || attempt.studentId !== studentId) throw new AppError("Bài làm không tồn tại", 404);
    return attempt;
}

// Kiểm tra bài còn đang làm và còn thời gian; nếu hết giờ thì tự nộp rồi báo lỗi
async function assertActive(attempt) {
    if (attempt.status !== "DANG_LAM") throw new AppError("Bài làm đã kết thúc, không thể thay đổi đáp án", 400);
    if (isExpired(attempt)) {
        await gradeAndClose(attempt, deadlineOf(attempt));
        throw new AppError("Đã hết thời gian làm bài, hệ thống đã tự động nộp bài", 400);
    }
}

// Câu hỏi phải thuộc đề của bài làm, đáp án phải thuộc đúng câu hỏi đó
async function persistAnswers(attempt, answers) {
    const questions = await repo.findQuestionsWithOptions(attempt.examId);
    const optionsOf = new Map(questions.map((q) => [q.id, new Set(q.options.map((o) => o.id))]));

    const latest = new Map();
    for (const a of answers) {
        if (!optionsOf.has(a.questionId)) throw new AppError("Câu hỏi không thuộc đề thi này", 400);
        if (a.answerOptionId !== null && !optionsOf.get(a.questionId).has(a.answerOptionId)) {
            throw new AppError("Đáp án không thuộc câu hỏi đã chọn", 400);
        }
        latest.set(a.questionId, a); // cùng một câu gửi nhiều lần: lấy lần cuối
    }
    await repo.upsertAnswers(attempt.id, [...latest.values()]);
}

// ---------- Học viên làm bài ----------
async function start(accountId, examId) {
    const studentId = await requireStudentId(accountId);

    const exam = await repo.findExamForStart(examId);
    if (!exam || exam.status !== "DANG_MO") throw new AppError("Đề thi không tồn tại hoặc chưa mở", 404);
    if (!(await examRepo.hasConfirmedRegistration(studentId, exam.courseId))) {
        throw new AppError("Bạn cần được xác nhận đăng ký khóa học để làm bài thi", 403);
    }

    // Còn bài đang làm: làm tiếp (không tính thêm lượt). Nếu đã hết giờ thì tự nộp rồi mới xét lượt mới.
    let attempt = await repo.findInProgress(studentId, examId);
    if (attempt && isExpired(attempt)) {
        await gradeAndClose(attempt, deadlineOf(attempt));
        attempt = null;
    }
    if (!attempt) {
        if ((await repo.countAttempts(studentId, examId)) >= MAX_ATTEMPTS) {
            throw new AppError(`Bạn đã làm đủ ${MAX_ATTEMPTS} lần cho đề thi này`, 400);
        }
        attempt = await repo.createAttempt(studentId, examId);
    }

    return {
        attempt: toAttemptDto(attempt),
        exam: { id: exam.id, examName: exam.examName, durationMinutes: exam.durationMinutes },
        questions: exam.questions,
        answers: attempt.details,
    };
}

async function saveAnswers(accountId, attemptId, answers) {
    const attempt = await loadOwnAttempt(accountId, attemptId);
    await assertActive(attempt);
    await persistAnswers(attempt, answers);
    return { saved: new Set(answers.map((a) => a.questionId)).size, remainingSeconds: remainingSeconds(attempt) };
}

async function submit(accountId, attemptId, answers) {
    const attempt = await loadOwnAttempt(accountId, attemptId);
    if (attempt.status !== "DANG_LAM") throw new AppError("Bài làm đã được nộp trước đó", 409);

    const now = new Date();
    const expired = isExpired(attempt, now);
    let current = attempt;

    // Quá hạn thì bỏ qua đáp án gửi kèm, chỉ chấm theo đáp án đã lưu trước đó
    if (!expired && answers && answers.length > 0) {
        await persistAnswers(attempt, answers);
        current = await repo.findAttemptById(attemptId);
    }
    const closed = await gradeAndClose(current, expired ? deadlineOf(attempt) : now);
    if (!closed) throw new AppError("Bài làm đã được nộp trước đó", 409);

    const done = await repo.findAttemptById(attemptId);
    const totalScore = await repo.sumQuestionScore(done.examId);
    return { ...toAttemptDto(done, totalScore), autoSubmitted: expired };
}

async function myAttempts(accountId, query, { skip, take }) {
    const studentId = await requireStudentId(accountId);
    const where = { studentId, ...(query.examId && { examId: String(query.examId) }) };
    const [rows, total] = await repo.findManyByStudent(where, { skip, take });
    const attempts = await Promise.all(rows.map(autoSubmitIfExpired));
    return { items: attempts.map((a) => toAttemptDto(a)), total };
}

// ---------- Xem kết quả ----------
async function getById(user, attemptId) {
    if (user.role === "STUDENT") {
        let attempt = await loadOwnAttempt(user.id, attemptId);
        attempt = await autoSubmitIfExpired(attempt);

        if (attempt.status === "DANG_LAM") {
            return { ...toAttemptDto(attempt), answers: attempt.details };
        }
        const totalScore = await repo.sumQuestionScore(attempt.examId);
        return { ...toAttemptDto(attempt, totalScore), questions: await buildQuestionDetails(attempt, { staff: false }) };
    }

    const attempt = await repo.findAttemptById(attemptId);
    if (!attempt) throw new AppError("Bài làm không tồn tại", 404);
    await assertCanManageCourse(user, attempt.exam.courseId);

    const settled = await autoSubmitIfExpired(attempt);
    const totalScore = await repo.sumQuestionScore(settled.examId);
    return { ...toAttemptDto(settled, totalScore), questions: await buildQuestionDetails(settled, { staff: true }) };
}

async function listByExam(user, examId, query, { skip, take }) {
    const exam = await examRepo.findExamBasic(examId);
    if (!exam) throw new AppError("Đề thi không tồn tại", 404);
    await assertCanManageCourse(user, exam.courseId);

    const where = { examId };
    if (["DANG_LAM", "DA_NOP", "DA_CHAM", "HUY"].includes(query.status)) where.status = query.status;

    const [rows, total] = await repo.findManyByExam(where, { skip, take });
    const items = rows.map((a) => ({ ...toAttemptDto(a), student: a.student }));
    return { items, total };
}

module.exports = { start, saveAnswers, submit, myAttempts, getById, listByExam };