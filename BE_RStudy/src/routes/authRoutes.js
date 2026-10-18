const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate } = require("../middlewares/authMiddleware");
const { registerSchema, loginSchema } = require("../validators/authValidator");

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", authenticate, controller.me);

module.exports = router;
