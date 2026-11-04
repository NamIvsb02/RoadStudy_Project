const prisma = require("../config/database");
const AppError = require("../utils/AppError");

const loadAdmin = async (req) => {
  if (!req.user) throw new AppError("Chưa xác thực", 401);
  if (req.user.role !== "ADMINISTRATOR") {
    throw new AppError("Không đủ quyền truy cập", 403);
  }
  const admin = await prisma.administrator.findUnique({
    where: { accountId: req.user.id },
    select: {
      id: true,
      isLeader: true,
      account: { select: { status: true } },
      permissions: {
        where: { function: { status: "HOAT_DONG" } },
        select: { function: { select: { functionName: true } } },
      },
    },
  });
  if (!admin || admin.account.status !== "HOAT_DONG") {
    throw new AppError("Tài khoản quản trị không hợp lệ hoặc đã bị khóa", 403);
  }
  req.admin = {
    id: admin.id,
    isLeader: admin.isLeader,
    permissions: admin.permissions.map((p) => p.function.functionName),
  };
};

const requireAdmin = async (req, res, next) => {
  await loadAdmin(req);
  next();
};

const requireLeader = async (req, res, next) => {
  await loadAdmin(req);
  if (!req.admin.isLeader) {
    throw new AppError("Chỉ Leader mới được thực hiện chức năng này", 403);
  }
  next();
};

const requirePermission =
  (...functionNames) =>
  async (req, res, next) => {
    await loadAdmin(req);
    if (req.admin.isLeader) return next();
    const allowed = functionNames.some((n) => req.admin.permissions.includes(n));
    if (!allowed) {
      throw new AppError("Bạn không có quyền thực hiện chức năng này", 403);
    }
    next();
  };

module.exports = { requireAdmin, requireLeader, requirePermission };
