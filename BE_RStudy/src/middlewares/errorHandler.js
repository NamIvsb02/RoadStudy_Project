const { formatResponse } = require("../utils/response");
const { Prisma } = require("@prisma/client");

const PRISMA_ERROR_MAP = {
  P2002: { status: 409, message: "Dữ liệu đã tồn tại (trùng giá trị duy nhất)" },
  P2003: { status: 400, message: "Dữ liệu tham chiếu không hợp lệ (sai khóa ngoại)" },
  P2025: { status: 404, message: "Không tìm thấy bản ghi" },
};

module.exports = (err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = PRISMA_ERROR_MAP[err.code];
    if (mapped) {
      return res.status(mapped.status).json(formatResponse(false, null, mapped.message));
    }
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Lỗi hệ thống, vui lòng thử lại sau";

  if (!err.isOperational && !(err instanceof Prisma.PrismaClientKnownRequestError)) {
    console.error(err);
  }

  return res.status(statusCode).json(formatResponse(false, null, message));
};
