const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate } = require("../middlewares/authMiddleware");
const { registerSchema, loginSchema, verifyEmailSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema } = require("../validators/authValidator");

router.post("/register", validate(registerSchema), controller.register);
router.post("/verify-email", validate(verifyEmailSchema), controller.verifyEmail);
router.post("/resend-otp", validate(resendOtpSchema), controller.resendOtp);
router.post("/login", validate(loginSchema), controller.login);
router.post("/refresh", validate(refreshTokenSchema), controller.refresh);
router.post("/logout", authenticate, validate(refreshTokenSchema), controller.logout);
router.post("/forgot-password", validate(forgotPasswordSchema), controller.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), controller.resetPassword);
router.post("/change-password", authenticate, validate(changePasswordSchema), controller.changePassword);
router.get("/me", authenticate, controller.me);

module.exports = router;
