const router = require("express").Router();
const controller = require("../controllers/notificationController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate } = require("../middlewares/authMiddleware");
const { idParamSchema } = require("../validators/notificationValidator");

router.use(authenticate);

router.get("/", controller.list);
router.get("/unread-count", controller.unreadCount);
router.patch("/read-all", controller.markAllRead);
router.patch("/:id/read", validate(idParamSchema, "params"), controller.markRead);

module.exports = router;
