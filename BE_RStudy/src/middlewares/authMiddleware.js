const { verifyAccessToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Thiếu token xác thực", 401));
  }
  try {
    const payload = verifyAccessToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new AppError("Token không hợp lệ hoặc hết hạn", 401));
  }
};

// authorize('TEACHER', 'ADMINISTRATOR'): chặn nếu role không nằm trong danh sách
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
