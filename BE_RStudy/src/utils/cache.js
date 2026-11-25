const crypto = require("crypto");
const redis = require("../config/redis");

// Cache-aside cho các API đọc công khai (danh mục, khóa học, giáo viên). Redis chỉ là phần tăng tốc:
// Redis tắt hoặc lỗi thì gọi thẳng loader (DB), không bao giờ làm request lỗi.
//
// Làm mới bằng SỐ PHIÊN BẢN: mọi khóa cache có số phiên bản trong tên. Khi dữ liệu công khai đổi, bump() tăng số này lên,
// các khóa cũ tự thành "mồ côi" (không ai đọc nữa) rồi hết hạn theo TTL. Không phải xóa từng khóa, không bao giờ sót.
//
// Chống "bão cache" (nhiều request cùng lúc đọc một khóa vừa hết hạn, cùng đổ về DB): singleflight, các request giống nhau đang
// chờ dùng chung MỘT lần gọi loader. TTL có jitter (±20%) để các khóa không hết hạn cùng một lúc.
const TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS) || 60;
const VERSION_KEY = () => redis.key("cache", "version");

const inflight = new Map(); // khóa Redis -> Promise đang tải
let bumpPending = false; // có lần bump bị lỡ vì Redis lỗi: phải bump bù ngay khi Redis về, tránh phục vụ cache cũ

const stats = { hit: 0, miss: 0, error: 0, bump: 0 };

const jitter = (seconds) => Math.max(1, Math.round(seconds * (0.8 + Math.random() * 0.4)));

// Khóa ổn định theo nội dung tham số (sắp xếp tên trường), rút gọn bằng hash để khóa luôn ngắn
const hashParams = (params) => {
  const sorted = Object.keys(params || {})
    .sort()
    .reduce((acc, k) => ((acc[k] = params[k]), acc), {});
  return crypto.createHash("sha1").update(JSON.stringify(sorted)).digest("hex").slice(0, 20);
};

const readVersion = async () => {
  if (bumpPending) {
    await client().incr(VERSION_KEY());
    bumpPending = false;
  }
  return (await client().get(VERSION_KEY())) || "0";
};
const client = () => redis.client;

// Lấy từ cache; chưa có thì gọi loader rồi lưu. Loader ném lỗi (ví dụ 404) thì không cache gì cả.
// name: tên nhóm (ví dụ "course:list"), params: tham số làm khóa, ttl: giây (mặc định CACHE_TTL_SECONDS).
const getOrSet = async (name, params, loader, ttl = TTL_SECONDS) => {
  if (!redis.isReady()) return loader();

  let dataKey;
  try {
    dataKey = redis.key("cache", name, await readVersion(), hashParams(params));
    const cached = await client().get(dataKey);
    if (cached !== null) {
      stats.hit++;
      return JSON.parse(cached);
    }
  } catch {
    stats.error++;
    return loader();
  }

  stats.miss++;
  if (inflight.has(dataKey)) return inflight.get(dataKey);
  const loading = (async () => {
    const value = await loader();
    // Ghi cache là phần phụ: lỗi Redis không được làm hỏng kết quả vừa tải xong
    client()
      .set(dataKey, JSON.stringify(value), "EX", jitter(ttl))
      .catch(() => {
        stats.error++;
      });
    return value;
  })().finally(() => inflight.delete(dataKey));
  inflight.set(dataKey, loading);
  return loading;
};

// Gọi khi dữ liệu công khai thay đổi. Không bao giờ ném lỗi; Redis không sẵn sàng thì nhớ để bump bù sau.
const bump = async () => {
  if (!redis.isEnabled()) return;
  stats.bump++;
  if (!redis.isReady()) {
    bumpPending = true;
    return;
  }
  try {
    await client().incr(VERSION_KEY());
  } catch {
    bumpPending = true;
  }
};

module.exports = { getOrSet, bump, stats, hashParams };
