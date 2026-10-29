const prisma = require('../config/database');
const { ContentStatus, RegistrationStatus } = require('@prisma/client');


const COUNTED_REGISTRATION = [RegistrationStatus.DA_THANH_TOAN, RegistrationStatus.HOAN_THANH];


const authorSelect = { id: true, fullName: true, avatarUrl: true, role: true };

const replySelect = {
  id: true,
  content: true,
  repliedAt: true,
  commentId: true,
  replier: { select: authorSelect },
};

const commentSelect = {
  id: true,
  content: true,
  commentedAt: true,
  courseId: true,
  commenter: { select: authorSelect },
  
  replies: {
    where: { status: ContentStatus.HIEN_THI },
    orderBy: { repliedAt: 'asc' },
    select: replySelect,
  },
};

const courseGuardSelect = {
  id: true,
  status: true,
  teacher: { select: { accountId: true } },
};

// ---------- khóa học và quyền ----------
const findCourseForComment = (courseId) =>
  prisma.course.findUnique({ where: { id: courseId }, select: courseGuardSelect });

const findStudentByAccountId = (accountId) =>
  prisma.student.findUnique({ where: { accountId }, select: { id: true } });

const findActiveRegistration = (studentId, courseId) =>
  prisma.courseRegistration.findFirst({
    where: { studentId, courseId, status: { in: COUNTED_REGISTRATION } },
    select: { id: true },
  });


const findCommentsAndCount = async ({ courseId, skip, take }) => {
  const where = { courseId, status: ContentStatus.HIEN_THI };
  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take,
      orderBy: [{ commentedAt: 'desc' }, { id: 'asc' }],
      select: commentSelect,
    }),
    prisma.comment.count({ where }),
  ]);
  return { items, total };
};

const findCommentById = (id) =>
  prisma.comment.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      commenterAccountId: true,
      course: { select: courseGuardSelect },
    },
  });

const createComment = (data) => prisma.comment.create({ data, select: commentSelect });

const updateComment = (id, content) =>
  prisma.comment.update({ where: { id }, data: { content }, select: commentSelect });


const hideComment = async (id) => {
  const result = await prisma.comment.updateMany({
    where: { id, status: ContentStatus.HIEN_THI },
    data: { status: ContentStatus.AN },
  });
  return result.count;
};


const findReplyById = (id) =>
  prisma.reply.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      replierAccountId: true,
      comment: { select: { status: true } },
    },
  });

const createReply = (data) => prisma.reply.create({ data, select: replySelect });

const updateReply = (id, content) =>
  prisma.reply.update({ where: { id }, data: { content }, select: replySelect });

const hideReply = async (id) => {
  const result = await prisma.reply.updateMany({
    where: { id, status: ContentStatus.HIEN_THI },
    data: { status: ContentStatus.AN },
  });
  return result.count;
};

module.exports = {
  findCourseForComment,
  findStudentByAccountId,
  findActiveRegistration,
  findCommentsAndCount,
  findCommentById,
  createComment,
  updateComment,
  hideComment,
  findReplyById,
  createReply,
  updateReply,
  hideReply,
};