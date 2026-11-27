const repo = require("../repositories/notificationRepository");
const AppError = require("../utils/AppError");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const safely = async (work) => {
  try {
    await work();
  } catch (err) {
    console.error("Tạo thông báo thất bại:", err.message);
  }
};

const toRow = (accountId, payload) => ({ accountId, type: payload.type, title: payload.title, body: payload.body ? String(payload.body).slice(0, 500) : null, link: payload.link ?? null });

const notify = (accountId, payload) =>
  safely(async () => {
    if (accountId) await repo.create(toRow(accountId, payload));
  });

const notifyMany = (accountIds, payload) =>
  safely(async () => {
    const ids = [...new Set(accountIds)].filter(Boolean);
    if (ids.length) await repo.createMany(ids.map((id) => toRow(id, payload)));
  });

const notifyStudent = (studentId, payload) => safely(async () => notify(await repo.findAccountIdByStudentId(studentId), payload));
const notifyTeacher = (teacherId, payload) => safely(async () => notify(await repo.findAccountIdByTeacherId(teacherId), payload));
const notifyCourseTeacher = (courseId, payload) => safely(async () => notify(await repo.findCourseTeacherAccountId(courseId), payload));
const notifyCourseStudents = (courseId, payload) => safely(async () => notifyMany(await repo.findCourseStudentAccountIds(courseId), payload));
const notifyAdmins = (functionName, payload) => safely(async () => notifyMany(await repo.findAdminAccountIds(functionName), payload));

const list = async (accountId, query) => {
  const { page, limit, skip, take } = getPagination(query);
  const [items, total] = await repo.findAndCount(accountId, { skip, take });
  return { items, pagination: buildPaginationMeta(total, page, limit), unreadCount: await repo.countUnread(accountId) };
};

const unreadCount = async (accountId) => ({ unreadCount: await repo.countUnread(accountId) });

const markRead = async (accountId, id) => {
  const result = await repo.markRead(id, accountId);
  if (result.count === 0) throw new AppError("Thông báo không tồn tại", 404);
  return unreadCount(accountId);
};

const markAllRead = async (accountId) => {
  await repo.markAllRead(accountId);
  return { unreadCount: 0 };
};

module.exports = { notify, notifyMany, notifyStudent, notifyTeacher, notifyCourseTeacher, notifyCourseStudents, notifyAdmins, list, unreadCount, markRead, markAllRead };
