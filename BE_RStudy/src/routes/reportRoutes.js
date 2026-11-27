const router = require("express").Router();
const reportController = require("../controllers/reportController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { contentWriteLimiter } = require("../middlewares/rateLimitMiddleware");
const { idParamSchema, createReportSchema, processReportSchema, rejectReportSchema } = require("../validators/reportValidator");

const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");

const adminOnly = [authenticate, authorize("ADMINISTRATOR"), requirePermission(PERMISSIONS.XU_LY_BAO_CAO_VI_PHAM)];
router.post("/", authenticate, authorize("STUDENT", "TEACHER"), contentWriteLimiter, validate(createReportSchema), reportController.create);

router.get("/", ...adminOnly, reportController.getList);
router.get("/:id", ...adminOnly, validate(idParamSchema, "params"), reportController.getById);
router.patch("/:id/process", ...adminOnly, validate(idParamSchema, "params"), validate(processReportSchema), reportController.process);
router.patch("/:id/reject", ...adminOnly, validate(idParamSchema, "params"), validate(rejectReportSchema), reportController.reject);

module.exports = router;
