const bcrypt = require("bcrypt");

const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));
const hashOtp = (code) => bcrypt.hash(code, 10);
const compareOtp = (code, hash) => bcrypt.compare(code, hash);

module.exports = { generateOtpCode, hashOtp, compareOtp };
