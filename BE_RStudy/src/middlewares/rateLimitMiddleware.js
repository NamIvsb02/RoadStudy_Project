const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { formatResponse } = require("../utils/response");
const { RedisFallbackStore } = require("../utils/rateLimitStore");

const MESSAGE = "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút";

// name: tên riêng của limiter, dùng làm phần khóa trong Redis. Bộ đếm nằm trong Redis khi có (dùng chung mọi instance),
// không thì trong RAM của instance này.
const buildLimiter = ({ name, ...options }) =>
  rateLimit({
    windowMs: 60 * 1000,
    store: new RedisFallbackStore({ name }),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json(formatResponse(false, null, MESSAGE)),
    ...options,
  });

// Toàn bộ /api/auth: 60 lần/phút theo IP
const authIpLimiter = buildLimiter({ name: "auth-ip", limit: 60 });

// Đăng nhập, xác minh, đặt lại mật khẩu, gửi OTP: 10 lần/phút theo IP + email
// (khóa theo cả email để cả lớp dùng chung một wifi không bị chặn oan)
const authCredentialLimiter = buildLimiter({
  name: "auth-credential",
  limit: 10,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${String(req.body?.email ?? "").toLowerCase()}`,
});

// Thao tác ghi nội dung (bình luận, đánh giá, báo cáo, upload): 10 lần/phút theo tài khoản.
// Chỉ gắn SAU authenticate vì cần req.user.
const contentWriteLimiter = buildLimiter({
  name: "content-write",
  limit: 10,
  keyGenerator: (req) => req.user.id,
});

module.exports = { authIpLimiter, authCredentialLimiter, contentWriteLimiter };
