const asyncHandler = require("../utils/asyncHandler");
const { formatResponse } = require("../utils/response");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const service = require("../services/enrollmentService");

exports.create = asyncHandler(async (req, res) => {
    const { created, data } = await service.create(req.user.id, req.body);
    if (!created) {
        return res.status(200).json(formatResponse(true, data, "Bạn đã có đơn đăng ký đang chờ thanh toán"));
    }
    res.status(201).json(formatResponse(true, data, "Đăng ký khóa học thành công, vui lòng thanh toán"));
});

exports.listMine = asyncHandler(async (req, res) => {
    const { page, limit, skip, take } = getPagination(req.query);
    const { items, total } = await service.listMine(req.user.id, req.query, { skip, take });
    res.json(
        formatResponse(true, { items, pagination: buildPaginationMeta(total, page, limit) }, "Lấy danh sách đăng ký thành công")
    );
});

exports.getMine = asyncHandler(async (req, res) => {
    res.json(formatResponse(true, await service.getMine(req.user.id, req.params.id), "Lấy đơn đăng ký thành công"));
});

exports.cancel = asyncHandler(async (req, res) => {
    await service.cancel(req.user.id, req.params.id);
    res.json(formatResponse(true, null, "Hủy đăng ký thành công"));
});