const prisma = require("../config/database");

const include = {
  reporter: { select: { id: true, email: true } },
  reportedAccount: { select: { id: true, email: true } },
  review: { select: { id: true, rating: true, content: true, status: true } },
  comment: { select: { id: true, content: true, status: true } },
  reply: { select: { id: true, content: true, status: true } },
};

// Trả về { ownerAccountId } hoặc null nếu nội dung không tồn tại
exports.findTarget = async ({ reviewId, commentId, replyId }) => {
  if (reviewId) {
    const r = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { student: { select: { accountId: true } } },
    });
    return r && { ownerAccountId: r.student.accountId };
  }
  if (commentId) {
    const c = await prisma.comment.findUnique({ where: { id: commentId } });
    return c && { ownerAccountId: c.commenterAccountId };
  }
  const p = await prisma.reply.findUnique({ where: { id: replyId } });
  return p && { ownerAccountId: p.replierAccountId };
};

exports.findOpenDuplicate = (reporterAccountId, { reviewId, commentId, replyId }) =>
  prisma.violationReport.findFirst({
    where: {
      reporterAccountId,
      status: { in: ["CHO_XU_LY", "DANG_XU_LY"] },
      ...(reviewId ? { reviewId } : commentId ? { commentId } : { replyId }),
    },
  });

exports.create = (data) => prisma.violationReport.create({ data, include });

exports.findById = (id) => prisma.violationReport.findUnique({ where: { id }, include });

exports.findAndCount = async ({ status, skip, take }) => {
  const where = status ? { status } : {};
  const [items, total] = await Promise.all([prisma.violationReport.findMany({ where, include, skip, take, orderBy: { reportedAt: "desc" } }), prisma.violationReport.count({ where })]);
  return { items, total };
};

const OPEN_STATUSES = ["CHO_XU_LY", "DANG_XU_LY"];

// Đổi trạng thái có điều kiện (chỉ khi báo cáo còn ở một trong các trạng thái fromStatuses).
// Trả về báo cáo sau khi đổi, hoặc null nếu trạng thái đã bị người khác đổi trước (tránh ghi đè khi 2 admin xử lý cùng lúc)
exports.transition = async (id, fromStatuses, data) => {
  const { count } = await prisma.violationReport.updateMany({ where: { id, status: { in: fromStatuses } }, data });
  return count === 0 ? null : prisma.violationReport.findUnique({ where: { id }, include });
};

// Chốt DA_XU_LY: đổi trạng thái báo cáo (có điều kiện) và đánh dấu nội dung VI_PHAM trong 1 transaction.
// Trả về null nếu báo cáo không còn ở trạng thái mở; khi đó không đụng tới nội dung bị báo cáo.
exports.resolveViolation = (report, data) =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.violationReport.updateMany({ where: { id: report.id, status: { in: OPEN_STATUSES } }, data });
    if (count === 0) return null;
    if (report.reviewId) await tx.review.update({ where: { id: report.reviewId }, data: { status: "VI_PHAM" } });
    if (report.commentId) await tx.comment.update({ where: { id: report.commentId }, data: { status: "VI_PHAM" } });
    if (report.replyId) await tx.reply.update({ where: { id: report.replyId }, data: { status: "VI_PHAM" } });
    return tx.violationReport.findUnique({ where: { id: report.id }, include });
  });
