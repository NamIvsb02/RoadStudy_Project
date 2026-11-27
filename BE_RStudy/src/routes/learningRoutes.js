const router = require("express").Router();
const controller = require("../controllers/learningController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const { courseIdParamSchema, sessionIdParamSchema, updateLearningSchema, createSessionSchema, updateSessionSchema } = require("../validators/learningValidator");

const checkAdminPermission = requirePermission(PERMISSIONS.QUAN_LY_KHOA_HOC);
const adminNeedsPermission = (req, res, next) => (req.user.role === "ADMINISTRATOR" ? checkAdminPermission(req, res, next) : next());
const teacherOnly = authorize("TEACHER");

router.use(authenticate);

router.get("/:courseId", authorize("STUDENT", "TEACHER", "ADMINISTRATOR"), adminNeedsPermission, validate(courseIdParamSchema, "params"), controller.get);
router.put("/:courseId", teacherOnly, validate(courseIdParamSchema, "params"), validate(updateLearningSchema), controller.update);
router.post("/:courseId/sessions", teacherOnly, validate(courseIdParamSchema, "params"), validate(createSessionSchema), controller.createSession);
router.put("/sessions/:id", teacherOnly, validate(sessionIdParamSchema, "params"), validate(updateSessionSchema), controller.updateSession);
router.delete("/sessions/:id", teacherOnly, validate(sessionIdParamSchema, "params"), controller.removeSession);

module.exports = router;
