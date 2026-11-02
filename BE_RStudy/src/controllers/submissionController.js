const asyncHandler = require("../utils/asyncHandler");
const { formatResponse } = require("../utils/response");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const service = require("../services/submissionService");

exports.start = asyncHandler(async (req, res) => {
    const data = await service.start(req.user.id, req.body.examId);
    res.json(formatResponse(true, data, "Bắt đầu làm bài thành công"));
});

exports.saveAnswers = asyncHandler(async (req, res) => {
    const data = await service.saveAnswers(req.user.id, req.params.id, req.body.answers);
    res.json(formatResponse(true, data, "Lưu đáp án thành công"));
});

exports.submit = asyncHandler(async (req, res) => {
    const data = await service.submit(req.user.id, req.params.id, req.body?.answers);
    res.json(formatResponse(true, data, "Nộp bài thành công"));
});

exports.myAttempts = asyncHandler(async (req, res) => {
    const { page, limit, skip, take } = getPagination(req.query);
    const { items, total } = await service.myAttempts(req.user.id, req.query, { skip, take });
    res.json(
        formatResponse(true, { items, pagination: buildPaginationMeta(total, page, limit) }, "Lấy lịch sử làm bài thành công")
    );
});

exports.getById = asyncHandler(async (req, res) => {
    res.json(formatResponse(true, await service.getById(req.user, req.params.id), "Lấy kết quả bài làm thành công"));
});

exports.listByExam = asyncHandler(async (req, res) => {
    const { page, limit, skip, take } = getPagination(req.query);
    const { items, total } = await service.listByExam(req.user, req.params.examId, req.query, { skip, take });
    res.json(
        formatResponse(true, { items, pagination: buildPaginationMeta(total, page, limit) }, "Lấy danh sách bài làm thành công")
    );
});