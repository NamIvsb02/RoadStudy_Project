const express = require("express");
const router = express.Router();

const controller = require("../controllers/accountController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { uploadAvatar } = require("../middlewares/uploadMiddleware");
const { updateProfileSchema, updateStatusSchema } = require("../validators/accountValidator");

router.patch("/profile", authenticate, validate(updateProfileSchema), controller.updateProfile);
router.post("/avatar", authenticate, uploadAvatar, controller.updateAvatar);

// TODO: thay authorize bằng requirePermission('QUAN_LY_TAI_KHOAN') khi API Admin xong
router.get("/", authenticate, authorize("ADMINISTRATOR"), controller.list);
router.patch("/:id/status", authenticate, authorize("ADMINISTRATOR"), validate(updateStatusSchema), controller.changeStatus);

module.exports = router;
