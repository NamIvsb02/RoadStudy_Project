const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const controller = require("../controllers/examController");
const {
    createExamSchema,
    updateExamSchema,
    changeStatusSchema,
    createQuestionSchema,
    updateQuestionSchema,
} = require("../validators/examValidator");

const ALL = ["STUDENT", "TEACHER", "ADMINISTRATOR"];
const MANAGER = ["TEACHER", "ADMINISTRATOR"];

router.use(authenticate);

// Xem đề (học viên chỉ thấy đề đang mở của khóa đã được xác nhận đăng ký, không có câu hỏi)
router.get("/course/:courseId", authorize(...ALL), controller.listByCourse);
router.get("/:id", authorize(...ALL), controller.getById);

// Quản lý đề: giáo viên (khóa mình phụ trách) và quản trị viên
router.post("/", authorize(...MANAGER), validate(createExamSchema), controller.create);
router.put("/:id", authorize(...MANAGER), validate(updateExamSchema), controller.update);
router.patch("/:id/status", authorize(...MANAGER), validate(changeStatusSchema), controller.changeStatus);
router.delete("/:id", authorize(...MANAGER), controller.remove);

// Câu hỏi (đáp án được gửi kèm câu hỏi, thay thế toàn bộ khi sửa)
router.post("/:id/questions", authorize(...MANAGER), validate(createQuestionSchema), controller.addQuestion);
router.put("/questions/:questionId", authorize(...MANAGER), validate(updateQuestionSchema), controller.updateQuestion);
router.delete("/questions/:questionId", authorize(...MANAGER), controller.removeQuestion);

module.exports = router;
