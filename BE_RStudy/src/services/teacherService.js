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

module.exports = { listPublic, getPublic, listForAdmin, setApproval };
