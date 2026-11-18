const express = require("express");
const router = express.Router();

const controller = require("../controllers/accountController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { uploadAvatar } = require("../middlewares/uploadMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const { updateProfileSchema, updateStatusSchema } = require("../validators/accountValidator");

const manageAccounts = [authenticate, authorize("ADMINISTRATOR"), requirePermission(PERMISSIONS.QUAN_LY_TAI_KHOAN)];

router.patch("/profile", authenticate, validate(updateProfileSchema), controller.updateProfile);
router.post("/avatar", authenticate, uploadAvatar, controller.updateAvatar);

router.get("/", ...manageAccounts, controller.list);
router.patch("/:id/status", ...manageAccounts, validate(updateStatusSchema), controller.changeStatus);

module.exports = router;
