const asyncHandler = require("../utils/asyncHandler");
const { formatResponse } = require("../utils/response");
const service = require("../services/recommendationService");

exports.getMine = asyncHandler(async (req, res) => {
  res.json(formatResponse(true, await service.recommendForStudent(req.user.id), "Lấy gợi ý khóa học thành công"));
});
