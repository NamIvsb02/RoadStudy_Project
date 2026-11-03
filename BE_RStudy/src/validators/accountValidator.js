const { z } = require("zod");

const updateProfileSchema = z
  .strictObject({
    fullName: z.string().trim().min(1).max(100).optional(),
    phoneNumber: z.string().trim().max(15).nullable().optional(),
    dateOfBirth: z.coerce.date().nullable().optional(),
    gender: z.enum(["NAM", "NU", "KHAC", "KHONG_TIET_LO"]).nullable().optional(),
    address: z.string().trim().max(255).nullable().optional(),
    specialization: z.string().trim().min(1).max(150).optional(),
    biography: z.string().trim().min(1).max(5000).optional(),
    teachingExperience: z.string().trim().min(1).max(5000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Cần ít nhất 1 trường để cập nhật" });

const updateStatusSchema = z.strictObject({
  status: z.enum(["HOAT_DONG", "BI_KHOA"]),
});

module.exports = { updateProfileSchema, updateStatusSchema };
