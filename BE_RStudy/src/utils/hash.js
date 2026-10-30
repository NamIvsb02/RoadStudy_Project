const bcrypt = require("bcrypt");
const crypto = require("crypto");
const SALT_ROUNDS = 10;

const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);
const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);

// Dùng để lưu/so khớp refresh token trong DB — bcrypt không tra cứu
// trực tiếp theo giá trị được (salted), nên refresh token dùng sha256.
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

module.exports = { hashPassword, comparePassword, sha256 };
