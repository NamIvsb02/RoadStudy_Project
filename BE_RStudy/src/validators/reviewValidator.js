const { z } = require('zod');


const MAX_CONTENT_LENGTH = 1000;

const idField = (message) => z.string().min(1, message).max(36, message);

const courseIdParamSchema = z.object({ courseId: idField('Mã khóa học không hợp lệ') });
const idParamSchema = z.object({ id: idField('Mã đánh giá không hợp lệ') });
const responseIdParamSchema = z.object({ responseId: idField('Mã câu trả lời không hợp lệ') });


const ratingValue = z
  .union([z.number(), z.string()])
  .refine(
    (v) => String(v).trim() !== '' && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 5,
    { message: 'Số sao phải là số nguyên từ 1 đến 5' }
  )
  .transform((v) => Number(v));


const reviewContent = z
  .string()
  .trim()
  .max(MAX_CONTENT_LENGTH, `Nhận xét tối đa ${MAX_CONTENT_LENGTH} ký tự`)
  .transform((v) => (v === '' ? null : v))
  .nullable()
  .optional();

const createReviewSchema = z
  .object({
    rating: ratingValue.optional(),
    content: reviewContent,
  })
  .refine((d) => d.rating !== undefined, {
    message: 'Vui lòng chọn số sao',
    path: ['rating'],
  });

const updateReviewSchema = z
  .object({
    rating: ratingValue.optional(),
    content: reviewContent,
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Cần ít nhất một trường để cập nhật' });

const listQuerySchema = z.object({ rating: ratingValue.optional() });


const responseBodySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Nội dung không được để trống')
    .max(MAX_CONTENT_LENGTH, `Nội dung tối đa ${MAX_CONTENT_LENGTH} ký tự`),
});

module.exports = {
  MAX_CONTENT_LENGTH,
  courseIdParamSchema,
  idParamSchema,
  responseIdParamSchema,
  createReviewSchema,
  updateReviewSchema,
  listQuerySchema,
  responseBodySchema,
};