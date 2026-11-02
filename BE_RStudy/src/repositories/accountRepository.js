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

const findByIdSafe = (id) => prisma.account.findUnique({ where: { id }, select: ACCOUNT_SAFE_SELECT });

const updateAccount = (id, data) => prisma.account.update({ where: { id }, data, select: ACCOUNT_SAFE_SELECT });

const updateStudentByAccountId = (accountId, data) => prisma.student.update({ where: { accountId }, data });

const updateAvatar = (id, avatarUrl) => prisma.account.update({ where: { id }, data: { avatarUrl }, select: ACCOUNT_SAFE_SELECT });

const list = async ({ where, skip, take }) => {
  const [items, total] = await Promise.all([prisma.account.findMany({ where, skip, take, orderBy: { createdAt: "desc" }, select: ACCOUNT_SAFE_SELECT }), prisma.account.count({ where })]);
  return { items, total };
};

// Đổi trạng thái; nếu khóa thì thu hồi luôn mọi refresh token
const updateStatus = (id, status) =>
  prisma.$transaction(async (tx) => {
    const account = await tx.account.update({ where: { id }, data: { status }, select: ACCOUNT_SAFE_SELECT });
    if (status === "BI_KHOA") {
      await tx.refreshToken.updateMany({ where: { accountId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    }
    return account;
  });

module.exports = { findByIdSafe, updateAccount, updateStudentByAccountId, updateAvatar, list, updateStatus };
