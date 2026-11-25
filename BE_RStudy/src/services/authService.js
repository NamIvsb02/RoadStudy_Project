const crypto = require("crypto");
const authRepository = require("../repositories/authRepository");
const { hashPassword, comparePassword, sha256 } = require("../utils/hash");
const { signAccessToken, signRefreshToken, verifyRefreshToken, parseDurationToMs } = require("../utils/jwt");
const { generateOtpCode, hashOtp, compareOtp } = require("../utils/otp");
const { sendMail } = require("../config/mail");
const AppError = require("../utils/AppError");
const adminService = require("./adminService");
const notificationService = require("./notificationService");
const { PERMISSIONS } = require("../constants/permissions");

const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES) || 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_SECONDS = 60;
const REFRESH_REUSE_GRACE_MS = 10 * 1000; // hai tab refresh gần như cùng lúc không bị coi là dùng lại token

// Luồng quên mật khẩu: không báo "chờ N giây" để không lộ email nào đã đăng ký
const sendOtpQuietly = async (accountId, email, purpose) => {
  try {
    await sendOtp(accountId, email, purpose);
  } catch (err) {
    if (err.statusCode !== 429) throw err;
  }
};

const sendOtp = async (accountId, email, purpose) => {
  const latest = await authRepository.findLatestOtp(accountId, purpose);
  if (latest) {
    const waitSeconds = Math.ceil((latest.createdAt.getTime() + OTP_RESEND_SECONDS * 1000 - Date.now()) / 1000);
    if (waitSeconds > 0) throw new AppError(`Vui lòng đợi ${waitSeconds} giây trước khi yêu cầu mã mới`, 429);
  }
  const code = generateOtpCode();
  const codeHash = await hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);
  await authRepository.createOtp(accountId, purpose, codeHash, expiresAt);

  const subject = purpose === "XAC_MINH_EMAIL" ? "Xác minh email RoadStudy" : "Đặt lại mật khẩu RoadStudy";
  const text = `Mã xác thực của bạn là: ${code} (hết hạn sau ${OTP_EXPIRES_MINUTES} phút)`;
  await sendMail({ to: email, subject, text });
};

const issueTokenPair = async (account) => {
  const accessToken = signAccessToken({ sub: account.id, role: account.role });
  const refreshToken = signRefreshToken({ sub: account.id, jti: crypto.randomUUID() });
  const expiresAt = new Date(Date.now() + parseDurationToMs(process.env.JWT_REFRESH_EXPIRES || "7d"));
  await authRepository.createRefreshToken(account.id, sha256(refreshToken), expiresAt);
  return { accessToken, refreshToken };
};

const register = async (payload) => {
  const existing = await authRepository.findByEmail(payload.email);
  if (existing) throw new AppError("Email đã được sử dụng", 409);

  const passwordHash = await hashPassword(payload.password);
  const data = { ...payload, passwordHash };

  const account = payload.role === "TEACHER" ? await authRepository.createTeacherAccount(data) : await authRepository.createStudentAccount(data);

  try {
    await sendOtp(account.id, account.email, "XAC_MINH_EMAIL");
  } catch (err) {
    console.error("Gửi OTP thất bại:", err.message);
  }
  return account;
};

// Kiểm tra mã OTP: tối đa 5 lần sai mỗi mã, mỗi mã chỉ dùng một lần
const checkOtp = async (accountId, purpose, code) => {
  const otp = await authRepository.findLatestValidOtp(accountId, purpose);
  if (!otp) throw new AppError("Mã xác thực không đúng hoặc đã hết hạn", 400);
  if (!(await compareOtp(code, otp.codeHash))) {
    await authRepository.incrementOtpAttempts(otp.id);
    if (otp.attempts + 1 >= OTP_MAX_ATTEMPTS) {
      throw new AppError("Bạn đã nhập sai quá nhiều lần, vui lòng yêu cầu mã mới", 400);
    }
    throw new AppError("Mã xác thực không đúng", 400);
  }
  if (!(await authRepository.consumeOtp(otp.id))) throw new AppError("Mã xác thực không đúng hoặc đã hết hạn", 400);
};

const verifyEmail = async (email, code) => {
  const account = await authRepository.findByEmail(email);
  if (!account) throw new AppError("Tài khoản không tồn tại", 404);
  if (account.status !== "CHO_XAC_MINH") throw new AppError("Tài khoản đã được xác minh trước đó", 400);

  await checkOtp(account.id, "XAC_MINH_EMAIL", code);
  await authRepository.updateAccountStatus(account.id, "HOAT_DONG");
  if (account.role === "TEACHER") {
    await notificationService.notifyAdmins(PERMISSIONS.DUYET_GIAO_VIEN, {
      type: "TEACHER_PENDING",
      title: "Có giáo viên mới chờ duyệt",
      body: account.fullName,
      link: "/admin/teacher-approval",
    });
  }
  return { message: "Xác minh email thành công" };
};

const resendOtp = async (email, purpose) => {
  const account = await authRepository.findByEmail(email);
  if (!account) return { message: "Nếu email tồn tại, mã xác thực đã được gửi" };
  if (purpose === "XAC_MINH_EMAIL" && account.status !== "CHO_XAC_MINH") {
    throw new AppError("Tài khoản đã được xác minh trước đó", 400);
  }
  // Chỉ luồng xác minh email báo thời gian chờ (email vừa đăng ký, đã lộ qua 409 ở register)
  if (purpose === "XAC_MINH_EMAIL") await sendOtp(account.id, account.email, purpose);
  else await sendOtpQuietly(account.id, account.email, purpose);
  return { message: "Mã xác thực đã được gửi tới email" };
};

