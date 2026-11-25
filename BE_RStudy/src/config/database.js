const { PrismaClient } = require("@prisma/client");

// Đặt hoặc thay một tham số trong chuỗi kết nối bằng cách thao tác chuỗi, không phân tích lại URL
// (tránh làm đổi cách mã hóa ký tự đặc biệt trong mật khẩu).
const setParam = (url, key, value) => {
  const pattern = new RegExp(`([?&])${key}=[^&]*`);
  if (pattern.test(url)) return url.replace(pattern, `$1${key}=${value}`);
  return `${url}${url.includes("?") ? "&" : "?"}${key}=${value}`;
};

// Kích thước pool kết nối. Prisma mặc định chỉ mở (số CPU x 2 + 1) kết nối, thường chỉ 9, nên khi mỗi truy vấn
// mất ~165ms tới Supabase thì cả hệ thống chỉ làm được ~10 request/giây. Đặt DB_CONNECTION_LIMIT / DB_POOL_TIMEOUT để chỉnh
// mà không phải sửa DATABASE_URL (biến môi trường được ưu tiên hơn tham số có sẵn trong URL).
const buildDatasourceUrl = (url = process.env.DATABASE_URL) => {
  if (!url) return url;
  const limit = Number(process.env.DB_CONNECTION_LIMIT);
  const timeout = Number(process.env.DB_POOL_TIMEOUT);
  let result = url;
  if (Number.isInteger(limit) && limit > 0) result = setParam(result, "connection_limit", limit);
  if (Number.isInteger(timeout) && timeout > 0) result = setParam(result, "pool_timeout", timeout);
  return result;
};

const prisma = new PrismaClient({
  datasourceUrl: buildDatasourceUrl(),
  // Transaction chờ lấy kết nối tối đa 10 giây (mặc định 2 giây là quá ngắn khi DB ở xa) và chạy tối đa 15 giây
  transactionOptions: { maxWait: 10000, timeout: 15000 },
});

module.exports = prisma;
module.exports.buildDatasourceUrl = buildDatasourceUrl;
