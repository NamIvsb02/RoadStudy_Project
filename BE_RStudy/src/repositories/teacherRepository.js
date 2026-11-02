const prisma = require("../config/database");

const TEACHER_INCLUDE = {
  account: { select: { id: true, fullName: true, email: true, phoneNumber: true, avatarUrl: true, status: true } },
};

const findByAccountId = (accountId) => prisma.teacher.findUnique({ where: { accountId }, include: TEACHER_INCLUDE });

const findById = (id) => prisma.teacher.findUnique({ where: { id }, include: TEACHER_INCLUDE });

const updateByAccountId = (accountId, data) => prisma.teacher.update({ where: { accountId }, data, include: TEACHER_INCLUDE });

const list = async ({ where, skip, take }) => {
  const [items, total] = await Promise.all([prisma.teacher.findMany({ where, skip, take, orderBy: { account: { createdAt: "desc" } }, include: TEACHER_INCLUDE }), prisma.teacher.count({ where })]);
  return { items, total };
};

const updateApproval = (id, approvalStatus) => prisma.teacher.update({ where: { id }, data: { approvalStatus }, include: TEACHER_INCLUDE });

module.exports = { findByAccountId, findById, updateByAccountId, list, updateApproval };
