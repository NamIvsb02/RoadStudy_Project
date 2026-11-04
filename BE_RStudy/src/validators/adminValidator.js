const { z } = require("zod");
const AppError = require("../utils/AppError");

const parse = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.join(".");
    throw new AppError(field ? `${field}: ${issue.message}` : issue.message, 400);
  }
  return result.data;
};

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
});

const idParamSchema = z.object({
  id: z.string().min(1),
});

const createAdminSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72).regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa").regex(/[a-z]/, "Phải có ít nhất 1 chữ thường").regex(/[0-9]/, "Phải có ít nhất 1 chữ số"),
  phoneNumber: z.string().trim().min(8).max(15).optional(),
  functionIds: z.array(z.string().min(1)).default([]),
});

const updateStatusSchema = z.object({
  status: z.enum(["HOAT_DONG", "BI_KHOA"]),
});

const updatePermissionsSchema = z.object({
  functionIds: z.array(z.string().min(1)),
});

module.exports = {
  parse,
  listQuerySchema,
  idParamSchema,
  createAdminSchema,
  updateStatusSchema,
  updatePermissionsSchema,
};
