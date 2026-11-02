const asyncHandler = require("../utils/asyncHandler");
const { formatResponse } = require("../utils/response");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const service = require("../services/examService");

exports.listByCourse = asyncHandler(async (req, res) => {
    const { page, limit, skip, take } = getPagination(req.query);
    const { items, total } = await service.listByCourse(req.user, req.params.courseId, req.query, { skip, take });
    res.json(
        formatResponse(true, { items, pagination: buildPaginationMeta(total, page, limit) }, "Lấy danh sách đề thi thành công")
    );
});

exports.getById = asyncHandler(async (req, res) => {
    res.json(formatResponse(true, await service.getById(req.user, req.params.id), "Lấy đề thi thành công"));
});

exports.create = asyncHandler(async (req, res) => {
    res.status(201).json(formatResponse(true, await service.create(req.user, req.body), "Tạo đề thi thành công"));
});

exports.update = asyncHandler(async (req, res) => {
    res.json(formatResponse(true, await service.update(req.user, req.params.id, req.body), "Cập nhật đề thi thành công"));
});

exports.changeStatus = asyncHandler(async (req, res) => {
    const exam = await service.changeStatus(req.user, req.params.id, req.body.status);
    res.json(formatResponse(true, exam, "Cập nhật trạng thái đề thi thành công"));
});

exports.remove = asyncHandler(async (req, res) => {
    await service.remove(req.user, req.params.id);
    res.json(formatResponse(true, null, "Xóa đề thi thành công"));
});

exports.addQuestion = asyncHandler(async (req, res) => {
    const question = await service.addQuestion(req.user, req.params.id, req.body);
    res.status(201).json(formatResponse(true, question, "Thêm câu hỏi thành công"));
});

exports.updateQuestion = asyncHandler(async (req, res) => {
    const question = await service.updateQuestion(req.user, req.params.questionId, req.body);
    res.json(formatResponse(true, question, "Cập nhật câu hỏi thành công"));
});

exports.removeQuestion = asyncHandler(async (req, res) => {
    await service.removeQuestion(req.user, req.params.questionId);
    res.json(formatResponse(true, null, "Xóa câu hỏi thành công"));
});