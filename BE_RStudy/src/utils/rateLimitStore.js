const { MemoryStore } = require("express-rate-limit");
const redis = require("../config/redis");

// Tăng bộ đếm nguyên tử trong một lệnh: INCR, đặt hạn khi là lần đầu (hoặc khóa mất hạn), trả [số lần, ms còn lại].
// Chạy trong Lua nên nhiều request/nhiều instance cùng lúc vẫn đếm đúng, không mất lượt.
const INCREMENT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
local ttl = redis.call('PTTL', KEYS[1])
if count == 1 or ttl < 0 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end
return { count, ttl }
`;

// Store cho express-rate-limit: đếm bằng Redis để mọi instance dùng chung bộ đếm và không mất khi khởi động lại;
// khi Redis tắt, chưa sẵn sàng hoặc lỗi thì tự lùi về bộ đếm trong RAM của chính instance này (vẫn có giới hạn, chỉ không dùng chung).
// Mỗi limiter truyền một `name` riêng để khóa không đè nhau.
class RedisFallbackStore {
  // Khóa do mỗi instance tự đếm trong RAM thì không dùng chung được; false báo cho express-rate-limit biết bộ đếm dùng chung
  localKeys = false;

  constructor({ name }) {
    this.name = name;
    this.memory = new MemoryStore();
  }

  init(options) {
    this.windowMs = options.windowMs;
    this.memory.init(options);
  }

  redisKey(key) {
    return redis.key("ratelimit", this.name, key);
  }

  async increment(key) {
    if (redis.isReady()) {
      try {
        const [totalHits, ttl] = await redis.client.eval(INCREMENT_SCRIPT, 1, this.redisKey(key), this.windowMs);
        return { totalHits, resetTime: new Date(Date.now() + ttl) };
      } catch {
        // Redis lỗi hoặc quá hạn lệnh: đếm bằng RAM cho request này
      }
    }
    return this.memory.increment(key);
  }

  async decrement(key) {
    this.memory.decrement(key);
    if (redis.isReady()) {
      await redis.client.eval("if redis.call('EXISTS', KEYS[1]) == 1 then return redis.call('DECR', KEYS[1]) end return 0", 1, this.redisKey(key)).catch(() => {});
    }
  }

  async resetKey(key) {
    this.memory.resetKey(key);
    if (redis.isReady()) await redis.client.del(this.redisKey(key)).catch(() => {});
  }

  shutdown() {
    this.memory.shutdown();
  }
}

module.exports = { RedisFallbackStore };
