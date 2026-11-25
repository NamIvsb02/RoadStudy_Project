const Redis = require("ioredis");

// Redis chỉ là phần tăng tốc (cache, bộ đếm rate limit dùng chung), không phải nguồn dữ liệu chính.
// - REDIS_URL trống: tắt hoàn toàn, hệ thống chạy như trước (client = null).
// - Redis lỗi hoặc chưa kết nối: lệnh báo lỗi ngay (không xếp hàng chờ), nơi gọi tự lùi về DB hoặc RAM.
const url = (process.env.REDIS_URL || "").trim();
const enabled = url.length > 0;

// Tiền tố khóa theo môi trường để dev, test và prod dùng chung một Redis cũng không đè khóa của nhau.
// Mọi khóa phải đi qua key(), ví dụ key("cache", "course", "list") -> "roadstudy:dev:cache:course:list".
const prefix = `roadstudy:${process.env.REDIS_KEY_ENV || process.env.NODE_ENV || "dev"}`;
const key = (...parts) => [prefix, ...parts].join(":");

let client = null;
let lastErrorLogAt = 0;

if (enabled) {
  client = new Redis(url, {
    connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS) || 2000,
    commandTimeout: Number(process.env.REDIS_COMMAND_TIMEOUT_MS) || 300,
    // Không xếp lệnh vào hàng đợi khi mất kết nối: để request đi tiếp bằng DB thay vì chờ treo
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    // Tự nối lại với thời gian chờ tăng dần, tối đa 5 giây
    retryStrategy: (times) => Math.min(times * 200, 5000),
  });
  // Bắt buộc có handler 'error', nếu không lỗi mạng sẽ làm sập process. Ghi log tối đa 1 lần mỗi 30 giây để không tràn log.
  client.on("error", (err) => {
    const now = Date.now();
    if (now - lastErrorLogAt > 30000) {
      lastErrorLogAt = now;
      console.error("Redis lỗi:", err.code || err.message);
    }
  });
  client.on("ready", () => console.log("Redis đã sẵn sàng"));
}

const isEnabled = () => enabled;
const isReady = () => enabled && client.status === "ready";

// Trả "disabled" | "ok" | "down" cho health check. Không bao giờ ném lỗi.
const checkHealth = async () => {
  if (!enabled) return "disabled";
  if (!isReady()) return "down";
  try {
    return (await client.ping()) === "PONG" ? "ok" : "down";
  } catch {
    return "down";
  }
};

// Đóng kết nối khi tắt server: chờ lệnh đang chạy xong, quá hạn thì cắt hẳn
const close = async () => {
  if (!enabled || client.status === "end") return;
  try {
    await client.quit();
  } catch {
    client.disconnect();
  }
};

module.exports = { client, key, isEnabled, isReady, checkHealth, close };
