const { z } = require("zod");

const unknownKeysError = (issue) =>
    issue.code === "unrecognized_keys" ? `Không được gửi các trường: ${issue.keys.join(", ")}` : undefined;

const strictObject = (shape) => z.object(shape, { error: unknownKeysError }).strict();

const rejectInvoiceSchema = strictObject({
    reason: z.string().trim().min(1, "Vui lòng nhập lý do từ chối").max(500, "Lý do tối đa 500 ký tự"),
});

const refundRequestSchema = strictObject({
    description: z.string().trim().min(1, "Vui lòng nhập lý do yêu cầu hoàn tiền").max(1000, "Tối đa 1000 ký tự"),
});

// Body có thể bỏ trống khi chấp thuận / hoàn tất
const refundNoteSchema = strictObject({
    adminNote: z.string().trim().max(1000, "Ghi chú tối đa 1000 ký tự").optional(),
}).optional();

const rejectRefundSchema = strictObject({
    adminNote: z.string().trim().min(1, "Vui lòng nhập lý do từ chối").max(1000, "Lý do tối đa 1000 ký tự"),
    cancelRegistration: z.boolean().optional(),
});

module.exports = { rejectInvoiceSchema, refundRequestSchema, refundNoteSchema, rejectRefundSchema };