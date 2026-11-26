const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");
const validate = require("../middlewares/validateMiddleware");
const { authenticate } = require("../middlewares/authMiddleware");
const { authIpLimiter, authCredentialLimiter } = require("../middlewares/rateLimitMiddleware");
const { registerSchema, loginSchema, verifyEmailSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema } = require("../validators/authValidator");

router.use(authIpLimiter);

router.post("/register", validate(registerSchema), controller.register);
router.post("/verify-email", authCredentialLimiter, validate(verifyEmailSchema), controller.verifyEmail);
router.post("/resend-otp", authCredentialLimiter, validate(resendOtpSchema), controller.resendOtp);
router.post("/login", authCredentialLimiter, validate(loginSchema), controller.login);
router.post("/refresh", validate(refreshTokenSchema), controller.refresh);
router.post("/logout", authenticate, validate(refreshTokenSchema), controller.logout);
router.post("/forgot-password", authCredentialLimiter, validate(forgotPasswordSchema), controller.forgotPassword);
router.post("/reset-password", authCredentialLimiter, validate(resetPasswordSchema), controller.resetPassword);
router.post("/change-password", authenticate, validate(changePasswordSchema), controller.changePassword);
router.get("/me", authenticate, controller.me);

module.exports = router;
