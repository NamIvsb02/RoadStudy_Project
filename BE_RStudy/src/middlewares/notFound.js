const AppError = require("../utils/AppError");

// Đặt SAU toàn bộ route, TRƯỚC errorHandler — bắt mọi URL không khớp route nào.
module.exports = (req, res, next) => {
  next(new AppError(`Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`, 404));
};
