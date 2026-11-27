const AppError = require("../utils/AppError");
const repo = require("../repositories/learningRepository");
const { assertCanManageCourse } = require("./examService");
const notificationService = require("./notificationService");

const formatTime = (date) => new Date(date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour12: false, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const assertTimes = (start, end) => {
  if (new Date(end).getTime() <= new Date(start).getTime()) throw new AppError("Giờ kết thúc phải sau giờ bắt đầu", 400);
};

// Học viên phải đã thanh toán (bị hoàn tiền thì mất quyền vào lớp); giáo viên phụ trách và admin xem được
async function assertCanView(user, courseId) {
  if (user.role === "STUDENT") {
    const studentId = await repo.findStudentIdByAccountId(user.id);
    if (!studentId || !(await repo.hasPaidRegistration(studentId, courseId))) {
      throw new AppError("Bạn cần thanh toán khóa học này để vào lớp học", 403);
    }
    return;
  }
  await assertCanManageCourse(user, courseId);
}

async function getLearning(user, courseId) {
  const course = await repo.findCourse(courseId);
  if (!course) throw new AppError("Khóa học không tồn tại", 404);
  await assertCanView(user, courseId);
  const [learning, sessions] = await Promise.all([repo.findLearning(courseId), repo.findSessions(courseId)]);
  return { course, driveUrl: learning?.driveUrl ?? null, classUrl: learning?.classUrl ?? null, showExams: learning?.showExams ?? true, sessions };
}

async function updateLearning(user, courseId, data) {
  await assertCanManageCourse(user, courseId);
  await repo.upsertLearning(courseId, data);
  return getLearning(user, courseId);
}

async function createSession(user, courseId, data) {
  await assertCanManageCourse(user, courseId);
  assertTimes(data.startTime, data.endTime);
  const session = await repo.createSession(courseId, data);
  await notificationService.notifyCourseStudents(courseId, {
    type: "SESSION_CREATED",
    title: "Có lịch học mới",
    body: `${session.title} · ${formatTime(session.startTime)}`,
    link: `/learn/${courseId}`,
  });
  return session;
}

async function loadSession(user, id) {
  const session = await repo.findSession(id);
  if (!session) throw new AppError("Buổi học không tồn tại", 404);
  await assertCanManageCourse(user, session.courseId);
  return session;
}

async function updateSession(user, id, data) {
  const session = await loadSession(user, id);
  assertTimes(data.startTime ?? session.startTime, data.endTime ?? session.endTime);
  const updated = await repo.updateSession(id, data);
  await notificationService.notifyCourseStudents(session.courseId, {
    type: "SESSION_UPDATED",
    title: "Lịch học đã thay đổi",
    body: `${updated.title} · ${formatTime(updated.startTime)}`,
    link: `/learn/${session.courseId}`,
  });
  return updated;
}

async function removeSession(user, id) {
  await loadSession(user, id);
  await repo.deleteSession(id);
}

module.exports = { getLearning, updateLearning, createSession, updateSession, removeSession };
