const { z } = require("zod");

const unknownKeysError = (issue) => (issue.code === "unrecognized_keys" ? `Không được gửi các trường: ${issue.keys.join(", ")}` : undefined);
const nonEmpty = (data) => Object.keys(data).length > 0;

const httpsUrl = z
  .string()
  .trim()
  .max(2048, "Đường dẫn tối đa 2048 ký tự")
  .url("Đường dẫn không hợp lệ")
  .refine((value) => value.startsWith("https://"), "Đường dẫn phải bắt đầu bằng https://");
const optionalUrl = z.preprocess((value) => (value === "" ? null : value), httpsUrl.nullable());

const courseIdParamSchema = z.object({ courseId: z.string().uuid("courseId không hợp lệ") });
const sessionIdParamSchema = z.object({ id: z.string().uuid("id không hợp lệ") });

const updateLearningSchema = z
  .object({ driveUrl: optionalUrl.optional(), classUrl: optionalUrl.optional(), showExams: z.boolean().optional() }, { error: unknownKeysError })
  .strict()
  .refine(nonEmpty, "Cần gửi ít nhất một trường để cập nhật");

const sessionShape = {
  title: z.string().trim().min(1, "Tiêu đề không được để trống").max(200, "Tiêu đề tối đa 200 ký tự"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  note: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự").nullable().optional(),
};

const createSessionSchema = z.object(sessionShape, { error: unknownKeysError }).strict();
const updateSessionSchema = z.object(sessionShape, { error: unknownKeysError }).partial().strict().refine(nonEmpty, "Cần gửi ít nhất một trường để cập nhật");

module.exports = { courseIdParamSchema, sessionIdParamSchema, updateLearningSchema, createSessionSchema, updateSessionSchema };
