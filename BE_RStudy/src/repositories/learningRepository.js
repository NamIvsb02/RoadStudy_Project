const prisma = require("../config/database");

const findStudentIdByAccountId = async (accountId) => (await prisma.student.findUnique({ where: { accountId }, select: { id: true } }))?.id ?? null;

const hasPaidRegistration = async (studentId, courseId) => (await prisma.courseRegistration.count({ where: { studentId, courseId, status: "DA_THANH_TOAN" } })) > 0;

const findCourse = (id) =>
  prisma.course.findUnique({
    where: { id },
    select: { id: true, courseName: true, startDate: true, endDate: true, teacher: { select: { account: { select: { fullName: true } } } } },
  });

const findLearning = (courseId) => prisma.courseLearning.findUnique({ where: { courseId } });
const upsertLearning = (courseId, data) => prisma.courseLearning.upsert({ where: { courseId }, create: { courseId, ...data }, update: data });

const findSessions = (courseId) => prisma.courseSession.findMany({ where: { courseId }, orderBy: { startTime: "asc" } });
const findSession = (id) => prisma.courseSession.findUnique({ where: { id } });
const createSession = (courseId, data) => prisma.courseSession.create({ data: { courseId, ...data } });
const updateSession = (id, data) => prisma.courseSession.update({ where: { id }, data });
const deleteSession = (id) => prisma.courseSession.delete({ where: { id } });

module.exports = {
  findStudentIdByAccountId,
  hasPaidRegistration,
  findCourse,
  findLearning,
  upsertLearning,
  findSessions,
  findSession,
  createSession,
  updateSession,
  deleteSession,
};
