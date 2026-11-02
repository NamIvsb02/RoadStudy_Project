const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const controller = require("../controllers/submissionController");
const { startSchema, saveAnswersSchema, submitSchema } = require("../validators/submissionValidator");

router.use(authenticate);

// Học viên làm bài
router.post("/start", authorize("STUDENT"), validate(startSchema), controller.start);
router.get("/me", authorize("STUDENT"), controller.myAttempts);
router.put("/:id/answers", authorize("STUDENT"), validate(saveAnswersSchema), controller.saveAnswers);
router.post("/:id/submit", authorize("STUDENT"), validate(submitSchema), controller.submit);

// Giáo viên (khóa mình phụ trách) và quản trị viên xem bài làm của một đề
router.get("/exam/:examId", authorize("TEACHER", "ADMINISTRATOR"), controller.listByExam);

// Xem kết quả: học viên (bài của mình), giáo viên, quản trị viên
router.get("/:id", authorize("STUDENT", "TEACHER", "ADMINISTRATOR"), controller.getById);

module.exports = router;