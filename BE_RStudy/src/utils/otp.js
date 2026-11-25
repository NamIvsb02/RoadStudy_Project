const crypto = require("crypto");
const bcrypt = require("bcrypt");

const generateOtpCode = () => String(crypto.randomInt(100000, 1000000));
const hashOtp = (code) => bcrypt.hash(code, 10);
const compareOtp = (code, hash) => bcrypt.compare(code, hash);

module.exports = { generateOtpCode, hashOtp, compareOtp };
