const prisma = require("../config/database");

const PUBLIC_WHERE = { approvalStatus: "DA_DUYET", account: { status: "HOAT_DONG" } };

const listPublic = ({ search, skip, take }) => {
  const where = { ...PUBLIC_WHERE };
  if (search) {
    where.OR = [{ account: { fullName: { contains: search, mode: "insensitive" } } }, { specialization: { contains: search, mode: "insensitive" } }];
  }
  return prisma.$transaction([
    prisma.teacher.findMany({
      where,
      skip,
      take,
      orderBy: { account: { fullName: "asc" } },
      select: {
        id: true,
        specialization: true,
        biography: true,
        account: { select: { fullName: true, avatarUrl: true } },
        _count: { select: { courses: { where: { status: "DANG_MO" } } } },
      },
    }),
    prisma.teacher.count({ where }),
  ]);
};

const findPublicById = (id) =>
  prisma.teacher.findFirst({
    where: { id, ...PUBLIC_WHERE },
    select: {
      id: true,
      specialization: true,
      biography: true,
      teachingExperience: true,
      account: { select: { fullName: true, avatarUrl: true } },
      courses: {
        where: { status: "DANG_MO" },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          courseName: true,
          price: true,
          coverImageUrl: true,
          startDate: true,
          endDate: true,
          category: { select: { id: true, categoryName: true } },
        },
      },
    },
  });

const listForAdmin = ({ approvalStatus, search, skip, take }) => {
  const where = {};
  if (approvalStatus) where.approvalStatus = approvalStatus;
  if (search) {
    where.OR = [
      { account: { fullName: { contains: search, mode: "insensitive" } } },
      { account: { email: { contains: search, mode: "insensitive" } } },
      { specialization: { contains: search, mode: "insensitive" } },
    ];
  }
  return prisma.$transaction([
    prisma.teacher.findMany({
      where,
      skip,
      take,
      orderBy: { account: { createdAt: "desc" } },
      select: {
        id: true,
        specialization: true,
        biography: true,
        teachingExperience: true,
        approvalStatus: true,
        account: { select: { id: true, fullName: true, email: true, phoneNumber: true, avatarUrl: true, status: true, createdAt: true } },
      },
    }),
    prisma.teacher.count({ where }),
  ]);
};

const updateApproval = (id, approvalStatus) =>
  prisma.teacher.update({
    where: { id },
    data: { approvalStatus },
    select: { id: true, approvalStatus: true, account: { select: { id: true, fullName: true, email: true } } },
  });
const findByAccountId = (accountId) => prisma.teacher.findUnique({ where: { accountId }, select: { id: true } });

const getStats = (teacherId, since) => {
  const ofTeacher = { course: { teacherId } };
  return prisma.$transaction([
    prisma.course.count({ where: { teacherId, status: "DANG_MO" } }),
    prisma.exam.count({ where: { ...ofTeacher, status: "DANG_MO" } }),
    prisma.exam.count({ where: { ...ofTeacher, status: "BAN_NHAP" } }),
    prisma.examAttempt.count({ where: { exam: ofTeacher, status: { not: "HUY" }, startTime: { gte: since } } }),
    prisma.examAttempt.findMany({
      where: { exam: ofTeacher, status: { not: "HUY" } },
      orderBy: { startTime: "desc" },
      take: 5,
      select: {
        id: true,
        score: true,
        status: true,
        student: { select: { account: { select: { fullName: true } } } },
        exam: { select: { examName: true, passingScore: true } },
      },
    }),
    prisma.course.findMany({
      where: { teacherId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, courseName: true, status: true, _count: { select: { exams: true } } },
    }),
  ]);
};

module.exports = { listPublic, findPublicById, listForAdmin, updateApproval, findByAccountId, getStats };
