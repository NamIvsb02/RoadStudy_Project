const categoryService = require('../services/categoryService');
const { getPagination } = require('../utils/pagination');
const { formatResponse } = require('../utils/response');


//PUBLIC
exports.getPublicList = async (req, res) => {
  const data = await categoryService.getPublicList({ ...getPagination(req.query), q: req.query.q });
  res.json(formatResponse(true, data, 'Lấy danh sách danh mục thành công'));
};

exports.getPublicById = async (req, res) => {
  const data = await categoryService.getPublicById(req.params.id);
  res.json(formatResponse(true, data, 'Lấy thông tin danh mục thành công'));
};

//ADMIN
exports.getAdminList = async (req, res) => {
  const data = await categoryService.getAdminList({
    ...getPagination(req.query),
    q: req.query.q,
    status: req.query.status,
  });
  res.json(formatResponse(true, data, 'Lấy danh sách danh mục thành công'));
};

exports.getAdminById = async (req, res) => {
  const data = await categoryService.getAdminById(req.params.id);
  res.json(formatResponse(true, data, 'Lấy thông tin danh mục thành công'));
};

exports.create = async (req, res) => {
  const { categoryName, description, status } = req.body;
  const data = await categoryService.create({ categoryName, description, status });
  res.status(201).json(formatResponse(true, data, 'Tạo danh mục thành công'));
};

exports.update = async (req, res) => {
  const { categoryName, description, status } = req.body;
  const data = await categoryService.update(req.params.id, { categoryName, description, status });
  res.json(formatResponse(true, data, 'Cập nhật danh mục thành công'));
};

exports.changeStatus = async (req, res) => {
  const data = await categoryService.changeStatus(req.params.id, req.body.status);
  res.json(formatResponse(true, data, 'Cập nhật trạng thái danh mục thành công'));
};

exports.remove = async (req, res) => {
  await categoryService.remove(req.params.id);
  res.json(formatResponse(true, null, 'Xóa danh mục thành công'));
};