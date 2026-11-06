const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const controller = require("../controllers/examController");
const {
    createExamSchema,
    updateExamSchema,
    changeStatusSchema,
    createQuestionSchema,
    updateQuestionSchema,
} = require("../validators/examValidator");

const ALL = ["STUDENT", "TEACHER", "ADMINISTRATOR"];

// Giáo viên chỉ cần authorize("TEACHER"); admin phải có quyền QUAN_LY_BAI_THI
const checkAdminPermission = requirePermission(PERMISSIONS.QUAN_LY_BAI_THI);
const adminNeedsPermission = (req, res, next) =>
    req.user.role === "ADMINISTRATOR" ? checkAdminPermission(req, res, next) : next();
const MANAGER = [authorize("TEACHER", "ADMINISTRATOR"), adminNeedsPermission];

router.use(authenticate);

// Xem đề (học viên chỉ thấy đề đang mở của khóa đã được xác nhận đăng ký, không có câu hỏi)
router.get("/course/:courseId", authorize(...ALL), adminNeedsPermission, controller.listByCourse);
router.get("/:id", authorize(...ALL), adminNeedsPermission, controller.getById);

// Quản lý đề: giáo viên (khóa mình phụ trách) và admin có quyền QUAN_LY_BAI_THI
router.post("/", ...MANAGER, validate(createExamSchema), controller.create);
router.put("/:id", ...MANAGER, validate(updateExamSchema), controller.update);
router.patch("/:id/status", ...MANAGER, validate(changeStatusSchema), controller.changeStatus);
router.delete("/:id", ...MANAGER, controller.remove);

// Câu hỏi (đáp án được gửi kèm câu hỏi, thay thế toàn bộ khi sửa)
router.post("/:id/questions", ...MANAGER, validate(createQuestionSchema), controller.addQuestion);
router.put("/questions/:questionId", ...MANAGER, validate(updateQuestionSchema), controller.updateQuestion);
router.delete("/questions/:questionId", ...MANAGER, controller.removeQuestion);

module.exports = router;