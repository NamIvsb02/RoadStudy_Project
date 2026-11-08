const prisma = require("../config/database");

const include = {
  category: { select: { id: true, categoryName: true } },
  uploadedBy: { select: { id: true } },
};

exports.findTeacherByAccountId = (accountId) => prisma.teacher.findUnique({ where: { accountId } });

exports.findById = (id) => prisma.resource.findUnique({ where: { id }, include });

exports.findAndCount = async ({ q, categoryId, skip, take }) => {
  const where = {
    category: { status: "HOAT_DONG" },
    ...(categoryId && { categoryId }),
    ...(q && { resourceName: { contains: q, mode: "insensitive" } }),
  };
  const [items, total] = await Promise.all([prisma.resource.findMany({ where, include, skip, take, orderBy: { createdAt: "desc" } }), prisma.resource.count({ where })]);
  return { items, total };
};

exports.create = (data) => prisma.resource.create({ data, include });

exports.remove = (id) => prisma.resource.delete({ where: { id } });
