const commentService = require('../services/commentService');
const { getPagination } = require('../utils/pagination');
const { formatResponse } = require('../utils/response');

const currentUser = (req) => ({ id: req.user.id, role: req.user.role });

//BÌNH LUẬN
exports.listByCourse = async (req, res) => {
  const data = await commentService.listByCourse(
    currentUser(req),
    req.params.courseId,
    getPagination(req.query)
  );
  res.json(formatResponse(true, data, 'Lấy danh sách bình luận thành công'));
};

exports.create = async (req, res) => {
  const data = await commentService.createComment(
    currentUser(req),
    req.params.courseId,
    req.body.content
  );
  res.status(201).json(formatResponse(true, data, 'Gửi bình luận thành công'));
};

exports.update = async (req, res) => {
  const data = await commentService.updateComment(currentUser(req), req.params.id, req.body.content);
  res.json(formatResponse(true, data, 'Cập nhật bình luận thành công'));
};

exports.remove = async (req, res) => {
  await commentService.removeComment(currentUser(req), req.params.id);
  res.json(formatResponse(true, null, 'Xóa bình luận thành công'));
};

//PHẢN HỒI
exports.reply = async (req, res) => {
  const data = await commentService.createReply(currentUser(req), req.params.id, req.body.content);
  res.status(201).json(formatResponse(true, data, 'Gửi phản hồi thành công'));
};

exports.updateReply = async (req, res) => {
  const data = await commentService.updateReply(
    currentUser(req),
    req.params.replyId,
    req.body.content
  );
  res.json(formatResponse(true, data, 'Cập nhật phản hồi thành công'));
};

exports.removeReply = async (req, res) => {
  await commentService.removeReply(currentUser(req), req.params.replyId);
  res.json(formatResponse(true, null, 'Xóa phản hồi thành công'));
};