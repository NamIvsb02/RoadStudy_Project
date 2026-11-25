const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { formatResponse } = require("../utils/response");

const MESSAGE = "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút";

const buildLimiter = (options) =>
  rateLimit({
    windowMs: 60 * 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json(formatResponse(false, null, MESSAGE)),
    ...options,
  });

// Toàn bộ /api/auth: 60 lần/phút theo IP
const authIpLimiter = buildLimiter({ limit: 60 });

// Đăng nhập, xác minh, đặt lại mật khẩu, gửi OTP: 10 lần/phút theo IP + email
// (khóa theo cả email để cả lớp dùng chung một wifi không bị chặn oan)
const authCredentialLimiter = buildLimiter({
  limit: 10,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${String(req.body?.email ?? "").toLowerCase()}`,
});

// Thao tác ghi nội dung (bình luận, đánh giá, báo cáo, upload): 10 lần/phút theo tài khoản.
// Chỉ gắn SAU authenticate vì cần req.user.
const contentWriteLimiter = buildLimiter({
  limit: 10,
  keyGenerator: (req) => req.user.id,
});

module.exports = { authIpLimiter, authCredentialLimiter, contentWriteLimiter };
