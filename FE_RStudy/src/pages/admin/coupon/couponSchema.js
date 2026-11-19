import { z } from "zod";

const isNumber = (value) => value.trim() !== "" && !Number.isNaN(Number(value));
const vnDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
const toIso = (date, time) => new Date(`${date}T${time}+07:00`).toISOString();

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]{3,50}$/, "Mã 3 đến 50 ký tự, chỉ gồm chữ, số, - và _"),
    discountType: z.enum(["AMOUNT", "PERCENTAGE"]),
    discountValue: z.string().refine((value) => isNumber(value) && Number(value) > 0, "Nhập giá trị giảm lớn hơn 0"),
    startDate: z.string().min(1, "Chọn ngày bắt đầu"),
    endDate: z.string().min(1, "Chọn ngày kết thúc"),
    usageLimit: z.string().refine((value) => isNumber(value) && Number.isInteger(Number(value)) && Number(value) >= 1, "Số lượt dùng tối thiểu là 1"),
  })
  .refine((coupon) => coupon.discountType !== "PERCENTAGE" || !isNumber(coupon.discountValue) || Number(coupon.discountValue) <= 100, {
    message: "Phần trăm giảm tối đa là 100",
    path: ["discountValue"],
  })
  .refine((coupon) => !coupon.startDate || !coupon.endDate || coupon.endDate >= coupon.startDate, {
    message: "Ngày kết thúc không được trước ngày bắt đầu",
    path: ["endDate"],
  });

export const EMPTY_COUPON = { code: "", discountType: "PERCENTAGE", discountValue: "", startDate: "", endDate: "", usageLimit: "100" };

export const toFormValues = (coupon) => ({
  code: coupon.code,
  discountType: coupon.discountAmount ? "AMOUNT" : "PERCENTAGE",
  discountValue: String(Number(coupon.discountAmount ?? coupon.discountPercentage)),
  startDate: vnDate.format(new Date(coupon.startDate)),
  endDate: vnDate.format(new Date(coupon.endDate)),
  usageLimit: String(coupon.usageLimit),
});

export const toBody = (values, original) => {
  const body = {
    startDate: toIso(values.startDate, "00:00:00"),
    endDate: toIso(values.endDate, "23:59:59"),
    usageLimit: Number(values.usageLimit),
    [values.discountType === "AMOUNT" ? "discountAmount" : "discountPercentage"]: Number(values.discountValue),
  };
  const code = values.code.trim().toUpperCase();
  if (!original || code !== original.code) body.code = code;
  return body;
};
