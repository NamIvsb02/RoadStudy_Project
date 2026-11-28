const router = require("express").Router();
const courseController = require("../controllers/courseController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { contentWriteLimiter } = require("../middlewares/rateLimitMiddleware");
const { idParamSchema, createCourseSchema, updateCourseSchema, changeStatusSchema, rejectCourseSchema } = require("../validators/courseValidator");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const { uploadCover } = require("../middlewares/uploadMiddleware");

const teacherOnly = [authenticate, authorize("TEACHER")];
const checkCoursePermission = requirePermission(PERMISSIONS.QUAN_LY_KHOA_HOC);
const adminOnly = [authenticate, authorize("ADMINISTRATOR"), checkCoursePermission];
// Giáo viên sửa khóa của mình (service kiểm tra sở hữu); admin phải có QUAN_LY_KHOA_HOC
const adminNeedsPermission = (req, res, next) => (req.user.role === "ADMINISTRATOR" ? checkCoursePermission(req, res, next) : next());
const courseEditor = [authenticate, authorize("TEACHER", "ADMINISTRATOR"), adminNeedsPermission];
router.post("/", ...teacherOnly, validate(createCourseSchema), courseController.create);
router.post("/cover", ...courseEditor, contentWriteLimiter, uploadCover, courseController.uploadCover);
router.get("/mine", ...teacherOnly, courseController.getMyList);
router.get("/mine/:id", ...teacherOnly, validate(idParamSchema, "params"), courseController.getMyById);
router.put("/:id", ...courseEditor, validate(idParamSchema, "params"), validate(updateCourseSchema), courseController.update);
router.post("/:id/submit", ...teacherOnly, validate(idParamSchema, "params"), courseController.submit);

router.get("/manage", ...adminOnly, courseController.getAdminList);
router.get("/manage/:id", ...adminOnly, validate(idParamSchema, "params"), courseController.getAdminById);
router.post("/:id/approve", ...adminOnly, validate(idParamSchema, "params"), courseController.approve);
router.post("/:id/reject", ...adminOnly, validate(idParamSchema, "params"), validate(rejectCourseSchema), courseController.reject);
router.patch("/:id/status", ...adminOnly, validate(idParamSchema, "params"), validate(changeStatusSchema), courseController.changeStatus);

router.get("/", courseController.getPublicList);
router.get("/:id", validate(idParamSchema, "params"), courseController.getPublicById);

module.exports = router;
