const { ContentStatus, CourseStatus, Role } = require('@prisma/client');
const AppError = require('../utils/AppError');
const commentRepository = require('../repositories/commentRepository');

const buildPagination = ({ page, limit }, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});

// Thêm cờ isMine để frontend biết hiện nút Sửa/Xóa
const withOwnership = (comment, userId) => ({
  ...comment,
  isMine: comment.commenter.id === userId,
  replies: comment.replies.map((r) => ({ ...r, isMine: r.replier.id === userId })),
});

const assertCourseOpen = (course) => {
  if (!course || course.status !== CourseStatus.DANG_MO) {
    throw new AppError('Khóa học không tồn tại', 404);
  }
};

const assertCanParticipate = async (user, course) => {
  if (user.role === Role.TEACHER) {
    if (course.teacher.accountId !== user.id) {
      throw new AppError('Bạn không phụ trách khóa học này', 403);
    }
    return;
  }
  if (user.role === Role.STUDENT) {
    const student = await commentRepository.findStudentByAccountId(user.id);
    const registration =
      student && (await commentRepository.findActiveRegistration(student.id, course.id));
    if (!registration) {
      throw new AppError('Bạn cần đăng ký khóa học này để bình luận', 403);
    }
    return;
  }
  throw new AppError('Vai trò của bạn không được phép bình luận', 403);
};

const getVisibleCommentOrThrow = async (id) => {
  const comment = await commentRepository.findCommentById(id);
  if (!comment || comment.status !== ContentStatus.HIEN_THI) {
    throw new AppError('Bình luận không tồn tại', 404);
  }
  return comment;
};

const getVisibleReplyOrThrow = async (id) => {
  const reply = await commentRepository.findReplyById(id);
  if (!reply || reply.status !== ContentStatus.HIEN_THI || reply.comment.status !== ContentStatus.HIEN_THI) {
    throw new AppError('Phản hồi không tồn tại', 404);
  }
  return reply;
};

// BÌNH LUẬN
const listByCourse = async (user, courseId, pg) => {
  const course = await commentRepository.findCourseForComment(courseId);
  assertCourseOpen(course);
  const { items, total } = await commentRepository.findCommentsAndCount({
    courseId,
    skip: pg.skip,
    take: pg.take,
  });
  return {
    items: items.map((c) => withOwnership(c, user.id)),
    pagination: buildPagination(pg, total),
  };
};

const createComment = async (user, courseId, content) => {
  const course = await commentRepository.findCourseForComment(courseId);
  assertCourseOpen(course);
  await assertCanParticipate(user, course);
  const created = await commentRepository.createComment({
    content,
    courseId,
    commenterAccountId: user.id,
  });
  return withOwnership(created, user.id);
};

const updateComment = async (user, id, content) => {
  const comment = await getVisibleCommentOrThrow(id);
  if (comment.commenterAccountId !== user.id) {
    throw new AppError('Bạn chỉ được sửa bình luận của chính mình', 403);
  }
  const updated = await commentRepository.updateComment(id, content);
  return withOwnership(updated, user.id);
};

const removeComment = async (user, id) => {
  const comment = await getVisibleCommentOrThrow(id);
  if (comment.commenterAccountId !== user.id) {
    throw new AppError('Bạn chỉ được xóa bình luận của chính mình', 403);
  }
  const changed = await commentRepository.hideComment(id);
  if (!changed) throw new AppError('Bình luận không tồn tại', 404);
};

//PHẢN HỒI
const createReply = async (user, commentId, content) => {
  const comment = await getVisibleCommentOrThrow(commentId);
  assertCourseOpen(comment.course);
  await assertCanParticipate(user, comment.course);
  const created = await commentRepository.createReply({
    content,
    commentId,
    replierAccountId: user.id,
  });
  return { ...created, isMine: true };
};

const updateReply = async (user, id, content) => {
  const reply = await getVisibleReplyOrThrow(id);
  if (reply.replierAccountId !== user.id) {
    throw new AppError('Bạn chỉ được sửa phản hồi của chính mình', 403);
  }
  const updated = await commentRepository.updateReply(id, content);
  return { ...updated, isMine: true };
};

const removeReply = async (user, id) => {
  const reply = await getVisibleReplyOrThrow(id);
  if (reply.replierAccountId !== user.id) {
    throw new AppError('Bạn chỉ được xóa phản hồi của chính mình', 403);
  }
  const changed = await commentRepository.hideReply(id);
  if (!changed) throw new AppError('Phản hồi không tồn tại', 404);
};

module.exports = {
  listByCourse,
  createComment,
  updateComment,
  removeComment,
  createReply,
  updateReply,
  removeReply,
};