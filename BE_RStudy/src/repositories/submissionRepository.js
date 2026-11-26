const prisma = require("../config/database");

const db = (tx) => tx || prisma;

const attemptInclude = {
  exam: { select: { id: true, examName: true, durationMinutes: true, passingScore: true, courseId: true, showAnswers: true } },
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
      course: { select: { learning: { select: { showExams: true } } } },
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
const findAttemptById = (id, tx) => db(tx).examAttempt.findUnique({ where: { id }, include: attemptInclude });

const findInProgress = (studentId, examId) =>
  prisma.examAttempt.findFirst({
    where: { studentId, examId, status: "DANG_LAM" },
    orderBy: { startTime: "desc" },
    include: attemptInclude,
  });

// Các lần làm đã tính vào giới hạn (bỏ qua bài bị hủy)
const countAttempts = (studentId, examId) => prisma.examAttempt.count({ where: { studentId, examId, status: { not: "HUY" } } });

const createAttempt = (studentId, examId) => prisma.examAttempt.create({ data: { studentId, examId }, include: attemptInclude });

// Có tx thì ghi trong transaction của người gọi (đã khóa bài làm); không thì tự mở transaction
const upsertAnswers = (attemptId, answers, tx) => {
  const ops = (client) =>
    answers.map((a) =>
      client.examAttemptDetail.upsert({
        where: { attemptId_questionId: { attemptId, questionId: a.questionId } },
        create: { attemptId, questionId: a.questionId, answerOptionId: a.answerOptionId },
        update: { answerOptionId: a.answerOptionId },
      }),
    );
  return tx ? Promise.all(ops(tx)) : prisma.$transaction(ops(prisma));
};

// Khóa dòng bài làm đang DANG_LAM rồi mới chạy work(tx): lưu đáp án và chấm điểm không chạy xen nhau.
// Bài đã được đóng bởi request khác thì không chạy work và trả null.
const withActiveAttempt = (attemptId, work) =>
  prisma.$transaction(
    async (tx) => {
      const rows = await tx.$queryRaw`SELECT id FROM "ExamAttempt" WHERE id = ${attemptId} AND status = 'DANG_LAM' FOR UPDATE`;
      return rows.length > 0 ? work(tx) : null;
    },
    { maxWait: 10000, timeout: 10000 },
  );

// Chỉ đóng được bài đang làm: tránh chấm hai lần khi nộp trùng
const closeAttempt = async (id, score, endTime, tx) => {
  const r = await db(tx).examAttempt.updateMany({
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

const withStartLock = (studentId, examId, work) =>
  prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${studentId}:${examId}`}::text))`;
      return work();
    },
    { timeout: 10000 },
  );

const findManyForManage = (where, { skip, take }) =>
  Promise.all([
    prisma.examAttempt.findMany({
      where,
      skip,
      take,
      orderBy: { startTime: "desc" },
      include: {
        ...attemptInclude,
        student: { select: { id: true, account: { select: { fullName: true, email: true } } } },
        exam: { select: { id: true, examName: true, durationMinutes: true, passingScore: true, courseId: true, showAnswers: true, course: { select: { id: true, courseName: true } } } },
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
  withStartLock,
  upsertAnswers,
  closeAttempt,
  withActiveAttempt,
  sumQuestionScore,
  findManyByStudent,
  findManyByExam,
  findManyForManage,
};
