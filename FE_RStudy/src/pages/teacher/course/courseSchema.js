import { z } from "zod";

const isNumber = (value) => value.trim() !== "" && !Number.isNaN(Number(value));

export const courseSchema = z
  .object({
    courseName: z.string().trim().min(1, "Nhập tên khóa học").max(200, "Tên khóa học tối đa 200 ký tự"),
    description: z.string().trim().min(1, "Nhập mô tả khóa học"),
    categoryId: z.string().min(1, "Chọn danh mục"),
    price: z.string().refine((value) => isNumber(value) && Number(value) >= 0, "Học phí không hợp lệ"),
    startDate: z.string().min(1, "Chọn ngày bắt đầu"),
    endDate: z.string().min(1, "Chọn ngày kết thúc"),
    coverImageUrl: z.string().trim().max(2048, "Đường dẫn ảnh tối đa 2048 ký tự"),
  })
  .refine((course) => !course.startDate || !course.endDate || course.endDate > course.startDate, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  });

export const EMPTY_COURSE = { courseName: "", description: "", categoryId: "", price: "0", startDate: "", endDate: "", coverImageUrl: "" };

export const EDITABLE_STATUSES = ["BAN_NHAP", "DA_PHE_DUYET", "DANG_MO", "TAM_NGUNG"];

export const toCourseBody = (values) => ({
  courseName: values.courseName,
  description: values.description,
  categoryId: values.categoryId,
  price: Number(values.price),
  startDate: values.startDate,
  endDate: values.endDate,
  coverImageUrl: values.coverImageUrl || null,
});

export const toFormValues = (course) => ({
  courseName: course.courseName,
  description: course.description,
  categoryId: course.categoryId,
  price: String(Number(course.price)),
  startDate: course.startDate.slice(0, 10),
  endDate: course.endDate.slice(0, 10),
  coverImageUrl: course.coverImageUrl ?? "",
});
