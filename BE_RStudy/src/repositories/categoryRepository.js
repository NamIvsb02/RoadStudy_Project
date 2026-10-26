const prisma = require('../config/database');

const buildWhere = ({ q, status }) => ({
  ...(status && { status }),
  ...(q && { categoryName: { contains: q, mode: 'insensitive' } }),
});

// Danh sách + tổng (dùng chung cho public và admin)
const findAndCount = async ({ q, status, skip, take, withCourseCount = false }) => {
  const where = buildWhere({ q, status });
  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: { categoryName: 'asc' },
      ...(withCourseCount && {
        include: { _count: { select: { courses: { where: { status: 'DANG_MO' } } } } },
      }),
    }),
    prisma.category.count({ where }),
  ]);
  return { items, total };
};

const findById = (id) => prisma.category.findUnique({ where: { id } });

// Tìm trùng tên (không phân biệt hoa thường), bỏ qua chính nó khi cập nhật
const findByName = (name, excludeId) =>
  prisma.category.findFirst({
    where: {
      categoryName: { equals: name, mode: 'insensitive' },
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

const create = (data) => prisma.category.create({ data });

const update = (id, data) => prisma.category.update({ where: { id }, data });

const remove = (id) => prisma.category.delete({ where: { id } });

// Số dữ liệu đang tham chiếu tới danh mục (mọi trạng thái)
const countRelations = async (id) => {
  const [courses, resources] = await Promise.all([
    prisma.course.count({ where: { categoryId: id } }),
    prisma.resource.count({ where: { categoryId: id } }),
  ]);
  return { courses, resources };
};

module.exports = { findAndCount, findById, findByName, create, update, remove, countRelations };