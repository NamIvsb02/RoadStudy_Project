const { z } = require("zod");

const unknownKeysError = (issue) =>
    issue.code === "unrecognized_keys" ? `Không được gửi các trường: ${issue.keys.join(", ")}` : undefined;

const strictObject = (shape) => z.object(shape, { error: unknownKeysError }).strict();

// answerOptionId = null nghĩa là bỏ chọn câu đó
const answerSchema = strictObject({
    questionId: z.string().trim().min(1, "Thiếu questionId"),
    answerOptionId: z.string().trim().min(1).nullable(),
});

const answersField = z.array(answerSchema).max(500, "Tối đa 500 đáp án mỗi lần gửi");

const startSchema = strictObject({
    examId: z.string().trim().min(1, "Thiếu examId"),
});

const saveAnswersSchema = strictObject({
    answers: answersField.min(1, "Cần gửi ít nhất một đáp án"),
});

// Body có thể bỏ trống khi nộp bài (đáp án đã được lưu trước đó)
const submitSchema = strictObject({ answers: answersField.optional() }).optional();

module.exports = { startSchema, saveAnswersSchema, submitSchema };