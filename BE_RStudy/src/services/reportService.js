const { ReportStatus } = require("@prisma/client");
const AppError = require("../utils/AppError");
const reportRepository = require("../repositories/reportRepository");
const { PERMISSIONS } = require("../constants/permissions");
const notificationService = require("./notificationService");

const FINAL = [ReportStatus.DA_XU_LY, ReportStatus.TU_CHOI];

const getExistingOrThrow = async (id) => {
  const report = await reportRepository.findById(id);
  if (!report) throw new AppError("Báo cáo không tồn tại", 404);
  return report;
};

const FINAL_MESSAGE = "Báo cáo đã được xử lý xong, không thể thay đổi";

const assertNotFinal = (report) => {
  if (FINAL.includes(report.status)) throw new AppError(FINAL_MESSAGE, 409);
};

// Trạng thái bị người khác đổi giữa lúc kiểm tra và lúc ghi
const conflict = () => new AppError("Báo cáo vừa được người khác xử lý, vui lòng tải lại", 409);

// NGƯỜI DÙNG
const create = async (accountId, { reason, content, reviewId, commentId, replyId }) => {
  const target = { reviewId, commentId, replyId };
  const found = await reportRepository.findTarget(target);
  if (!found) throw new AppError("Nội dung bị báo cáo không tồn tại", 404);
  if (found.ownerAccountId === accountId) throw new AppError("Không thể báo cáo nội dung của chính mình", 400);

  const duplicated = await reportRepository.findOpenDuplicate(accountId, target);
  if (duplicated) throw new AppError("Bạn đã báo cáo nội dung này và đang chờ xử lý", 409);

  const report = await reportRepository.create({
    reason,
    content,
    reporterAccountId: accountId,
    reportedAccountId: found.ownerAccountId,
    ...target,
  });
  await notificationService.notifyAdmins(PERMISSIONS.XU_LY_BAO_CAO_VI_PHAM, { type: "REPORT_PENDING", title: "Có báo cáo vi phạm mới", body: reason, link: "/admin/reports" });
  return report;
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
    const started = await reportRepository.transition(id, [ReportStatus.CHO_XU_LY], { status });
    if (!started) throw conflict();
    return started;
  }
  const resolved = await reportRepository.resolveViolation(report, { status, resolutionResult });
  if (!resolved) throw conflict();
  await notificationService.notify(report.reporterAccountId, {
    type: "REPORT_RESOLVED",
    title: "Báo cáo vi phạm của bạn đã được xử lý",
    body: resolutionResult,
  });
  return resolved;
};

const reject = async (id, { resolutionResult }) => {
  const report = await getExistingOrThrow(id);
  assertNotFinal(report);
  const rejected = await reportRepository.transition(id, [ReportStatus.CHO_XU_LY, ReportStatus.DANG_XU_LY], { status: ReportStatus.TU_CHOI, resolutionResult });
  if (!rejected) throw conflict();
  await notificationService.notify(report.reporterAccountId, {
    type: "REPORT_REJECTED",
    title: "Báo cáo vi phạm của bạn không được chấp nhận",
    body: resolutionResult,
  });
  return rejected;
};

module.exports = { create, getList, getById, process, reject };
