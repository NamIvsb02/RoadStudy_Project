const express = require("express");
const router = express.Router();

const controller = require("../controllers/teacherController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { updateApprovalSchema } = require("../validators/teacherValidator");

router.get("/", controller.listPublic);
// TODO: thay authorize bằng requirePermission('DUYET_GIAO_VIEN') khi API Admin xong
router.get("/admin/list", authenticate, authorize("ADMINISTRATOR"), controller.listForAdmin);
router.patch("/:id/approval", authenticate, authorize("ADMINISTRATOR"), validate(updateApprovalSchema), controller.setApproval);
router.get("/:id", controller.getPublic);

module.exports = router;
