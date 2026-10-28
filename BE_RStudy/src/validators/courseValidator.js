const { z } = require('zod');
const { CourseStatus } = require('@prisma/client');

const courseName = z
  .string()
  .trim()
  .min(1, 'Tên khóa học không được để trống')
  .max(200, 'Tên khóa học tối đa 200 ký tự');

const description = z.string().trim().min(1, 'Mô tả không được để trống');

// Decimal(12,2): tối đa 9.999.999.999,99
const price = z.coerce
  .number()
  .min(0, 'Học phí không được âm')
  .max(9999999999.99, 'Học phí quá lớn');

const coverImageUrl = z.string().trim().max(2048, 'Đường dẫn ảnh tối đa 2048 ký tự').nullable();

const categoryId = z.string().trim().min(1, 'Danh mục không hợp lệ').max(36, 'Danh mục không hợp lệ');

const date = z.coerce.date();

const idParamSchema = z.object({
  id: z.string().min(1, 'Mã khóa học không hợp lệ').max(36),
});

const createCourseSchema = z
  .object({
    courseName,
    description,
    price: price.optional(),
    coverImageUrl: coverImageUrl.optional(),
    startDate: date,
    endDate: date,
    categoryId,
  })
  .refine((d) => d.endDate > d.startDate, {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['endDate'],
  });

// Không có status/teacherId: giáo viên không được tự đổi trạng thái hay người phụ trách
const updateCourseSchema = z
  .object({
    courseName: courseName.optional(),
    description: description.optional(),
    price: price.optional(),
    coverImageUrl: coverImageUrl.optional(),
    startDate: date.optional(),
    endDate: date.optional(),
    categoryId: categoryId.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Cần ít nhất một trường để cập nhật' })
  .refine((d) => !d.startDate || !d.endDate || d.endDate > d.startDate, {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['endDate'],
  });

const changeStatusSchema = z.object({
  status: z.enum(Object.values(CourseStatus)),
});

// Tham số tìm kiếm/lọc/sắp xếp của danh sách công khai (page và limit do getPagination xử lý riêng)
const PUBLIC_SORT_VALUES = ['newest', 'price_asc', 'price_desc', 'start_soon', 'name'];

const publicListQuerySchema = z
  .object({
    q: z.string().trim().max(100, 'Từ khóa tối đa 100 ký tự').optional(),
    categoryId: z.string().trim().min(1).max(36, 'Mã danh mục không hợp lệ').optional(),
    teacherId: z.string().trim().min(1).max(36, 'Mã giáo viên không hợp lệ').optional(),
    minPrice: z.coerce.number().min(0, 'minPrice không được âm').optional(),
    maxPrice: z.coerce.number().min(0, 'maxPrice không được âm').optional(),
    sort: z.enum(PUBLIC_SORT_VALUES).optional(),
  })
  .refine((d) => d.minPrice === undefined || d.maxPrice === undefined || d.minPrice <= d.maxPrice, {
    message: 'minPrice không được lớn hơn maxPrice',
    path: ['maxPrice'],
  });

module.exports = {
  idParamSchema,
  createCourseSchema,
  updateCourseSchema,
  changeStatusSchema,
  publicListQuerySchema,
};