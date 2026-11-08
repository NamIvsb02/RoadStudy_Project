const { ReportStatus } = require("@prisma/client");
const AppError = require("../utils/AppError");
const reportRepository = require("../repositories/reportRepository");

const FINAL = [ReportStatus.DA_XU_LY, ReportStatus.TU_CHOI];

const getExistingOrThrow = async (id) => {
  const report = await reportRepository.findById(id);
  if (!report) throw new AppError("Báo cáo không tồn tại", 404);
  return report;
};

const assertNotFinal = (report) => {
  if (FINAL.includes(report.status)) throw new AppError("Báo cáo đã được xử lý xong, không thể thay đổi", 409);
};

// NGƯỜI DÙNG
const create = async (accountId, { reason, content, reviewId, commentId, replyId }) => {
  const target = { reviewId, commentId, replyId };
  const found = await reportRepository.findTarget(target);
  if (!found) throw new AppError("Nội dung bị báo cáo không tồn tại", 404);
  if (found.ownerAccountId === accountId) throw new AppError("Không thể báo cáo nội dung của chính mình", 400);

  const duplicated = await reportRepository.findOpenDuplicate(accountId, target);
  if (duplicated) throw new AppError("Bạn đã báo cáo nội dung này và đang chờ xử lý", 409);

  return reportRepository.create({
    reason,
    content,
    reporterAccountId: accountId,
    reportedAccountId: found.ownerAccountId,
    ...target,
  });
};

// ADMIN
const getList = async ({ status, page, limit, skip, take }) => {
  if (status && !Object.values(ReportStatus).includes(status)) {
    throw new AppError("Trạng thái lọc không hợp lệ", 400);
  }
  const { items, total } = await reportRepository.findAndCount({ status, skip, take });
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

const getById = (id) => getExistingOrThrow(id);

const process = async (id, { status, resolutionResult }) => {
  const report = await getExistingOrThrow(id);
  assertNotFinal(report);

  if (status === ReportStatus.DANG_XU_LY) {
    if (report.status !== ReportStatus.CHO_XU_LY) throw new AppError("Báo cáo đã ở trạng thái đang xử lý", 409);
    return reportRepository.update(id, { status });
  }
  return reportRepository.resolveViolation(report, { status, resolutionResult });
};

const reject = async (id, { resolutionResult }) => {
  const report = await getExistingOrThrow(id);
  assertNotFinal(report);
  return reportRepository.update(id, { status: ReportStatus.TU_CHOI, resolutionResult });
};

module.exports = { create, getList, getById, process, reject };
