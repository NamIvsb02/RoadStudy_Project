const prisma = require("../config/database");

const ACCOUNT_SAFE_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  avatarUrl: true,
  role: true,
  status: true,
  createdAt: true,
  student: true,
  teacher: true,
  administrator: true,
};

const findByEmail = (email) => prisma.account.findUnique({ where: { email }, include: { teacher: { select: { approvalStatus: true } } } });
const findById = (id) => prisma.account.findUnique({ where: { id } });
const findByIdSafe = (id) => prisma.account.findUnique({ where: { id }, select: ACCOUNT_SAFE_SELECT });

const createStudentAccount = (data) =>
  prisma.account.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash,
      phoneNumber: data.phoneNumber,
      role: "STUDENT",
      student: { create: { dateOfBirth: data.dateOfBirth, gender: data.gender, address: data.address } },
    },
    select: ACCOUNT_SAFE_SELECT,
  });

const createTeacherAccount = (data) =>
  prisma.account.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash,
      phoneNumber: data.phoneNumber,
      role: "TEACHER",
      teacher: { create: { specialization: data.specialization, biography: data.biography, teachingExperience: data.teachingExperience } },
    },
    select: ACCOUNT_SAFE_SELECT,
  });

const updateAccountStatus = (id, status) => prisma.account.update({ where: { id }, data: { status } });
const updateAccountPassword = (id, passwordHash) => prisma.account.update({ where: { id }, data: { passwordHash } });

const createOtp = (accountId, purpose, codeHash, expiresAt) => prisma.otpCode.create({ data: { accountId, purpose, codeHash, expiresAt } });

const findLatestValidOtp = (accountId, purpose) =>
  prisma.otpCode.findFirst({
    where: { accountId, purpose, consumedAt: null, expiresAt: { gt: new Date() }, attempts: { lt: 5 } },
    orderBy: { createdAt: "desc" },
  });

// Bản ghi OTP mới nhất (kể cả đã hết hạn/đã dùng): để tính thời gian chờ gửi lại
const findLatestOtp = (accountId, purpose) => prisma.otpCode.findFirst({ where: { accountId, purpose }, orderBy: { createdAt: "desc" } });

const incrementOtpAttempts = (id) => prisma.otpCode.update({ where: { id }, data: { attempts: { increment: 1 } } });

// Chỉ dùng được một lần: request song song đến sau nhận false
const consumeOtp = async (id) => {
  const r = await prisma.otpCode.updateMany({ where: { id, consumedAt: null }, data: { consumedAt: new Date() } });
  return r.count === 1;
};

const createRefreshToken = (accountId, tokenHash, expiresAt) => prisma.refreshToken.create({ data: { accountId, tokenHash, expiresAt } });

const findValidRefreshToken = (accountId, tokenHash) => prisma.refreshToken.findFirst({ where: { accountId, tokenHash, revokedAt: null, expiresAt: { gt: new Date() } } });

const findRefreshTokenByHash = (tokenHash) => prisma.refreshToken.findFirst({ where: { tokenHash, revokedAt: null } });

// Chỉ thu hồi được token còn hiệu lực: request song song đến sau nhận false
const revokeRefreshToken = async (id) => {
  const r = await prisma.refreshToken.updateMany({ where: { id, revokedAt: null }, data: { revokedAt: new Date() } });
  return r.count === 1;
};

const findRefreshTokenByHashAnyState = (tokenHash) => prisma.refreshToken.findUnique({ where: { tokenHash } });

const revokeAllRefreshTokens = (accountId) => prisma.refreshToken.updateMany({ where: { accountId, revokedAt: null }, data: { revokedAt: new Date() } });

module.exports = {
  findByEmail,
  findById,
  findByIdSafe,
  createStudentAccount,
  createTeacherAccount,
  updateAccountStatus,
  updateAccountPassword,
  createOtp,
  findLatestValidOtp,
  findLatestOtp,
  incrementOtpAttempts,
  consumeOtp,
  createRefreshToken,
  findValidRefreshToken,
  findRefreshTokenByHash,
  revokeRefreshToken,
  findRefreshTokenByHashAnyState,
  revokeAllRefreshTokens,
};
