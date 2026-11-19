const { z } = require("zod");

const idParamSchema = z.object({ id: z.string().uuid("id không hợp lệ") });

module.exports = { idParamSchema };
