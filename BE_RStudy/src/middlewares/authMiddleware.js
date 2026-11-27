const { verifyAccessToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Thiếu token xác thực", 401));
  }
  return readToken(header, req, next);
};

// Cho API công khai: không có token thì coi là khách, có token thì phải hợp lệ như authenticate
const optionalAuthenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return next();
  return readToken(header, req, next);
};

function readToken(header, req, next) {
  try {
    const payload = verifyAccessToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new AppError("Token không hợp lệ hoặc hết hạn", 401));
  }
}

const authorize = (...roles) => {
  const middleware = (req, res, next) => {
    if (!req.user) return next(new AppError("Chưa xác thực", 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Không đủ quyền truy cập", 403));
    }
    next();
  };
  middleware.apiDoc = { roles }; // cho Swagger
  return middleware;
};

module.exports = { authenticate, optionalAuthenticate, authorize };
