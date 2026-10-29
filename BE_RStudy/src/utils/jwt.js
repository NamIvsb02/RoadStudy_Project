const jwt = require("jsonwebtoken");

const signAccessToken = (payload) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" });

const signRefreshToken = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" });

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

// '15m' / '7d' / '30s' -> số mili-giây, dùng để tính expiresAt lưu DB
const parseDurationToMs = (str) => {
  const match = /^(\d+)([smhd])$/.exec(str);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const unitMs = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return Number(match[1]) * unitMs[match[2]];
};

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, parseDurationToMs };
