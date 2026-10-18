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

// Đăng ký chỉ nhận STUDENT hoặc TEACHER — tài khoản ADMINISTRATOR
// không tạo qua route công khai này (tạo qua seed hoặc module Admin sau).
const registerSchema = z.discriminatedUnion("role", [studentRegisterSchema, teacherRegisterSchema]);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

module.exports = { registerSchema, loginSchema };
