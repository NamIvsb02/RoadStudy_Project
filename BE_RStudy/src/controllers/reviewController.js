const reviewService = require('../services/reviewService');
const AppError = require('../utils/AppError');
const { getPagination } = require('../utils/pagination');
const { formatResponse } = require('../utils/response');
const { listQuerySchema } = require('../validators/reviewValidator');



const currentUser = (req) => ({ id: req.user.id, role: req.user.role });


const parseListQuery = (query) => {
  const cleaned = Object.fromEntries(Object.entries(query).filter(([, v]) => v !== ''));
  const result = listQuerySchema.safeParse(cleaned);
  if (!result.success) {
    const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new AppError(message, 400);
  }
  return result.data;
};


exports.listByCourse = async (req, res) => {
  const { rating } = parseListQuery(req.query);
  const data = await reviewService.listByCourse(req.params.courseId, {
    ...getPagination(req.query),
    rating,
  });
  res.json(formatResponse(true, data, 'Lấy danh sách đánh giá thành công'));
};

exports.getMine = async (req, res) => {
  const data = await reviewService.getMyReview(currentUser(req), req.params.courseId);
  res.json(formatResponse(true, data, 'Lấy đánh giá của bạn thành công'));
};

exports.create = async (req, res) => {
  const { rating, content } = req.body;
  const data = await reviewService.createReview(currentUser(req), req.params.courseId, { rating, content });
  res.status(201).json(formatResponse(true, data, 'Gửi đánh giá thành công'));
};

exports.update = async (req, res) => {
  const { rating, content } = req.body;
  const data = await reviewService.updateReview(currentUser(req), req.params.id, { rating, content });
  res.json(formatResponse(true, data, 'Cập nhật đánh giá thành công'));
};

exports.respond = async (req, res) => {
  const data = await reviewService.respond(currentUser(req), req.params.id, req.body.content);
  res.status(201).json(formatResponse(true, data, 'Gửi câu trả lời thành công'));
};

exports.updateResponse = async (req, res) => {
  const data = await reviewService.updateResponse(
    currentUser(req),
    req.params.responseId,
    req.body.content
  );
  res.json(formatResponse(true, data, 'Cập nhật câu trả lời thành công'));
};

exports.removeResponse = async (req, res) => {
  await reviewService.removeResponse(currentUser(req), req.params.responseId);
  res.json(formatResponse(true, null, 'Xóa câu trả lời thành công'));
};