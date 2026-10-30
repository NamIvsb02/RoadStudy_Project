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

const findByEmail = (email) => prisma.account.findUnique({ where: { email } });
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
    where: { accountId, purpose, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

const consumeOtp = (id) => prisma.otpCode.update({ where: { id }, data: { consumedAt: new Date() } });

const createRefreshToken = (accountId, tokenHash, expiresAt) => prisma.refreshToken.create({ data: { accountId, tokenHash, expiresAt } });

const findValidRefreshToken = (accountId, tokenHash) => prisma.refreshToken.findFirst({ where: { accountId, tokenHash, revokedAt: null, expiresAt: { gt: new Date() } } });

const findRefreshTokenByHash = (tokenHash) => prisma.refreshToken.findFirst({ where: { tokenHash, revokedAt: null } });

const revokeRefreshToken = (id) => prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } });

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
  consumeOtp,
  createRefreshToken,
  findValidRefreshToken,
  findRefreshTokenByHash,
  revokeRefreshToken,
  revokeAllRefreshTokens,
};
