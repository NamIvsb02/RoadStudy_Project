const { z } = require("zod");

const studentRegisterSchema = z.object({
  role: z.literal("STUDENT"),
  fullName: z.string().min(1).max(100),
  email: z.string().email().max(254),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  phoneNumber: z.string().max(15).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["NAM", "NU", "KHAC", "KHONG_TIET_LO"]).optional(),
  address: z.string().max(255).optional(),
});

const teacherRegisterSchema = z.object({
  role: z.literal("TEACHER"),
  fullName: z.string().min(1).max(100),
  email: z.string().email().max(254),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  phoneNumber: z.string().max(15).optional(),
  specialization: z.string().min(1).max(150),
  biography: z.string().min(1),
  teachingExperience: z.string().min(1),
});

const registerSchema = z.discriminatedUnion("role", [studentRegisterSchema, teacherRegisterSchema]);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const resendOtpSchema = z.object({
  email: z.string().email(),
  purpose: z.enum(["XAC_MINH_EMAIL", "QUEN_MAT_KHAU"]),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(8),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
};
