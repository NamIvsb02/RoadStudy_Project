const router = require("express").Router();
const reportController = require("../controllers/reportController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { idParamSchema, createReportSchema, processReportSchema, rejectReportSchema } = require("../validators/reportValidator");

const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");

const adminOnly = [authenticate, requirePermission(PERMISSIONS.XU_LY_BAO_CAO_VI_PHAM)];
// HỌC VIÊN / GIÁO VIÊN gửi báo cáo
router.post("/", authenticate, authorize("STUDENT", "TEACHER"), validate(createReportSchema), reportController.create);

// ADMIN
router.get("/", ...adminOnly, reportController.getList);
router.get("/:id", ...adminOnly, validate(idParamSchema, "params"), reportController.getById);
router.patch("/:id/process", ...adminOnly, validate(idParamSchema, "params"), validate(processReportSchema), reportController.process);
router.patch("/:id/reject", ...adminOnly, validate(idParamSchema, "params"), validate(rejectReportSchema), reportController.reject);

module.exports = router;
