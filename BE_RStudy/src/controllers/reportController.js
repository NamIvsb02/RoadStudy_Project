const reportService = require("../services/reportService");
const { getPagination } = require("../utils/pagination");
const { formatResponse } = require("../utils/response");

exports.create = async (req, res) => {
  const data = await reportService.create(req.user.id, req.body);
  res.status(201).json(formatResponse(true, data, "Gửi báo cáo vi phạm thành công"));
};

exports.getList = async (req, res) => {
  const data = await reportService.getList({ ...getPagination(req.query), status: req.query.status });
  res.json(formatResponse(true, data, "Lấy danh sách báo cáo thành công"));
};

exports.getById = async (req, res) => {
  const data = await reportService.getById(req.params.id);
  res.json(formatResponse(true, data, "Lấy chi tiết báo cáo thành công"));
};

exports.process = async (req, res) => {
  const data = await reportService.process(req.params.id, req.body);
  res.json(formatResponse(true, data, "Cập nhật xử lý báo cáo thành công"));
};

exports.reject = async (req, res) => {
  const data = await reportService.reject(req.params.id, req.body);
  res.json(formatResponse(true, data, "Từ chối báo cáo thành công"));
};
