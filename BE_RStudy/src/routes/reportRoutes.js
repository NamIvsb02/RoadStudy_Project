const router = require("express").Router();
const reportController = require("../controllers/reportController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { idParamSchema, createReportSchema, processReportSchema, rejectReportSchema } = require("../validators/reportValidator");

// TODO: thay authorize bằng requirePermission('XU_LY_BAO_CAO_VI_PHAM') khi API Admin xong
const adminOnly = [authenticate, authorize("ADMINISTRATOR")];

// HỌC VIÊN / GIÁO VIÊN gửi báo cáo
router.post("/", authenticate, authorize("STUDENT", "TEACHER"), validate(createReportSchema), reportController.create);

// ADMIN
router.get("/", ...adminOnly, reportController.getList);
router.get("/:id", ...adminOnly, validate(idParamSchema, "params"), reportController.getById);
router.patch("/:id/process", ...adminOnly, validate(idParamSchema, "params"), validate(processReportSchema), reportController.process);
router.patch("/:id/reject", ...adminOnly, validate(idParamSchema, "params"), validate(rejectReportSchema), reportController.reject);

module.exports = router;
