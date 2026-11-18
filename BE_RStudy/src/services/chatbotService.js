const AppError = require("../utils/AppError");
const repo = require("../repositories/chatbotRepository");
const recommendationService = require("./recommendationService");

const HISTORY_LIMIT = 6;
const MAX_MESSAGES_PER_MINUTE = 6;
const AI_UNAVAILABLE_TEXT =
    "Xin lỗi, trợ lý AI hiện chưa phản hồi được. Bạn vui lòng dùng chức năng tìm kiếm và bộ lọc khóa học để tìm khóa phù hợp nhé.";

async function requireStudentId(accountId) {
    const studentId = await repo.findStudentIdByAccountId(accountId);
    if (!studentId) throw new AppError("Chỉ học viên mới sử dụng được chatbot", 403);
    return studentId;
}

async function loadOwnConversation(studentId, id) {
    const conversation = await repo.findConversationById(id);
    if (!conversation || conversation.studentId !== studentId) throw new AppError("Cuộc trò chuyện không tồn tại", 404);
    return conversation;
}

// Không gửi conversationId thì tạo cuộc trò chuyện mới
async function sendMessage(accountId, { conversationId, content }) {
    const studentId = await requireStudentId(accountId);

    const since = new Date(Date.now() - 60 * 1000);
    if ((await repo.countRecentStudentMessages(studentId, since)) >= MAX_MESSAGES_PER_MINUTE) {
        throw new AppError("Bạn gửi tin nhắn quá nhanh, vui lòng thử lại sau ít phút", 429);
    }

    const conversation = conversationId ? await loadOwnConversation(studentId, conversationId) : await repo.createConversation(studentId);
    const history = conversationId ? await repo.findRecentMessages(conversation.id, HISTORY_LIMIT) : [];
    const userMessage = await repo.createStudentMessage(conversation.id, content);

    let reply;
    let degraded = false;
    try {
        reply = await recommendationService.recommend({ content, history });
    } catch (err) {
        console.error("Chatbot AI lỗi:", err.message);
        reply = { text: AI_UNAVAILABLE_TEXT, items: [] };
        degraded = true;
    }

    const aiMessage = await repo.createAiMessage(
        conversation.id,
        reply.text,
        reply.items.map((item) => ({ courseId: item.course.id, reason: item.reason }))
    );
    return { conversation, userMessage, aiMessage, degraded };
}

async function listConversations(accountId, { skip, take }) {
    const studentId = await requireStudentId(accountId);
    const [rows, total] = await repo.findConversations({ studentId }, { skip, take });
    const items = rows.map(({ _count, messages, ...conversation }) => ({
        ...conversation,
        messageCount: _count.messages,
        firstMessage: messages[0]?.content ?? null,
    }));
    return { items, total };
}

async function getConversation(accountId, id) {
    const studentId = await requireStudentId(accountId);
    const conversation = await loadOwnConversation(studentId, id);
    const messages = await repo.findMessages(id);
    return { ...conversation, messages };
}

module.exports = { sendMessage, listConversations, getConversation };