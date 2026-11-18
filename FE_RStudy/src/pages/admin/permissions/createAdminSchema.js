import { z } from "zod";

export const createAdminSchema = z
  .object({
    fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên").max(100, "Họ và tên tối đa 100 ký tự"),
    email: z.string().trim().min(1, "Vui lòng nhập email").max(254, "Email tối đa 254 ký tự").email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .max(72, "Mật khẩu tối đa 72 ký tự")
      .regex(/[a-z]/, "Mật khẩu cần có chữ thường")
      .regex(/[A-Z]/, "Mật khẩu cần có chữ hoa")
      .regex(/\d/, "Mật khẩu cần có chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    phoneNumber: z.string().trim().max(15, "Số điện thoại tối đa 15 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
