import { z } from "zod";

const GENDERS = ["NAM", "NU", "KHAC", "KHONG_TIET_LO"];

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

const commonShape = {
  fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên").max(100, "Họ và tên tối đa 100 ký tự"),
  email: z.string().trim().min(1, "Vui lòng nhập email").max(254, "Email tối đa 254 ký tự").email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  phoneNumber: z.string().trim().max(15, "Số điện thoại tối đa 15 ký tự"),
};

const matchPassword = (schema) =>
  schema.refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const studentSchema = matchPassword(
  z.object({
    ...commonShape,
    gender: z.enum(["", ...GENDERS]),
    dateOfBirth: z.string(),
    address: z.string().trim().max(255, "Địa chỉ tối đa 255 ký tự"),
  }),
);

export const teacherSchema = matchPassword(
  z.object({
    ...commonShape,
    specialization: z.string().trim().min(1, "Vui lòng nhập chuyên môn").max(150, "Chuyên môn tối đa 150 ký tự"),
    teachingExperience: z.string().trim().min(1, "Vui lòng nhập kinh nghiệm giảng dạy"),
    biography: z.string().trim().min(1, "Vui lòng nhập phần giới thiệu"),
  }),
);
export const verifyEmailSchema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Mã xác thực gồm 6 chữ số"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

export const resetPasswordSchema = matchPassword(
  z.object({
    email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Mã xác thực gồm 6 chữ số"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  }),
);
