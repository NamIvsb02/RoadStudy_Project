const { z } = require("zod");

const idParamSchema = z.object({ id: z.string().uuid("id không hợp lệ") });

const createReportSchema = z
  .object({
    reason: z.string().trim().min(1, "Lý do không được trống").max(500),
    content: z.string().trim().min(1, "Nội dung báo cáo không được trống").max(2000),
    reviewId: z.string().uuid().optional(),
    commentId: z.string().uuid().optional(),
    replyId: z.string().uuid().optional(),
  })
  .refine((d) => [d.reviewId, d.commentId, d.replyId].filter(Boolean).length === 1, {
    message: "Phải chỉ rõ đúng 1 nội dung bị báo cáo (reviewId, commentId hoặc replyId)",
  });

const processReportSchema = z
  .object({
    status: z.enum(["DANG_XU_LY", "DA_XU_LY"]),
    resolutionResult: z.string().trim().max(2000).optional(),
  })
  .refine((d) => d.status !== "DA_XU_LY" || !!d.resolutionResult, {
    message: "Cần nhập kết quả xử lý khi chốt DA_XU_LY",
    path: ["resolutionResult"],
  });

const rejectReportSchema = z.object({
  resolutionResult: z.string().trim().min(1, "Cần nhập lý do từ chối").max(2000),
});

module.exports = { idParamSchema, createReportSchema, processReportSchema, rejectReportSchema };
