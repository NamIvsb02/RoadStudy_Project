const router = require("express").Router();
const resourceController = require("../controllers/resourceController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { uploadResource } = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { contentWriteLimiter } = require("../middlewares/rateLimitMiddleware");
const { idParamSchema, createResourceSchema } = require("../validators/resourceValidator");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");

const checkAdminPermission = requirePermission(PERMISSIONS.QUAN_LY_KHOA_HOC);
const adminNeedsPermission = (req, res, next) => (req.user.role === "ADMINISTRATOR" ? checkAdminPermission(req, res, next) : next());

// PUBLIC
router.get("/", resourceController.getList);
router.get("/:id", validate(idParamSchema, "params"), resourceController.getById);

// TEACHER
router.post("/", authenticate, authorize("TEACHER"), contentWriteLimiter, uploadResource, validate(createResourceSchema), resourceController.create);

// TEACHER (của mình) + ADMINISTRATOR (tất cả)
router.delete("/:id", authenticate, authorize("TEACHER", "ADMINISTRATOR"), adminNeedsPermission, validate(idParamSchema, "params"), resourceController.remove);
module.exports = router;
