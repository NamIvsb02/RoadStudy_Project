const asyncHandler = require("../utils/asyncHandler");
const { formatResponse } = require("../utils/response");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const service = require("../services/couponService");

exports.list = asyncHandler(async (req, res) => {
    const { page, limit, skip, take } = getPagination(req.query);
    const { items, total } = await service.list(req.query, { skip, take });
    res.json(
        formatResponse(
            true,
            { items, pagination: buildPaginationMeta(total, page, limit) },
            "Lấy danh sách mã giảm giá thành công"
        )
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const coupon = await service.getById(req.params.id);
    res.json(formatResponse(true, coupon, "Lấy mã giảm giá thành công"));
});

exports.create = asyncHandler(async (req, res) => {
    const coupon = await service.create(req.body);
    res.status(201).json(formatResponse(true, coupon, "Tạo mã giảm giá thành công"));
});

exports.update = asyncHandler(async (req, res) => {
    const coupon = await service.update(req.params.id, req.body);
    res.json(formatResponse(true, coupon, "Cập nhật mã giảm giá thành công"));
});

exports.changeStatus = asyncHandler(async (req, res) => {
    const coupon = await service.changeStatus(req.params.id, req.body.status);
    res.json(formatResponse(true, coupon, "Cập nhật trạng thái mã giảm giá thành công"));
});

exports.remove = asyncHandler(async (req, res) => {
    await service.remove(req.params.id);
    res.json(formatResponse(true, null, "Xóa mã giảm giá thành công"));
});

exports.validate = asyncHandler(async (req, res) => {
    const result = await service.validateCoupon(req.body, req.user.id);
    res.json(formatResponse(true, result, "Mã giảm giá hợp lệ"));
});
