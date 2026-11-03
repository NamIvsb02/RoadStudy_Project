const prisma = require("../config/database");

const SAFE_SELECT = {
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
  administrator: { select: { id: true, isLeader: true } },
};

const LIST_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  avatarUrl: true,
  role: true,
  status: true,
  createdAt: true,
  teacher: { select: { id: true, approvalStatus: true } },
};

const findByIdSafe = (id) => prisma.account.findUnique({ where: { id }, select: SAFE_SELECT });

const list = ({ where, skip, take }) => prisma.$transaction([prisma.account.findMany({ where, skip, take, orderBy: { createdAt: "desc" }, select: LIST_SELECT }), prisma.account.count({ where })]);

const updateProfile = (id, accountData, studentData, teacherData) =>
  prisma.account.update({
    where: { id },
    data: {
      ...accountData,
      ...(Object.keys(studentData).length ? { student: { update: studentData } } : {}),
      ...(Object.keys(teacherData).length ? { teacher: { update: teacherData } } : {}),
    },
    select: SAFE_SELECT,
  });

const updateAvatar = (id, avatarUrl) => prisma.account.update({ where: { id }, data: { avatarUrl }, select: SAFE_SELECT });

const updateStatus = (id, status) => prisma.account.update({ where: { id }, data: { status }, select: SAFE_SELECT });

const revokeAllRefreshTokens = (accountId) => prisma.refreshToken.updateMany({ where: { accountId, revokedAt: null }, data: { revokedAt: new Date() } });

module.exports = { findByIdSafe, list, updateProfile, updateAvatar, updateStatus, revokeAllRefreshTokens };
