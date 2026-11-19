const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const controller = require("../controllers/chatbotController");
const { sendMessageSchema } = require("../validators/chatbotValidator");

router.use(authenticate, authorize("STUDENT"));

router.post("/messages", validate(sendMessageSchema), controller.sendMessage);
router.get("/conversations", controller.listConversations);
router.get("/conversations/:id", controller.getConversation);

module.exports = router;