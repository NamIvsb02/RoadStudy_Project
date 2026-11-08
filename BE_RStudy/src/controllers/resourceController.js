const resourceService = require("../services/resourceService");
const AppError = require("../utils/AppError");
const { getPagination } = require("../utils/pagination");
const { formatResponse } = require("../utils/response");

exports.getList = async (req, res) => {
  const data = await resourceService.getList({
    ...getPagination(req.query),
    q: req.query.q,
    categoryId: req.query.categoryId,
  });
  res.json(formatResponse(true, data, "Lấy danh sách tài liệu thành công"));
};

exports.getById = async (req, res) => {
  const data = await resourceService.getById(req.params.id);
  res.json(formatResponse(true, data, "Lấy thông tin tài liệu thành công"));
};

exports.create = async (req, res) => {
  if (!req.file) throw new AppError('Vui lòng chọn tệp PDF hoặc DOCX (field "file")', 400);
  try {
    const data = await resourceService.create(req.user.id, req.body, req.file);
    res.status(201).json(formatResponse(true, data, "Tải tài liệu lên thành công"));
  } catch (err) {
    await resourceService.removeFile(req.file.filename); // lỗi thì xóa file vừa lưu
    throw err;
  }
};

exports.remove = async (req, res) => {
  await resourceService.remove(req.params.id, req.user);
  res.json(formatResponse(true, null, "Xóa tài liệu thành công"));
};
