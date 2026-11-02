const prisma = require("../config/database");

const CONFIRMED_REGISTRATION = ["DA_THANH_TOAN", "HOAN_THANH"];

// Đề đầy đủ (kèm isCorrect) - CHỈ dùng cho giáo viên/admin
const fullInclude = {
    questions: {
        orderBy: { questionOrder: "asc" },
        include: { options: { orderBy: { id: "asc" } } },
    },
    _count: { select: { attempts: true } },
};

// ---------- Người dùng / khóa học ----------
const findTeacherByAccountId = (accountId) =>
    prisma.teacher.findUnique({ where: { accountId }, select: { id: true, approvalStatus: true } });

const findStudentIdByAccountId = async (accountId) => {
    const student = await prisma.student.findUnique({ where: { accountId }, select: { id: true } });
    return student ? student.id : null;
};

const findCourseById = (id) =>
    prisma.course.findUnique({ where: { id }, select: { id: true, teacherId: true } });

const hasConfirmedRegistration = async (studentId, courseId) =>
    (await prisma.courseRegistration.count({
        where: { studentId, courseId, status: { in: CONFIRMED_REGISTRATION } },
    })) > 0;

// ---------- Exam ----------
const findManyByCourse = (where, { skip, take }) =>
    Promise.all([
        prisma.exam.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { questions: true, attempts: true } } },
        }),
        prisma.exam.count({ where }),
    ]);

const findExamById = (id) => prisma.exam.findUnique({ where: { id }, include: fullInclude });

const findExamBasic = (id) =>
    prisma.exam.findUnique({
        where: { id },
        include: { _count: { select: { questions: true, attempts: true } } },
    });

const createExam = ({ questions, ...exam }) =>
    prisma.exam.create({
        data: {
            ...exam,
            questions: {
                create: questions.map((q) => ({
                    content: q.content,
                    score: q.score,
                    questionOrder: q.questionOrder,
                    options: { create: q.options.map((o) => ({ content: o.content, isCorrect: o.isCorrect })) },
                })),
            },
        },
        include: fullInclude,
    });

const updateExam = (id, data) => prisma.exam.update({ where: { id }, data });

const deleteExam = (id) =>
    prisma.$transaction([
        prisma.answerOption.deleteMany({ where: { question: { examId: id } } }),
        prisma.examQuestion.deleteMany({ where: { examId: id } }),
        prisma.exam.delete({ where: { id } }),
    ]);

const sumQuestionScore = async (examId) => {
    const r = await prisma.examQuestion.aggregate({ where: { examId }, _sum: { score: true } });
    return r._sum.score;
};

const countAttemptsByExams = async (studentId, examIds) => {
    const rows = await prisma.examAttempt.groupBy({
        by: ["examId"],
        where: { studentId, examId: { in: examIds }, status: { not: "HUY" } },
        _count: { _all: true },
    });
    return new Map(rows.map((r) => [r.examId, r._count._all]));
};

// ---------- Question / Option ----------
const findQuestionById = (id) =>
    prisma.examQuestion.findUnique({ where: { id }, include: { options: { orderBy: { id: "asc" } } } });

const findQuestionOrder = (examId, questionOrder, excludeId) =>
    prisma.examQuestion.findFirst({
        where: { examId, questionOrder, ...(excludeId && { NOT: { id: excludeId } }) },
        select: { id: true },
    });

const maxQuestionOrder = async (examId) => {
    const r = await prisma.examQuestion.aggregate({ where: { examId }, _max: { questionOrder: true } });
    return r._max.questionOrder || 0;
};

const createQuestion = (examId, q) =>
    prisma.examQuestion.create({
        data: {
            examId,
            content: q.content,
            score: q.score,
            questionOrder: q.questionOrder,
            options: { create: q.options.map((o) => ({ content: o.content, isCorrect: o.isCorrect })) },
        },
        include: { options: { orderBy: { id: "asc" } } },
    });

// Thay thế toàn bộ đáp án khi có options (an toàn vì chỉ gọi khi đề chưa có bài làm)
const updateQuestion = (id, { options, ...fields }) =>
    prisma.$transaction(async (tx) => {
        if (options) {
            await tx.answerOption.deleteMany({ where: { questionId: id } });
            await tx.answerOption.createMany({
                data: options.map((o) => ({ content: o.content, isCorrect: o.isCorrect, questionId: id })),
            });
        }
        return tx.examQuestion.update({
            where: { id },
            data: fields,
            include: { options: { orderBy: { id: "asc" } } },
        });
    });

const deleteQuestion = (id) =>
    prisma.$transaction([
        prisma.answerOption.deleteMany({ where: { questionId: id } }),
        prisma.examQuestion.delete({ where: { id } }),
    ]);

module.exports = {
    findTeacherByAccountId,
    findStudentIdByAccountId,
    findCourseById,
    hasConfirmedRegistration,
    findManyByCourse,
    findExamById,
    findExamBasic,
    createExam,
    updateExam,
    deleteExam,
    sumQuestionScore,
    countAttemptsByExams,
    findQuestionById,
    findQuestionOrder,
    maxQuestionOrder,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};