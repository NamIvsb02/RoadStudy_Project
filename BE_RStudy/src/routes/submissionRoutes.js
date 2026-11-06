const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const controller = require("../controllers/submissionController");
const { startSchema, saveAnswersSchema, submitSchema } = require("../validators/submissionValidator");

router.use(authenticate);

// Admin phải có quyền QUAN_LY_BAI_THI mới xem được bài làm; học viên và giáo viên không bị ảnh hưởng
const checkAdminPermission = requirePermission(PERMISSIONS.QUAN_LY_BAI_THI);
const adminNeedsPermission = (req, res, next) =>
    req.user.role === "ADMINISTRATOR" ? checkAdminPermission(req, res, next) : next();

// Học viên làm bài
router.post("/start", authorize("STUDENT"), validate(startSchema), controller.start);
router.get("/me", authorize("STUDENT"), controller.myAttempts);
router.put("/:id/answers", authorize("STUDENT"), validate(saveAnswersSchema), controller.saveAnswers);
router.post("/:id/submit", authorize("STUDENT"), validate(submitSchema), controller.submit);

// Giáo viên (khóa mình phụ trách) và admin có quyền xem bài làm của một đề
router.get("/exam/:examId", authorize("TEACHER", "ADMINISTRATOR"), adminNeedsPermission, controller.listByExam);

// Xem kết quả: học viên (bài của mình), giáo viên, quản trị viên
router.get("/:id", authorize("STUDENT", "TEACHER", "ADMINISTRATOR"), adminNeedsPermission, controller.getById);

module.exports = router;