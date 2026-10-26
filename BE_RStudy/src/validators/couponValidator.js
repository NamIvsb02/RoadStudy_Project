const { z } = require("zod");

const base = z.object({
    code: z
        .string()
        .trim()
        .min(3, "Mã tối thiểu 3 ký tự")
        .max(50, "Mã tối đa 50 ký tự")
        .regex(/^[A-Za-z0-9_-]+$/, "Mã chỉ gồm chữ, số, '-' và '_'"),
    discountAmount: z.coerce.number().positive("Số tiền giảm phải lớn hơn 0").nullable().optional(),
    discountPercentage: z.coerce
        .number()
        .gt(0, "Phần trăm giảm phải lớn hơn 0")
        .max(100, "Phần trăm giảm tối đa là 100")
        .nullable()
        .optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    usageLimit: z.coerce.number().int().min(1, "Số lượt tối đa phải từ 1 trở lên"),
    status: z.enum(["HOAT_DONG", "TAM_NGUNG"]).optional(),
});

// usedCount không có trong schema nên client không thể tự gửi lên (strict sẽ báo lỗi)
const createCouponSchema = base.strict();
const updateCouponSchema = base.partial().strict();

const changeStatusSchema = z.object({
    status: z.enum(["HOAT_DONG", "TAM_NGUNG"]),
});

const validateCouponSchema = z.object({
    code: z.string().trim().min(1, "Vui lòng nhập mã giảm giá"),
    courseId: z.string().trim().min(1).optional(),
});

module.exports = { createCouponSchema, updateCouponSchema, changeStatusSchema, validateCouponSchema };
