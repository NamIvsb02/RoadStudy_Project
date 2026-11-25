const { PrismaClient } = require("@prisma/client");
const cache = require("../utils/cache");

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

const client = new PrismaClient({
  datasourceUrl: buildDatasourceUrl(),
  // Transaction chờ lấy kết nối tối đa 10 giây (mặc định 2 giây là quá ngắn khi DB ở xa) và chạy tối đa 15 giây
  transactionOptions: { maxWait: 10000, timeout: 15000 },
});

// Làm mới cache công khai ở MỘT chỗ: mọi lệnh ghi vào bảng ảnh hưởng tới API công khai (danh mục, khóa học, giáo viên, đánh giá)
// đều tăng số phiên bản cache, nên không service hay script nào có thể quên. Ghi vào Account chỉ tính khi đổi tên, ảnh hoặc trạng thái
// (đổi mật khẩu, lưu OTP, đăng nhập không làm mới cache).
const WRITE_OPERATIONS = new Set(["create", "createMany", "createManyAndReturn", "update", "updateMany", "updateManyAndReturn", "upsert", "delete", "deleteMany"]);
const PUBLIC_MODELS = new Set(["Course", "Category", "Teacher", "Review"]);
const PUBLIC_ACCOUNT_FIELDS = ["fullName", "avatarUrl", "status"];
const affectsPublicData = (model, operation, args) => {
  if (PUBLIC_MODELS.has(model)) return true;
  if (model !== "Account") return false;
  if (operation === "delete" || operation === "deleteMany") return true;
  const data = args?.data || args?.update || {};
  return PUBLIC_ACCOUNT_FIELDS.some((field) => field in data);
};

const prisma = client.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args);
        if (WRITE_OPERATIONS.has(operation) && affectsPublicData(model, operation, args)) await cache.bump();
        return result;
      },
    },
  },
});

module.exports = prisma;
module.exports.buildDatasourceUrl = buildDatasourceUrl;
