const express = require("express");
const router = express.Router();

const controller = require("../controllers/teacherController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate } = require("../middlewares/authMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const { updateApprovalSchema } = require("../validators/teacherValidator");

router.get("/", controller.listPublic);
router.get("/admin/list", authenticate, requirePermission(PERMISSIONS.QUAN_LY_TAI_KHOAN), controller.listForAdmin);
router.patch("/:id/approval", authenticate, requirePermission(PERMISSIONS.QUAN_LY_TAI_KHOAN), validate(updateApprovalSchema), controller.setApproval);
router.get("/:id", controller.getPublic);

module.exports = router;
