const prisma = require('../config/database');
const { ContentStatus, ReviewStatus, RegistrationStatus } = require('@prisma/client');


const COUNTED_REGISTRATION = [RegistrationStatus.DA_THANH_TOAN, RegistrationStatus.HOAN_THANH];


const reviewerSelect = { account: { select: { fullName: true, avatarUrl: true } } };
const responderSelect = { id: true, fullName: true, avatarUrl: true, role: true };

const responseSelect = {
  id: true,
  content: true,
  respondedAt: true,
  reviewId: true,
  account: { select: responderSelect },
};

const reviewSelect = {
  id: true,
  rating: true,
  content: true,
  reviewedAt: true,
  courseId: true,
  student: { select: reviewerSelect },

  responses: {
    where: { status: ContentStatus.HIEN_THI },
    orderBy: { respondedAt: 'asc' },
    select: responseSelect,
  },
};


const courseGuardSelect = {
  id: true,
  status: true,
  category: { select: { status: true } },
  teacher: { select: { accountId: true } },
};


const findCourseForReview = (courseId) =>
  prisma.course.findUnique({ where: { id: courseId }, select: courseGuardSelect });

const findStudentByAccountId = (accountId) =>
  prisma.student.findUnique({ where: { accountId }, select: { id: true } });

const findActiveRegistration = (studentId, courseId) =>
  prisma.courseRegistration.findFirst({
    where: { studentId, courseId, status: { in: COUNTED_REGISTRATION } },
    select: { id: true },
  });


const findReviewsAndCount = async ({ courseId, rating, skip, take }) => {
  const where = {
    courseId,
    status: ReviewStatus.HIEN_THI,
    ...(rating !== undefined && { rating }),
  };
  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take,
      orderBy: [{ reviewedAt: 'desc' }, { id: 'asc' }], 
      select: reviewSelect,
    }),
    prisma.review.count({ where }),
  ]);
  return { items, total };
};


const getRatingSummary = async (courseId) => {
  const result = await prisma.review.aggregate({
    where: { courseId, status: ReviewStatus.HIEN_THI },
    _avg: { rating: true },
    _count: { _all: true },
  });
  return { averageRating: result._avg.rating, reviewCount: result._count._all };
};

const findOwnReview = (studentId, courseId) =>
  prisma.review.findFirst({
    where: { studentId, courseId, status: ReviewStatus.HIEN_THI },
    select: reviewSelect,
  });


const findAnyReviewByStudentAndCourse = (studentId, courseId) =>
  prisma.review.findFirst({ where: { studentId, courseId }, select: { id: true } });

const findReviewById = (id) =>
  prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      student: { select: { accountId: true } },
      course: { select: courseGuardSelect },
    },
  });

const createReview = (data) => prisma.review.create({ data, select: reviewSelect });

const updateReview = (id, data) => prisma.review.update({ where: { id }, data, select: reviewSelect });


const findVisibleResponseByReview = (reviewId) =>
  prisma.reviewResponse.findFirst({
    where: { reviewId, status: ContentStatus.HIEN_THI },
    select: { id: true },
  });

const findResponseById = (id) =>
  prisma.reviewResponse.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      accountId: true,
      review: { select: { status: true } },
    },
  });

const createResponse = (data) => prisma.reviewResponse.create({ data, select: responseSelect });

const updateResponse = (id, content) =>
  prisma.reviewResponse.update({ where: { id }, data: { content }, select: responseSelect });


const hideResponse = async (id) => {
  const result = await prisma.reviewResponse.updateMany({
    where: { id, status: ContentStatus.HIEN_THI },
    data: { status: ContentStatus.AN },
  });
  return result.count;
};

module.exports = {
  findCourseForReview,
  findStudentByAccountId,
  findActiveRegistration,
  findReviewsAndCount,
  getRatingSummary,
  findOwnReview,
  findAnyReviewByStudentAndCourse,
  findReviewById,
  createReview,
  updateReview,
  findVisibleResponseByReview,
  findResponseById,
  createResponse,
  updateResponse,
  hideResponse,
};