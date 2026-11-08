const { z } = require("zod");

const idParamSchema = z.object({ id: z.string().uuid("id không hợp lệ") });

const createResourceSchema = z.object({
  resourceName: z.string().trim().min(1, "Tên tài liệu không được trống").max(200),
  categoryId: z.string().uuid("categoryId không hợp lệ"),
});

module.exports = { idParamSchema, createResourceSchema };
