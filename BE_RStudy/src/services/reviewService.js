const { ContentStatus, CourseStatus, CategoryStatus, ReviewStatus } = require('@prisma/client');
const AppError = require('../utils/AppError');
const reviewRepository = require('../repositories/reviewRepository');

const buildPagination = ({ page, limit }, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});

const round1 = (n) => (n === null || n === undefined ? null : Math.round(n * 10) / 10);

const getCourseOrThrow = async (courseId) => {
  const course = await reviewRepository.findCourseForReview(courseId);
  if (!course) throw new AppError('Khóa học không tồn tại', 404);
  return course;
};


const getPublicCourseOrThrow = async (courseId) => {
  const course = await getCourseOrThrow(courseId);
  if (course.status !== CourseStatus.DANG_MO || course.category.status !== CategoryStatus.HOAT_DONG) {
    throw new AppError('Khóa học không tồn tại', 404);
  }
  return course;
};

const getVisibleReviewOrThrow = async (id) => {
  const review = await reviewRepository.findReviewById(id);
  if (!review || review.status !== ReviewStatus.HIEN_THI) {
    throw new AppError('Đánh giá không tồn tại', 404);
  }
  return review;
};

const getVisibleResponseOrThrow = async (id) => {
  const response = await reviewRepository.findResponseById(id);
  if (!response || response.status !== ContentStatus.HIEN_THI || response.review.status !== ReviewStatus.HIEN_THI) {
    throw new AppError('Câu trả lời không tồn tại', 404);
  }
  return response;
};


const listByCourse = async (courseId, { rating, ...pg }) => {
  await getPublicCourseOrThrow(courseId);
  const [{ items, total }, summary] = await Promise.all([
    reviewRepository.findReviewsAndCount({ courseId, rating, skip: pg.skip, take: pg.take }),
    reviewRepository.getRatingSummary(courseId),
  ]);
  return {
    summary: { averageRating: round1(summary.averageRating), reviewCount: summary.reviewCount },
    items,
    pagination: buildPagination(pg, total),
  };
};


const getMyReview = async (user, courseId) => {
  await getCourseOrThrow(courseId);
  const student = await reviewRepository.findStudentByAccountId(user.id);
  if (!student) return null;
  const review = await reviewRepository.findOwnReview(student.id, courseId);
  return review ? { ...review, isMine: true } : null;
};

const createReview = async (user, courseId, { rating, content }) => {
  await getCourseOrThrow(courseId);

  const student = await reviewRepository.findStudentByAccountId(user.id);
  const registration = student && (await reviewRepository.findActiveRegistration(student.id, courseId));
  if (!registration) {
    throw new AppError('Chỉ học viên đã được xác nhận đăng ký khóa học này mới được đánh giá', 403);
  }

  const existing = await reviewRepository.findAnyReviewByStudentAndCourse(student.id, courseId);
  if (existing) {
    throw new AppError('Bạn đã đánh giá khóa học này, hãy sửa đánh giá hiện có', 409);
  }


  const created = await reviewRepository.createReview({
    rating,
    content: content ?? null,
    status: ReviewStatus.HIEN_THI,
    studentId: student.id,
    courseId,
  });
  return { ...created, isMine: true };
};

const updateReview = async (user, id, { rating, content }) => {
  const review = await getVisibleReviewOrThrow(id);
  if (review.student.accountId !== user.id) {
    throw new AppError('Bạn chỉ được sửa đánh giá của chính mình', 403);
  }
  const updated = await reviewRepository.updateReview(id, { rating, content });
  return { ...updated, isMine: true };
};

// ---------- CÂU TRẢ LỜI ĐÁNH GIÁ (giáo viên phụ trách) ----------
const respond = async (user, reviewId, content) => {
  const review = await getVisibleReviewOrThrow(reviewId);
  if (review.course.teacher.accountId !== user.id) {
    throw new AppError('Bạn không phụ trách khóa học này', 403);
  }
  const existing = await reviewRepository.findVisibleResponseByReview(reviewId);
  if (existing) {
    throw new AppError('Đánh giá này đã có câu trả lời, hãy sửa câu trả lời hiện có', 409);
  }
  const created = await reviewRepository.createResponse({
    content,
    reviewId,
    accountId: user.id,
  });
  return { ...created, isMine: true };
};

const updateResponse = async (user, id, content) => {
  const response = await getVisibleResponseOrThrow(id);
  if (response.accountId !== user.id) {
    throw new AppError('Bạn chỉ được sửa câu trả lời của chính mình', 403);
  }
  const updated = await reviewRepository.updateResponse(id, content);
  return { ...updated, isMine: true };
};

const removeResponse = async (user, id) => {
  const response = await getVisibleResponseOrThrow(id);
  if (response.accountId !== user.id) {
    throw new AppError('Bạn chỉ được xóa câu trả lời của chính mình', 403);
  }
  const changed = await reviewRepository.hideResponse(id);
  if (!changed) throw new AppError('Câu trả lời không tồn tại', 404);
};

module.exports = {
  listByCourse,
  getMyReview,
  createReview,
  updateReview,
  respond,
  updateResponse,
  removeResponse,
};