const prisma = require("../config/database");
const administratorInclude = {
  account: {
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      status: true,
      createdAt: true,
    },
  },
  permissions: { include: { function: true } },
};

const listSystemFunctions = () => prisma.systemFunction.findMany({ orderBy: { functionName: "asc" } });

const findFunctionsByIds = (ids) => prisma.systemFunction.findMany({ where: { id: { in: ids } } });

const listAdministrators = async ({ skip, take, search }) => {
  const where = search
    ? {
        account: {
          OR: [{ fullName: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }],
        },
      }
    : {};
  const [items, total] = await prisma.$transaction([
    prisma.administrator.findMany({
      where,
      skip,
      take,
      orderBy: { account: { createdAt: "desc" } },
      include: administratorInclude,
    }),
    prisma.administrator.count({ where }),
  ]);
  return { items, total };
};

const findAdministratorById = (id) => prisma.administrator.findUnique({ where: { id }, include: administratorInclude });

const createAdministrator = ({ fullName, email, passwordHash, phoneNumber }, functionIds) =>
  prisma.account.create({
    data: {
      fullName,
      email,
      passwordHash,
      phoneNumber,
      role: "ADMINISTRATOR",
      status: "HOAT_DONG",
      administrator: {
        create: {
          isLeader: false,
          permissions: { create: functionIds.map((functionId) => ({ functionId })) },
        },
      },
    },
    include: { administrator: true },
  });

const updateAccountStatus = (accountId, status) => {
  const operations = [prisma.account.update({ where: { id: accountId }, data: { status } })];
  if (status === "BI_KHOA") {
    operations.push(
      prisma.refreshToken.updateMany({
        where: { accountId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    );
  }
  return prisma.$transaction(operations);
};

const replacePermissions = (administratorId, functionIds) =>
  prisma.$transaction([
    prisma.permissionAssignment.deleteMany({ where: { administratorId } }),
    prisma.permissionAssignment.createMany({
      data: functionIds.map((functionId) => ({ administratorId, functionId })),
      skipDuplicates: true,
    }),
  ]);

module.exports = {
  listSystemFunctions,
  findFunctionsByIds,
  listAdministrators,
  findAdministratorById,
  createAdministrator,
  updateAccountStatus,
  replacePermissions,
};
