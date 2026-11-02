const prisma = require("../config/database");

const attemptInclude = {
    exam: { select: { id: true, examName: true, durationMinutes: true, passingScore: true, courseId: true } },
    details: { select: { questionId: true, answerOptionId: true } },
};

// ---------- Đề (cho học viên: KHÔNG lấy isCorrect) ----------
const findExamForStart = (id) =>
    prisma.exam.findUnique({
        where: { id },
        include: {
            questions: {
                orderBy: { questionOrder: "asc" },
                select: {
                    id: true,
                    content: true,
                    score: true,
                    questionOrder: true,
                    options: { orderBy: { id: "asc" }, select: { id: true, content: true } },
                },
            },
        },
    });

// Dùng cho chấm điểm, kiểm tra đáp án hợp lệ và xem kết quả (có isCorrect, KHÔNG gửi thẳng cho học viên)
const findQuestionsWithOptions = (examId) =>
    prisma.examQuestion.findMany({
        where: { examId },
        orderBy: { questionOrder: "asc" },
        include: { options: { orderBy: { id: "asc" } } },
    });

// ---------- Bài làm ----------
const findAttemptById = (id) => prisma.examAttempt.findUnique({ where: { id }, include: attemptInclude });

const findInProgress = (studentId, examId) =>
    prisma.examAttempt.findFirst({
        where: { studentId, examId, status: "DANG_LAM" },
        orderBy: { startTime: "desc" },
        include: attemptInclude,
    });

// Các lần làm đã tính vào giới hạn (bỏ qua bài bị hủy)
const countAttempts = (studentId, examId) =>
    prisma.examAttempt.count({ where: { studentId, examId, status: { not: "HUY" } } });

const createAttempt = (studentId, examId) =>
    prisma.examAttempt.create({ data: { studentId, examId }, include: attemptInclude });

const upsertAnswers = (attemptId, answers) =>
    prisma.$transaction(
        answers.map((a) =>
            prisma.examAttemptDetail.upsert({
                where: { attemptId_questionId: { attemptId, questionId: a.questionId } },
                create: { attemptId, questionId: a.questionId, answerOptionId: a.answerOptionId },
                update: { answerOptionId: a.answerOptionId },
            })
        )
    );

// Chỉ đóng được bài đang làm: tránh chấm hai lần khi nộp trùng
const closeAttempt = async (id, score, endTime) => {
    const r = await prisma.examAttempt.updateMany({
        where: { id, status: "DANG_LAM" },
        data: { score, endTime, status: "DA_CHAM" },
    });
    return r.count === 1;
};

const sumQuestionScore = async (examId) => {
    const r = await prisma.examQuestion.aggregate({ where: { examId }, _sum: { score: true } });
    return r._sum.score;
};

const findManyByStudent = (where, { skip, take }) =>
    Promise.all([
        prisma.examAttempt.findMany({
            where,
            skip,
            take,
            orderBy: { startTime: "desc" },
            include: attemptInclude,
        }),
        prisma.examAttempt.count({ where }),
    ]);

const findManyByExam = (where, { skip, take }) =>
    Promise.all([
        prisma.examAttempt.findMany({
            where,
            skip,
            take,
            orderBy: { startTime: "desc" },
            include: {
                ...attemptInclude,
                student: { select: { id: true, account: { select: { fullName: true, email: true } } } },
            },
        }),
        prisma.examAttempt.count({ where }),
    ]);

module.exports = {
    findExamForStart,
    findQuestionsWithOptions,
    findAttemptById,
    findInProgress,
    countAttempts,
    createAttempt,
    upsertAnswers,
    closeAttempt,
    sumQuestionScore,
    findManyByStudent,
    findManyByExam,
};