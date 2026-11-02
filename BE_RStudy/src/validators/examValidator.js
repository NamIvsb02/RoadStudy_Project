const { z } = require("zod");

// Message rõ ràng khi client gửi trường không được phép (vd: status, isCorrect sai chỗ...)
const unknownKeysError = (issue) =>
    issue.code === "unrecognized_keys" ? `Không được gửi các trường: ${issue.keys.join(", ")}` : undefined;

const strictObject = (shape) => z.object(shape, { error: unknownKeysError }).strict();

const optionSchema = strictObject({
    content: z.string().trim().min(1, "Nội dung đáp án không được để trống").max(2000, "Đáp án tối đa 2000 ký tự"),
    isCorrect: z.boolean(),
});

const optionsSchema = z
    .array(optionSchema)
    .min(2, "Mỗi câu hỏi cần ít nhất 2 đáp án")
    .max(10, "Mỗi câu hỏi tối đa 10 đáp án")
    .refine((opts) => opts.filter((o) => o.isCorrect).length === 1, "Mỗi câu hỏi phải có đúng một đáp án đúng");

const questionShape = {
    content: z.string().trim().min(1, "Nội dung câu hỏi không được để trống").max(5000, "Câu hỏi tối đa 5000 ký tự"),
    score: z.coerce.number().min(0, "Điểm không được âm").max(999.99, "Điểm tối đa 999.99"),
    questionOrder: z.coerce.number().int().min(1, "Thứ tự câu hỏi phải từ 1 trở lên").optional(),
    options: optionsSchema,
};

const createQuestionSchema = strictObject(questionShape);

const updateQuestionSchema = z
    .object(questionShape, { error: unknownKeysError })
    .partial()
    .strict()
    .refine((d) => Object.keys(d).length > 0, "Cần gửi ít nhất một trường để cập nhật");

const examShape = {
    examName: z.string().trim().min(1, "Tên đề thi không được để trống").max(200, "Tên đề thi tối đa 200 ký tự"),
    durationMinutes: z.coerce.number().int().min(1, "Thời gian làm bài phải lớn hơn 0").max(1440),
    passingScore: z.coerce.number().min(0, "Điểm đạt không được âm").max(999.99),
};

const createExamSchema = strictObject({
    courseId: z.string().trim().min(1, "Thiếu courseId"),
    ...examShape,
    questions: z.array(createQuestionSchema).min(1, "Đề thi phải có ít nhất một câu hỏi").max(200),
});

const updateExamSchema = z
    .object(examShape, { error: unknownKeysError })
    .partial()
    .strict()
    .refine((d) => Object.keys(d).length > 0, "Cần gửi ít nhất một trường để cập nhật");

const changeStatusSchema = strictObject({
    status: z.enum(["BAN_NHAP", "DA_PHE_DUYET", "DANG_MO", "TAM_NGUNG"]),
});

module.exports = {
    createExamSchema,
    updateExamSchema,
    changeStatusSchema,
    createQuestionSchema,
    updateQuestionSchema,
};