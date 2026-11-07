import { z } from "zod";
import { ROLES } from "../../constants/roles";

const GENDERS = ["NAM", "NU", "KHAC", "KHONG_TIET_LO"];

const baseShape = {
  fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên").max(100, "Họ và tên tối đa 100 ký tự"),
  phoneNumber: z.string().trim().max(15, "Số điện thoại tối đa 15 ký tự"),
};

const longText = (label) => z.string().trim().min(1, `Vui lòng nhập ${label}`).max(5000, `${label} tối đa 5000 ký tự`);

const studentSchema = z.object({
  ...baseShape,
  dateOfBirth: z.string(),
  gender: z.enum(["", ...GENDERS]),
  address: z.string().trim().max(255, "Địa chỉ tối đa 255 ký tự"),
});

const teacherSchema = z.object({
  ...baseShape,
  specialization: z.string().trim().min(1, "Vui lòng nhập chuyên môn").max(150, "Chuyên môn tối đa 150 ký tự"),
  biography: longText("giới thiệu bản thân"),
  teachingExperience: longText("kinh nghiệm giảng dạy"),
});

export const getProfileSchema = (role) => {
  if (role === ROLES.STUDENT) return studentSchema;
  if (role === ROLES.TEACHER) return teacherSchema;
  return z.object(baseShape);
};

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(8, "Mật khẩu mới tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