const assertTeacherApproved = (account) => {
  if (account.role !== "TEACHER") return;
  const approvalStatus = account.teacher?.approvalStatus;
  if (approvalStatus === "TU_CHOI") throw new AppError("Tài khoản giáo viên đã bị từ chối", 403);
  if (approvalStatus !== "DA_DUYET") throw new AppError("Tài khoản giáo viên đang chờ quản trị viên duyệt", 403);
};

const login = async (email, password) => {
  const account = await authRepository.findByEmail(email);
  if (!account) throw new AppError("Email hoặc mật khẩu không đúng", 401);
  if (!(await comparePassword(password, account.passwordHash))) {
    throw new AppError("Email hoặc mật khẩu không đúng", 401);
  }
  if (account.status === "BI_KHOA") throw new AppError("Tài khoản đã bị khóa", 403);
  if (account.status === "CHO_XAC_MINH") {
    throw new AppError("Tài khoản chưa xác minh email, vui lòng kiểm tra email hoặc yêu cầu gửi lại mã", 403);
  }
  assertTeacherApproved(account);

  const tokens = await issueTokenPair(account);
  const { passwordHash, teacher, ...safeAccount } = account;
  return { ...tokens, account: safeAccount };
};

const refreshAccessToken = async (refreshTokenValue) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshTokenValue);
  } catch {
    throw new AppError("Refresh token không hợp lệ hoặc hết hạn", 401);
  }

  const tokenHash = sha256(refreshTokenValue);
  const record = await authRepository.findValidRefreshToken(payload.sub, tokenHash);
  if (!record) {
    // Token đã thu hồi từ lâu mà vẫn bị gửi lại: nghi bị đánh cắp, thu hồi mọi phiên của tài khoản
    const used = await authRepository.findRefreshTokenByHashAnyState(tokenHash);
    if (used && used.revokedAt && Date.now() - used.revokedAt.getTime() > REFRESH_REUSE_GRACE_MS) {
      await authRepository.revokeAllRefreshTokens(used.accountId);
      throw new AppError("Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại", 401);
    }
    throw new AppError("Refresh token không hợp lệ hoặc đã bị thu hồi", 401);
  }

  // Xoay vòng nguyên tử: hai request cùng token thì chỉ một request thành công.
  // Không thu hồi toàn bộ ở nhánh này để tránh đăng xuất nhầm khi hai tab refresh cùng lúc.
  if (!(await authRepository.revokeRefreshToken(record.id))) {
    throw new AppError("Refresh token không hợp lệ hoặc đã bị thu hồi", 401);
  }

  const account = await authRepository.findByIdSafe(payload.sub);
  if (!account || account.status === "BI_KHOA") throw new AppError("Tài khoản không khả dụng", 403);
  assertTeacherApproved(account);
  return issueTokenPair(account);
};

const logout = async (refreshTokenValue) => {
  const tokenHash = sha256(refreshTokenValue);
  const record = await authRepository.findRefreshTokenByHash(tokenHash);
  if (record) await authRepository.revokeRefreshToken(record.id);
  return { message: "Đăng xuất thành công" };
};

const forgotPassword = async (email) => {
  const account = await authRepository.findByEmail(email);
  if (account && account.status !== "BI_KHOA") {
    await sendOtpQuietly(account.id, account.email, "QUEN_MAT_KHAU");
  }
  return { message: "Nếu email tồn tại trong hệ thống, mã đặt lại mật khẩu đã được gửi" };
};

const resetPassword = async (email, code, newPassword) => {
  const account = await authRepository.findByEmail(email);
  if (!account) throw new AppError("Mã xác thực không đúng hoặc đã hết hạn", 400);

  await checkOtp(account.id, "QUEN_MAT_KHAU", code);
  const passwordHash = await hashPassword(newPassword);
  await authRepository.updateAccountPassword(account.id, passwordHash);
  await authRepository.revokeAllRefreshTokens(account.id);
  return { message: "Đặt lại mật khẩu thành công" };
};

const changePassword = async (accountId, oldPassword, newPassword) => {
  const account = await authRepository.findById(accountId);
  if (!account) throw new AppError("Không tìm thấy tài khoản", 404);
  if (!(await comparePassword(oldPassword, account.passwordHash))) {
    throw new AppError("Mật khẩu hiện tại không đúng", 400);
  }
  const passwordHash = await hashPassword(newPassword);
  await authRepository.updateAccountPassword(accountId, passwordHash);
  await authRepository.revokeAllRefreshTokens(accountId);
  return { message: "Đổi mật khẩu thành công" };
};

const getMe = async (accountId) => {
  const account = await authRepository.findByIdSafe(accountId);
  if (!account) throw new AppError("Không tìm thấy tài khoản", 404);
  if (account.role !== "ADMINISTRATOR") return account;
  const access = await adminService.getAccessByAccountId(accountId);
  return { ...account, ...access };
};

module.exports = {
  register,
  verifyEmail,
  resendOtp,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};
