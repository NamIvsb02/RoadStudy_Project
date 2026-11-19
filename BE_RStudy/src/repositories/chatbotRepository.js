const prisma = require("../config/database");
const { courseSelect } = require("./recommendationRepository");

const messageInclude = {
    recommendations: { include: { course: { select: courseSelect } } },
};

const findStudentIdByAccountId = async (accountId) => {
    const student = await prisma.student.findUnique({ where: { accountId }, select: { id: true } });
    return student ? student.id : null;
};

const createConversation = (studentId) => prisma.aiConversation.create({ data: { studentId } });

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

const countRecentStudentMessages = (studentId, since) =>
    prisma.aiMessage.count({
        where: { senderType: "STUDENT", sentAt: { gte: since }, conversation: { studentId } },
    });

const createStudentMessage = (conversationId, content) =>
    prisma.aiMessage.create({ data: { senderType: "STUDENT", content, conversationId }, include: messageInclude });

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
    findConversationById,
    findConversations,
    findMessages,
    findRecentMessages,
    countRecentStudentMessages,
    createStudentMessage,
    createAiMessage,
};