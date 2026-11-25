const { formatResponse } = require("../utils/response");
const { Prisma } = require("@prisma/client");

const PRISMA_ERROR_MAP = {
  P2002: { status: 409, message: "Dữ liệu đã tồn tại (trùng giá trị duy nhất)" },
  P2003: { status: 400, message: "Dữ liệu tham chiếu không hợp lệ (sai khóa ngoại)" },
  P2025: { status: 404, message: "Không tìm thấy bản ghi" },
  // Hết kết nối trong pool (P2024) hoặc không bắt đầu được transaction (P2028): DB đang quá tải, thử lại được
  P2024: { status: 503, message: "Hệ thống đang bận, vui lòng thử lại sau ít giây" },
  P2028: { status: 503, message: "Hệ thống đang bận, vui lòng thử lại sau ít giây" },
};
const BUSY = PRISMA_ERROR_MAP.P2024;

module.exports = (err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = PRISMA_ERROR_MAP[err.code];
    if (mapped) {
      if (mapped.status === 503) {
        res.setHeader("Retry-After", "5");
        console.error(`[${req.id}] DB quá tải (${err.code})`);
      }
      return res.status(mapped.status).json(formatResponse(false, null, mapped.message));
    }
  }
  // Không kết nối được tới database
  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.setHeader("Retry-After", "5");
    console.error(`[${req.id}] Không kết nối được DB:`, err.errorCode || err.message);
    return res.status(BUSY.status).json(formatResponse(false, null, BUSY.message));
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.isOperational
    ? err.message
    : statusCode >= 400 && statusCode < 500
      ? "Yêu cầu không hợp lệ"
      : `Lỗi hệ thống, vui lòng thử lại sau (mã: ${req.id})`;

  if (statusCode >= 500) console.error(`[${req.id}]`, err);

  return res.status(statusCode).json(formatResponse(false, null, message));
};
