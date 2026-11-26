const prisma = require("../config/database");
const { courseSelect } = require("./recommendationRepository");

const db = (tx) => tx || prisma;

const messageInclude = {
    recommendations: { include: { course: { select: courseSelect } } },
};

const findStudentIdByAccountId = async (accountId) => {
    const student = await prisma.student.findUnique({ where: { accountId }, select: { id: true } });
    return student ? student.id : null;
};

const createConversation = (studentId, tx) => db(tx).aiConversation.create({ data: { studentId } });

// Kiểm tra hạn mức + lưu tin của một học viên không chạy chồng nhau (advisory lock của PostgreSQL).
// Dùng try-lock: không chờ khóa nên không giữ kết nối DB (gửi dồn không làm cạn pool). Trả null nếu khóa đang bận.
// Chỉ bọc phần đọc/ghi DB, KHÔNG bọc lời gọi AI để khỏi giữ kết nối DB hàng chục giây.
const withStudentLock = (studentId, work) =>
    prisma.$transaction(
        async (tx) => {
            const [{ locked }] = await tx.$queryRaw`SELECT pg_try_advisory_xact_lock(hashtext(${`chatbot:${studentId}`}::text)) AS locked`;
            return locked ? work(tx) : null;
        },
        { maxWait: 10000, timeout: 10000 } // maxWait: chờ pool kết nối khi nhiều request cùng lúc
    );

const findConversationById = (id) => prisma.aiConversation.findUnique({ where: { id } });

const findConversations = (where, { skip, take }) =>
    Promise.all([
        prisma.aiConversation.findMany({
            where,
            skip,
            take,
            orderBy: { startTime: "desc" },
            include: {
                _count: { select: { messages: true } },
                messages: { where: { senderType: "STUDENT" }, orderBy: { sentAt: "asc" }, take: 1, select: { content: true } },
            },
        }),
        prisma.aiConversation.count({ where }),
    ]);

const findMessages = (conversationId) =>
    prisma.aiMessage.findMany({ where: { conversationId }, orderBy: { sentAt: "asc" }, include: messageInclude });

// Vài tin nhắn gần nhất (cũ đến mới) làm ngữ cảnh cho AI
const findRecentMessages = async (conversationId, take) => {
    const rows = await prisma.aiMessage.findMany({
        where: { conversationId },
        orderBy: { sentAt: "desc" },
        take,
        select: { senderType: true, content: true },
    });
    return rows.reverse();
};

const countRecentStudentMessages = (studentId, since, tx) =>
    db(tx).aiMessage.count({
        where: { senderType: "STUDENT", sentAt: { gte: since }, conversation: { studentId } },
    });

const createStudentMessage = (conversationId, content, tx) =>
    db(tx).aiMessage.create({ data: { senderType: "STUDENT", content, conversationId }, include: messageInclude });

// Tin nhắn AI và các khóa gợi ý được lưu cùng lúc
const createAiMessage = (conversationId, content, recommendations) =>
    prisma.aiMessage.create({
        data: {
            senderType: "AI",
            content,
            conversationId,
            recommendations: {
                create: recommendations.map((item) => ({ courseId: item.courseId, recommendationReason: item.reason })),
            },
        },
        include: messageInclude,
    });

module.exports = {
    findStudentIdByAccountId,
    createConversation,
    withStudentLock,
    findConversationById,
    findConversations,
    findMessages,
    findRecentMessages,
    countRecentStudentMessages,
    createStudentMessage,
    createAiMessage,
};