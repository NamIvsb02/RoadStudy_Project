const AppError = require("../utils/AppError");
const { hashPassword } = require("../utils/hash");
const repo = require("../repositories/adminRepository");

const toAdminDto = (a) => ({
  id: a.id,
  accountId: a.accountId,
  fullName: a.account.fullName,
  email: a.account.email,
  phoneNumber: a.account.phoneNumber,
  status: a.account.status,
  createdAt: a.account.createdAt,
  isLeader: a.isLeader,
  permissions: a.permissions.map((p) => ({
    id: p.function.id,
    functionName: p.function.functionName,
    description: p.function.description,
    status: p.function.status,
  })),
});

const ensureFunctionsExist = async (functionIds) => {
  const unique = [...new Set(functionIds)];
  if (unique.length === 0) return unique;
  const found = await repo.findFunctionsByIds(unique);
  if (found.length !== unique.length) {
    throw new AppError("Có chức năng không tồn tại", 400);
  }
  return unique;
};

const getAdminOrThrow = async (id) => {
  const admin = await repo.findAdministratorById(id);
  if (!admin) throw new AppError("Không tìm thấy quản trị viên", 404);
  return admin;
};

const getMyAccess = async (admin) => {
  if (admin.isLeader) {
    const functions = await repo.listSystemFunctions();
    return {
      isLeader: true,
      permissions: functions.filter((f) => f.status === "HOAT_DONG").map((f) => f.functionName),
    };
  }
  return { isLeader: false, permissions: admin.permissions };
};

const listSystemFunctions = () => repo.listSystemFunctions();

const listAdministrators = async ({ page, limit, search }) => {
  const { items, total } = await repo.listAdministrators({
    skip: (page - 1) * limit,
    take: limit,
    search,
  });
  return {
    items: items.map(toAdminDto),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getAdministrator = async (id) => toAdminDto(await getAdminOrThrow(id));

const createAdministrator = async (input) => {
  const { functionIds, password, ...profile } = input;
  const ids = await ensureFunctionsExist(functionIds);
  const passwordHash = await hashPassword(password);
  const account = await repo.createAdministrator({ ...profile, passwordHash }, ids);
  return toAdminDto(await getAdminOrThrow(account.administrator.id));
};

const setAdministratorStatus = async (id, status, requesterAccountId) => {
  const target = await getAdminOrThrow(id);
  if (target.isLeader) throw new AppError("Không thể thay đổi trạng thái của Leader", 400);
  if (target.accountId === requesterAccountId) {
    throw new AppError("Không thể tự thay đổi trạng thái của chính mình", 400);
  }
  await repo.updateAccountStatus(target.accountId, status);
  return toAdminDto(await getAdminOrThrow(id));
};

const setAdministratorPermissions = async (id, functionIds) => {
  const target = await getAdminOrThrow(id);
  if (target.isLeader) throw new AppError("Leader mặc định có toàn quyền, không cần gán", 400);
  const ids = await ensureFunctionsExist(functionIds);
  await repo.replacePermissions(target.id, ids);
  return toAdminDto(await getAdminOrThrow(id));
};

module.exports = {
  getMyAccess,
  listSystemFunctions,
  listAdministrators,
  getAdministrator,
  createAdministrator,
  setAdministratorStatus,
  setAdministratorPermissions,
};
