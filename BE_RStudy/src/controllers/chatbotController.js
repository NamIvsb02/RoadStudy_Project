const asyncHandler = require("../utils/asyncHandler");
const { formatResponse } = require("../utils/response");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const service = require("../services/chatbotService");

exports.sendMessage = asyncHandler(async (req, res) => {
    const data = await service.sendMessage(req.user.id, req.body);
    res.status(201).json(formatResponse(true, data, "Gửi tin nhắn thành công"));
});

exports.listConversations = asyncHandler(async (req, res) => {
    const { page, limit, skip, take } = getPagination(req.query);
    const { items, total } = await service.listConversations(req.user.id, { skip, take });
    res.json(
        formatResponse(true, { items, pagination: buildPaginationMeta(total, page, limit) }, "Lấy danh sách cuộc trò chuyện thành công")
    );
});

exports.getConversation = asyncHandler(async (req, res) => {
    res.json(formatResponse(true, await service.getConversation(req.user.id, req.params.id), "Lấy cuộc trò chuyện thành công"));
});