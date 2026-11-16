const prisma = require("../config/database");

const create = (data) => prisma.notification.create({ data });
const createMany = (rows) => prisma.notification.createMany({ data: rows });

const findAndCount = (accountId, { skip, take }) =>
  prisma.$transaction([prisma.notification.findMany({ where: { accountId }, orderBy: { createdAt: "desc" }, skip, take }), prisma.notification.count({ where: { accountId } })]);

const countUnread = (accountId) => prisma.notification.count({ where: { accountId, isRead: false } });
const markRead = (id, accountId) => prisma.notification.updateMany({ where: { id, accountId }, data: { isRead: true } });
const markAllRead = (accountId) => prisma.notification.updateMany({ where: { accountId, isRead: false }, data: { isRead: true } });

const findAccountIdByStudentId = async (studentId) => (await prisma.student.findUnique({ where: { id: studentId }, select: { accountId: true } }))?.accountId ?? null;
const findAccountIdByTeacherId = async (teacherId) => (await prisma.teacher.findUnique({ where: { id: teacherId }, select: { accountId: true } }))?.accountId ?? null;

const findCourseTeacherAccountId = async (courseId) => (await prisma.course.findUnique({ where: { id: courseId }, select: { teacher: { select: { accountId: true } } } }))?.teacher.accountId ?? null;

const findCourseStudentAccountIds = async (courseId) => {
  const rows = await prisma.courseRegistration.findMany({ where: { courseId, status: "DA_THANH_TOAN" }, select: { student: { select: { accountId: true } } } });
  return rows.map((row) => row.student.accountId);
};

const findAdminAccountIds = async (functionName) => {
  const admins = await prisma.administrator.findMany({
    where: {
      account: { status: "HOAT_DONG" },
      OR: [{ isLeader: true }, { permissions: { some: { function: { functionName, status: "HOAT_DONG" } } } }],
    },
    select: { accountId: true },
  });
  return admins.map((admin) => admin.accountId);
};

module.exports = {
  create,
  createMany,
  findAndCount,
  countUnread,
  markRead,
  markAllRead,
  findAccountIdByStudentId,
  findAccountIdByTeacherId,
  findCourseTeacherAccountId,
  findCourseStudentAccountIds,
  findAdminAccountIds,
};
