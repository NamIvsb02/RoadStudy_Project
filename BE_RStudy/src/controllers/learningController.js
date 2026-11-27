const asyncHandler = require("../utils/asyncHandler");
const { formatResponse } = require("../utils/response");
const service = require("../services/learningService");

exports.get = asyncHandler(async (req, res) => {
  res.json(formatResponse(true, await service.getLearning(req.user, req.params.courseId), "Lấy thông tin lớp học thành công"));
});

exports.update = asyncHandler(async (req, res) => {
  res.json(formatResponse(true, await service.updateLearning(req.user, req.params.courseId, req.body), "Cập nhật lớp học thành công"));
});

exports.createSession = asyncHandler(async (req, res) => {
  res.status(201).json(formatResponse(true, await service.createSession(req.user, req.params.courseId, req.body), "Thêm buổi học thành công"));
});

exports.updateSession = asyncHandler(async (req, res) => {
  res.json(formatResponse(true, await service.updateSession(req.user, req.params.id, req.body), "Cập nhật buổi học thành công"));
});

exports.removeSession = asyncHandler(async (req, res) => {
  await service.removeSession(req.user, req.params.id);
  res.json(formatResponse(true, null, "Xóa buổi học thành công"));
});
