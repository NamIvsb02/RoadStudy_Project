// Tạo access token hợp lệ cho các bài test (không cần đăng nhập qua OTP).
// authMiddleware chỉ đọc { sub, role } từ token, nên test chỉ cần token có hai trường đó.
// Cách làm: thử lần lượt các cách tạo token (hàm ký có sẵn của dự án, rồi jsonwebtoken với
// JWT_ACCESS_SECRET) và chỉ nhận cách nào mà verifyAccessToken của dự án xác nhận đúng sub và role.
require('dotenv').config();
const jwtUtil = require('../../src/utils/jwt');

let jsonwebtoken = null;
try {
  jsonwebtoken = require('jsonwebtoken');
} catch (_) {}

const cache = new Map();
let strategy = null;

const verifies = (token, sub, role) => {
  try {
    const payload = jwtUtil.verifyAccessToken(token);
    return !!payload && String(payload.sub) === String(sub) && payload.role === role;
  } catch (_) {
    return false;
  }
};

const asToken = (value) =>
  typeof value === 'string' ? value : (value && (value.accessToken || value.token)) || null;

const buildCandidates = () => {
  const list = [];
  const isSigner = (name) =>
    typeof jwtUtil[name] === 'function' &&
    /sign|generate|create|issue|token/i.test(name) &&
    !/verify|decode|refresh/i.test(name);
  const names = Object.keys(jwtUtil).filter(isSigner);
  for (const name of names) {
    list.push((sub, role) => asToken(jwtUtil[name]({ sub, role })));
    list.push((sub, role) => asToken(jwtUtil[name]({ id: sub, role })));
    list.push((sub, role) => asToken(jwtUtil[name]({ accountId: sub, role })));
    list.push((sub, role) => asToken(jwtUtil[name](sub, role)));
    list.push((sub, role) => asToken(jwtUtil[name]({ id: sub, role, email: 'test@example.com' })));
  }
  if (jsonwebtoken && process.env.JWT_ACCESS_SECRET) {
    for (const extra of [{}, { type: 'access' }]) {
      list.push((sub, role) =>
        jsonwebtoken.sign({ sub, role, ...extra }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' })
      );
    }
  }
  return list;
};

const makeToken = (sub, role) => {
  const key = `${sub}|${role}`;
  if (cache.has(key)) return cache.get(key);

  let token = null;
  if (strategy) {
    token = strategy(sub, role);
  } else {
    for (const candidate of buildCandidates()) {
      try {
        const t = candidate(sub, role);
        if (t && verifies(t, sub, role)) {
          strategy = candidate;
          token = t;
          break;
        }
      } catch (_) {}
    }
  }
  if (!token) {
    throw new Error(
      'Không tạo được token thử nghiệm. Hãy gửi nội dung src/utils/jwt.js để chỉnh tests/helpers/auth.js cho khớp.'
    );
  }
  cache.set(key, token);
  return token;
};

// Header đăng nhập cho một lần gọi API. Không có role thì không gửi gì (gọi công khai).
// who = mã tài khoản (sub); nếu bỏ trống sẽ dùng một mã giả cho vai trò đó (ví dụ quản trị viên).
const authHeaders = ({ who, role } = {}) =>
  role ? { Authorization: `Bearer ${makeToken(who || `test-${role.toLowerCase()}`, role)}` } : {};

module.exports = { makeToken, authHeaders };