const teacherRepository = require("../repositories/teacherRepository");
const AppError = require("../utils/AppError");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const APPROVALS = ["CHO_DUYET", "DA_DUYET", "TU_CHOI"];
const cleanSearch = (q) => (typeof q === "string" ? q.trim() : "");

const listPublic = async (query) => {
  const { page, limit, skip, take } = getPagination(query);
  const [items, total] = await teacherRepository.listPublic({ search: cleanSearch(query.search), skip, take });
  return { items, pagination: buildPaginationMeta(total, page, limit) };
};

const getPublic = async (id) => {
  const teacher = await teacherRepository.findPublicById(id);
  if (!teacher) throw new AppError("Không tìm thấy giáo viên", 404);
  return teacher;
};

const listForAdmin = async (query) => {
  const { page, limit, skip, take } = getPagination(query);
  if (query.approvalStatus && !APPROVALS.includes(query.approvalStatus)) {
    throw new AppError("approvalStatus không hợp lệ", 400);
  }
  const [items, total] = await teacherRepository.listForAdmin({
    approvalStatus: query.approvalStatus,
    search: cleanSearch(query.search),
    skip,
    take,
  });
  return { items, pagination: buildPaginationMeta(total, page, limit) };
};

const setApproval = (id, approvalStatus) => teacherRepository.updateApproval(id, approvalStatus);

const RECENT_DAYS = 7;

const toRecentAttempt = (attempt) => {
  const scored = attempt.score !== null;
  return {
    id: attempt.id,
    studentName: attempt.student.account.fullName,
    examName: attempt.exam.examName,
    score: scored ? Number(attempt.score).toFixed(2) : null,
    passed: scored ? Number(attempt.score) >= Number(attempt.exam.passingScore) : null,
    status: attempt.status,
  };
};

const getMyStats = async (accountId) => {
  const teacher = await teacherRepository.findByAccountId(accountId);
  if (!teacher) throw new AppError("Không tìm thấy hồ sơ giáo viên", 404);

  const since = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000);
  const [openCourses, openExams, draftExams, attemptsLast7Days, attempts, courses] = await teacherRepository.getStats(teacher.id, since);

  return {
    openCourses,
    openExams,
    draftExams,
    attemptsLast7Days,
    recentAttempts: attempts.map(toRecentAttempt),
    courses: courses.map(({ _count, ...course }) => ({ ...course, examCount: _count.exams })),
  };
};

module.exports = { listPublic, getPublic, listForAdmin, setApproval, getMyStats };
