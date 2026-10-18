const authRepository = require("../repositories/authRepository");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signAccessToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

const register = async (payload) => {
  const existing = await authRepository.findByEmail(payload.email);
  if (existing) throw new AppError("Email đã được sử dụng", 409);

  const passwordHash = await hashPassword(payload.password);
  const data = { ...payload, passwordHash };

  return payload.role === "TEACHER" ? authRepository.createTeacherAccount(data) : authRepository.createStudentAccount(data);
};

const login = async (email, password) => {
  const account = await authRepository.findByEmail(email);
  if (!account) throw new AppError("Email hoặc mật khẩu không đúng", 401);

  const match = await comparePassword(password, account.passwordHash);
  if (!match) throw new AppError("Email hoặc mật khẩu không đúng", 401);

  if (account.status === "BI_KHOA") throw new AppError("Tài khoản đã bị khóa", 403);

  // CHO_XAC_MINH vẫn được đăng nhập (OTP xác minh mail chưa làm — STT 14)
  const accessToken = signAccessToken({ sub: account.id, role: account.role });

  const { passwordHash, ...safeAccount } = account;
  return { accessToken, account: safeAccount };
};

const getMe = async (accountId) => {
  const account = await authRepository.findByIdSafe(accountId);
  if (!account) throw new AppError("Không tìm thấy tài khoản", 404);
  return account;
};

module.exports = { register, login, getMe };
