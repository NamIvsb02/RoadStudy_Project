import { z } from "zod";

const isNumber = (value) => value.trim() !== "" && !Number.isNaN(Number(value));
const numberField = (message) => z.string().refine((value) => isNumber(value) && Number(value) >= 0, message);

const optionSchema = z.object({
  content: z.string().trim().min(1, "Nhập nội dung đáp án").max(2000, "Đáp án tối đa 2000 ký tự"),
});

const questionSchema = z
  .object({
    content: z.string().trim().min(1, "Nhập nội dung câu hỏi").max(5000, "Câu hỏi tối đa 5000 ký tự"),
    score: numberField("Nhập điểm hợp lệ"),
    correctIndex: z.string(),
    options: z.array(optionSchema).min(2, "Cần ít nhất 2 đáp án").max(10, "Tối đa 10 đáp án"),
  })
  .refine((question) => Number(question.correctIndex) < question.options.length, { message: "Chọn đáp án đúng", path: ["correctIndex"] });

export const examSchema = z
  .object({
    examName: z.string().trim().min(1, "Nhập tên đề thi").max(200, "Tên đề tối đa 200 ký tự"),
    durationMinutes: z.string().refine((value) => isNumber(value) && Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 1440, "Thời gian từ 1 đến 1440 phút"),
    passingScore: numberField("Nhập điểm đạt hợp lệ"),
    maxAttempts: z.string().refine((value) => isNumber(value) && Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 10, "Số lượt làm từ 1 đến 10"),
    showAnswers: z.boolean(),
    questions: z.array(questionSchema).min(1, "Cần ít nhất 1 câu hỏi").max(200, "Tối đa 200 câu hỏi"),
  })
  .refine((exam) => Number(exam.passingScore) <= exam.questions.reduce((sum, question) => sum + Number(question.score || 0), 0), {
    message: "Điểm đạt không được lớn hơn tổng điểm các câu hỏi",
    path: ["passingScore"],
  });

export const EMPTY_QUESTION = () => ({ content: "", score: "1", correctIndex: "0", options: [{ content: "" }, { content: "" }, { content: "" }, { content: "" }] });

export const toExamBody = (courseId, values) => ({
  courseId,
  examName: values.examName,
  durationMinutes: Number(values.durationMinutes),
  passingScore: Number(values.passingScore),
  maxAttempts: Number(values.maxAttempts),
  showAnswers: values.showAnswers,
  questions: values.questions.map((question, index) => ({
    content: question.content,
    score: Number(question.score),
    questionOrder: index + 1,
    options: question.options.map((option, optionIndex) => ({ content: option.content, isCorrect: optionIndex === Number(question.correctIndex) })),
  })),
});
