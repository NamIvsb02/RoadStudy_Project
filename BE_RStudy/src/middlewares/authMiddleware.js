const { verifyAccessToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

// authenticate: xác định req.user = { id, role }
// Khi DEV_AUTH_BYPASS=true và KHÔNG có header Authorization, tạo user giả
// qua header x-dev-role (STUDENT/TEACHER/ADMIN), mặc định STUDENT — để các
// module khác test được API cần đăng nhập trước khi Auth thật xong.
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    if (process.env.DEV_AUTH_BYPASS === "true") {
      req.user = {
        id: req.headers["x-dev-user-id"] || "dev-user-id",
        role: req.headers["x-dev-role"] || "STUDENT",
      };
      return next();
    }
    return next(new AppError("Thiếu token xác thực", 401));
  }

  const token = header.replace("Bearer ", "");
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new AppError("Token không hợp lệ hoặc hết hạn", 401));
  }
};

// authorize('TEACHER', 'ADMIN') — chặn nếu role không nằm trong danh sách
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return next(new AppError("Chưa xác thực", 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Không đủ quyền truy cập", 403));
    }
    next();
  };

module.exports = { authenticate, authorize };
