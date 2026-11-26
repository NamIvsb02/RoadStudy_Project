const AppError = require("../utils/AppError");
const repo = require("../repositories/chatbotRepository");
const recommendationService = require("./recommendationService");

const HISTORY_LIMIT = 6;
const MAX_MESSAGES_PER_MINUTE = 6;
const MAX_MESSAGES_PER_DAY = 50;
const TOO_FAST_TEXT = "Bạn gửi tin nhắn quá nhanh, vui lòng thử lại sau ít phút";
const inFlight = new Set();
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

// Không gửi conversationId thì tạo cuộc trò chuyện mới.
// Mỗi học viên chỉ có một tin được xử lý (chờ AI) tại một thời điểm: tin thứ hai bị từ chối ngay, không chạm DB,
// nên gửi dồn không làm cạn pool kết nối. Chỉ đúng với một instance; khóa DB trong withStudentLock là lớp dự phòng.
async function sendMessage(accountId, payload) {
    const studentId = await requireStudentId(accountId);
    if (inFlight.has(studentId)) throw new AppError(TOO_FAST_TEXT, 429);
    inFlight.add(studentId);
    try {
        return await processMessage(studentId, payload);
    } finally {
        inFlight.delete(studentId);
    }
}

async function processMessage(studentId, { conversationId, content }) {
    const existing = conversationId ? await loadOwnConversation(studentId, conversationId) : null;
    const history = existing ? await repo.findRecentMessages(existing.id, HISTORY_LIMIT) : [];

    // Kiểm tra hạn mức và lưu tin nhắn trong cùng một khóa: gửi dồn nhiều tin cùng lúc không lọt qua giới hạn
    const saved = await repo.withStudentLock(studentId, async (tx) => {
        const now = Date.now();
        if ((await repo.countRecentStudentMessages(studentId, new Date(now - 60 * 1000), tx)) >= MAX_MESSAGES_PER_MINUTE) {
            throw new AppError(TOO_FAST_TEXT, 429);
        }
        if ((await repo.countRecentStudentMessages(studentId, new Date(now - 24 * 60 * 60 * 1000), tx)) >= MAX_MESSAGES_PER_DAY) {
            throw new AppError(`Bạn đã dùng hết ${MAX_MESSAGES_PER_DAY} tin nhắn trong 24 giờ qua, vui lòng quay lại sau`, 429);
        }
        const target = existing ?? (await repo.createConversation(studentId, tx));
        return { conversation: target, userMessage: await repo.createStudentMessage(target.id, content, tx) };
    });
    if (!saved) throw new AppError(TOO_FAST_TEXT, 429);
    const { conversation, userMessage } = saved;

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