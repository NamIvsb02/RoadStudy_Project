const courseService = require('../services/courseService');
const AppError = require('../utils/AppError');
const { getPagination } = require('../utils/pagination');
const { formatResponse } = require('../utils/response');
const { publicListQuerySchema } = require('../validators/courseValidator');

const pickCourseFields = (b) => ({
  courseName: b.courseName,
  description: b.description,
  price: b.price,
  coverImageUrl: b.coverImageUrl,
  startDate: b.startDate,
  endDate: b.endDate,
  categoryId: b.categoryId,
});


const parseListQuery = (query) => {
  const cleaned = Object.fromEntries(Object.entries(query).filter(([, v]) => v !== ''));
  const result = publicListQuerySchema.safeParse(cleaned);
  if (!result.success) {
    const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new AppError(message, 400);
  }
  return result.data;
};

//GIÁO VIÊN
exports.create = async (req, res) => {
  const data = await courseService.createByTeacher(req.user.id, pickCourseFields(req.body));
  res.status(201).json(formatResponse(true, data, 'Tạo khóa học thành công'));
};

exports.getMyList = async (req, res) => {
  const data = await courseService.getMyList(req.user.id, {
    ...getPagination(req.query),
    q: req.query.q,
    status: req.query.status,
  });
  res.json(formatResponse(true, data, 'Lấy danh sách khóa học của tôi thành công'));
};

exports.getMyById = async (req, res) => {
  const data = await courseService.getMyById(req.user.id, req.params.id);
  res.json(formatResponse(true, data, 'Lấy thông tin khóa học thành công'));
};

exports.update = async (req, res) => {
  const data = await courseService.updateByTeacher(
    req.user.id,
    req.params.id,
    pickCourseFields(req.body)
  );
  res.json(formatResponse(true, data, 'Cập nhật khóa học thành công'));
};

exports.submit = async (req, res) => {
  const data = await courseService.submitForApproval(req.user.id, req.params.id);
  res.json(formatResponse(true, data, 'Đã gửi khóa học chờ duyệt'));
};

//QUẢN TRỊ VIÊN
exports.getAdminList = async (req, res) => {
  const data = await courseService.getAdminList({
    ...getPagination(req.query),
    q: req.query.q,
    status: req.query.status,
    categoryId: req.query.categoryId,
    teacherId: req.query.teacherId,
  });
  res.json(formatResponse(true, data, 'Lấy danh sách khóa học thành công'));
};

exports.getAdminById = async (req, res) => {
  const data = await courseService.getAdminById(req.params.id);
  res.json(formatResponse(true, data, 'Lấy thông tin khóa học thành công'));
};

exports.approve = async (req, res) => {
  const data = await courseService.approve(req.params.id);
  res.json(formatResponse(true, data, 'Đã duyệt khóa học'));
};

exports.reject = async (req, res) => {
  const data = await courseService.reject(req.params.id);
  res.json(formatResponse(true, data, 'Đã từ chối khóa học, giáo viên có thể chỉnh sửa và gửi duyệt lại'));
};

exports.changeStatus = async (req, res) => {
  const data = await courseService.changeStatusByAdmin(req.params.id, req.body.status);
  res.json(formatResponse(true, data, 'Cập nhật trạng thái khóa học thành công'));
};

//CÔNG KHAI (khách xem, không cần đăng nhập)
exports.getPublicList = async (req, res) => {
  const filters = parseListQuery(req.query);
  const data = await courseService.getPublicList({ ...getPagination(req.query), ...filters });
  res.json(formatResponse(true, data, 'Lấy danh sách khóa học thành công'));
};

exports.getPublicById = async (req, res) => {
  const data = await courseService.getPublicById(req.params.id);
  res.json(formatResponse(true, data, 'Lấy thông tin khóa học thành công'));
};