const asyncHandler = require("../utils/asyncHandler");
const { formatResponse } = require("../utils/response");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const service = require("../services/invoiceService");

const page = (req, items, total, message, res) => {
    const { page: p, limit } = getPagination(req.query);
    res.json(formatResponse(true, { items, pagination: buildPaginationMeta(total, p, limit) }, message));
};

// ----- Học viên -----
exports.listMine = asyncHandler(async (req, res) => {
    const { items, total } = await service.listMine(req.user.id, req.query, getPagination(req.query));
    page(req, items, total, "Lấy danh sách hóa đơn thành công", res);
});

exports.getById = asyncHandler(async (req, res) => {
    res.json(formatResponse(true, await service.getById(req.user, req.params.id), "Lấy hóa đơn thành công"));
});

exports.uploadProof = asyncHandler(async (req, res) => {
    const invoice = await service.uploadProof(req.user.id, req.params.id, req.file);
    res.json(formatResponse(true, invoice, "Gửi minh chứng thanh toán thành công, vui lòng chờ xác nhận"));
});

exports.getProof = asyncHandler(async (req, res) => {
    const file = await service.getProofFile(req.user, req.params.id);
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.sendFile(file);
});

exports.requestRefund = asyncHandler(async (req, res) => {
    const request = await service.requestRefund(req.user.id, req.params.id, req.body.description);
    res.status(201).json(formatResponse(true, request, "Đã gửi yêu cầu hoàn tiền"));
});

exports.listMyRefundRequests = asyncHandler(async (req, res) => {
    const { items, total } = await service.listMyRefundRequests(req.user.id, getPagination(req.query));
    page(req, items, total, "Lấy danh sách yêu cầu hoàn tiền thành công", res);
});

// ----- Admin: duyệt thanh toán -----
exports.listAll = asyncHandler(async (req, res) => {
    const { items, total } = await service.listAll(req.query, getPagination(req.query));
    page(req, items, total, "Lấy danh sách hóa đơn thành công", res);
});

exports.approve = asyncHandler(async (req, res) => {
    res.json(formatResponse(true, await service.approve(req.params.id), "Đã xác nhận thanh toán"));
});

exports.reject = asyncHandler(async (req, res) => {
    res.json(formatResponse(true, await service.reject(req.params.id, req.body.reason), "Đã từ chối thanh toán"));
});

// ----- Admin: yêu cầu hoàn tiền -----
exports.listRefundRequests = asyncHandler(async (req, res) => {
    const { items, total } = await service.listRefundRequests(req.query, getPagination(req.query));
    page(req, items, total, "Lấy danh sách yêu cầu hoàn tiền thành công", res);
});

exports.approveRefund = asyncHandler(async (req, res) => {
    const data = await service.approveRefund(req.params.id, req.body?.adminNote);
    res.json(formatResponse(true, data, "Đã chấp thuận yêu cầu hoàn tiền"));
});

exports.completeRefund = asyncHandler(async (req, res) => {
    const data = await service.completeRefund(req.params.id, req.body?.adminNote);
    res.json(formatResponse(true, data, "Đã ghi nhận hoàn tiền thành công"));
});

exports.rejectRefund = asyncHandler(async (req, res) => {
    const data = await service.rejectRefund(req.params.id, req.body.adminNote, req.body.cancelRegistration === true);
    res.json(formatResponse(true, data, "Đã từ chối yêu cầu hoàn tiền"));
});