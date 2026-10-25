const prisma = require('../config/database');

// Thông tin kèm theo khóa học (không có dữ liệu nhạy cảm như email/passwordHash)
const courseInclude = {
  category: { select: { id: true, categoryName: true, status: true } },
  teacher: {
    select: {
      id: true,
      specialization: true,
      approvalStatus: true,
      account: { select: { fullName: true, avatarUrl: true } },
    },
  },
};

const buildWhere = ({ q, status, categoryId, teacherId }) => ({
  ...(status && { status }),
  ...(categoryId && { categoryId }),
  ...(teacherId && { teacherId }),
  ...(q && { courseName: { contains: q, mode: 'insensitive' } }),
});

// Tra giáo viên theo tài khoản đăng nhập (đặt tạm ở đây vì teacherRepository thuộc module khác)
const findTeacherByAccountId = (accountId) =>
  prisma.teacher.findUnique({ where: { accountId } });

const findAndCount = async ({ q, status, categoryId, teacherId, skip, take }) => {
  const where = buildWhere({ q, status, categoryId, teacherId });
  const [items, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take,
      orderBy: { updatedAt: 'desc' },
      include: courseInclude,
    }),
    prisma.course.count({ where }),
  ]);
  return { items, total };
};

const findById = (id) => prisma.course.findUnique({ where: { id }, include: courseInclude });

// Chỉ tìm khóa học thuộc giáo viên này
const findOwnById = (id, teacherId) =>
  prisma.course.findFirst({ where: { id, teacherId }, include: courseInclude });

const create = (data) => prisma.course.create({ data, include: courseInclude });

const update = (id, data) => prisma.course.update({ where: { id }, data, include: courseInclude });


const transition = async (id, fromStatuses, toStatus) => {
  const result = await prisma.course.updateMany({
    where: { id, status: { in: fromStatuses } },
    data: { status: toStatus },
  });
  return result.count;
};

const publicBaseWhere = {
  status: 'DANG_MO',
  category: { status: 'HOAT_DONG' },
};

// Chỉ chọn các trường được phép công khai (không có status, email, trạng thái duyệt...)
const publicListSelect = {
  id: true,
  courseName: true,
  description: true,
  price: true,
  coverImageUrl: true,
  startDate: true,
  endDate: true,
  category: { select: { id: true, categoryName: true } },
  teacher: {
    select: {
      id: true,
      specialization: true,
      account: { select: { fullName: true, avatarUrl: true } },
    },
  },
};

const publicDetailSelect = {
  ...publicListSelect,
  createdAt: true,
  teacher: {
    select: {
      id: true,
      specialization: true,
      biography: true,
      teachingExperience: true,
      account: { select: { fullName: true, avatarUrl: true } },
    },
  },
};

const PUBLIC_SORTS = {
  newest: [{ createdAt: 'desc' }, { id: 'asc' }],
  price_asc: [{ price: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }],
  price_desc: [{ price: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
  start_soon: [{ startDate: 'asc' }, { id: 'asc' }],
  name: [{ courseName: 'asc' }, { id: 'asc' }],
};

const buildPublicWhere = ({ q, categoryId, teacherId, minPrice, maxPrice }) => {
  const hasPrice = minPrice !== undefined || maxPrice !== undefined;
  return {
    ...publicBaseWhere,
    ...(categoryId && { categoryId }),
    ...(teacherId && { teacherId }),
    ...(hasPrice && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
    ...(q && {
      OR: [
        { courseName: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    }),
  };
};

const findPublicAndCount = async ({ sort = 'newest', skip, take, ...filters }) => {
  const where = buildPublicWhere(filters);
  const [items, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take,
      orderBy: PUBLIC_SORTS[sort] || PUBLIC_SORTS.newest,
      select: publicListSelect,
    }),
    prisma.course.count({ where }),
  ]);
  return { items, total };
};

const findPublicById = (id) =>
  prisma.course.findFirst({ where: { id, ...publicBaseWhere }, select: publicDetailSelect });


const getRatingStats = async (courseIds) => {
  if (!courseIds.length) return new Map();
  const rows = await prisma.review.groupBy({
    by: ['courseId'],
    where: { courseId: { in: courseIds }, status: 'HIEN_THI' },
    _avg: { rating: true },
    _count: { _all: true },
  });
  return new Map(
    rows.map((r) => [r.courseId, { averageRating: r._avg.rating, reviewCount: r._count._all }])
  );
};

module.exports = {
  findTeacherByAccountId,
  findAndCount,
  findById,
  findOwnById,
  create,
  update,
  transition,
  findPublicAndCount,
  findPublicById,
  getRatingStats,
};