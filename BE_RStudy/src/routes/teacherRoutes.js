const express = require("express");
const router = express.Router();

const controller = require("../controllers/teacherController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const { updateApprovalSchema } = require("../validators/teacherValidator");

router.get("/", controller.listPublic);
router.get("/admin/list", authenticate, requirePermission(PERMISSIONS.DUYET_GIAO_VIEN), controller.listForAdmin);
router.patch("/:id/approval", authenticate, requirePermission(PERMISSIONS.DUYET_GIAO_VIEN), validate(updateApprovalSchema), controller.setApproval);
router.get("/me/stats", authenticate, authorize("TEACHER"), controller.getMyStats);
router.get("/:id", controller.getPublic);

module.exports = router;
