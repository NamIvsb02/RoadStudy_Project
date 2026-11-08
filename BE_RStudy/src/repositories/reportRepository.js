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

exports.update = (id, data) => prisma.violationReport.update({ where: { id }, data, include });

// Chốt DA_XU_LY: đánh dấu nội dung VI_PHAM và cập nhật báo cáo trong 1 transaction
exports.resolveViolation = (report, data) =>
  prisma.$transaction(async (tx) => {
    if (report.reviewId) await tx.review.update({ where: { id: report.reviewId }, data: { status: "VI_PHAM" } });
    if (report.commentId) await tx.comment.update({ where: { id: report.commentId }, data: { status: "VI_PHAM" } });
    if (report.replyId) await tx.reply.update({ where: { id: report.replyId }, data: { status: "VI_PHAM" } });
    return tx.violationReport.update({ where: { id: report.id }, data, include });
  });
