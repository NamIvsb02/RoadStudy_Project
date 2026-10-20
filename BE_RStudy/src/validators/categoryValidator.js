const { z } = require('zod');
const { CategoryStatus } = require('@prisma/client');

const statusEnum = z.enum(Object.values(CategoryStatus));

const categoryName = z
  .string()
  .trim()
  .min(1, 'Tên danh mục không được để trống')
  .max(100, 'Tên danh mục tối đa 100 ký tự');

const description = z.string().trim().max(500, 'Mô tả tối đa 500 ký tự').nullable();

const idParamSchema = z.object({
  id: z.string().min(1, 'Mã danh mục không hợp lệ').max(36),
});

const createCategorySchema = z.object({
  categoryName,
  description: description.optional(),
  status: statusEnum.optional(),
});

const updateCategorySchema = z
  .object({
    categoryName: categoryName.optional(),
    description: description.optional(),
    status: statusEnum.optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'Cần ít nhất một trường để cập nhật',
  });

const changeStatusSchema = z.object({ status: statusEnum });

module.exports = { idParamSchema, createCategorySchema, updateCategorySchema, changeStatusSchema };