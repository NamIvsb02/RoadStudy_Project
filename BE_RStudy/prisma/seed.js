require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/hash");

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await hashPassword("Password123!");

  // ===== Admin Leader =====
  const leaderAccount = await prisma.account.create({
    data: {
      fullName: "Nam - Leader Admin",
      email: "leader@roadstudy.vn",
      passwordHash: defaultPassword,
      role: "ADMINISTRATOR",
      status: "HOAT_DONG",
      administrator: { create: { isLeader: true } },
    },
  });

  // ===== Admin thường =====
  const adminAccount = await prisma.account.create({
    data: {
      fullName: "Khang - Admin",
      email: "admin@roadstudy.vn",
      passwordHash: defaultPassword,
      role: "ADMINISTRATOR",
      status: "HOAT_DONG",
      administrator: { create: { isLeader: false } },
    },
    include: { administrator: true },
  });

  // ===== SystemFunction mẫu =====
  const functionsData = [
    { functionName: "QUAN_LY_KHOA_HOC", description: "Quản lý khóa học" },
    { functionName: "QUAN_LY_TAI_KHOAN", description: "Quản lý tài khoản" },
    { functionName: "QUAN_LY_MA_GIAM_GIA", description: "Quản lý mã giảm giá" },
    { functionName: "XU_LY_BAO_CAO_VI_PHAM", description: "Xử lý báo cáo vi phạm" },
  ];
  const functions = [];
  for (const f of functionsData) {
    functions.push(await prisma.systemFunction.create({ data: f }));
  }

  // Cấp 2 quyền đầu cho admin thường (để test requirePermission sau này)
  await prisma.permissionAssignment.createMany({
    data: [
      { administratorId: adminAccount.administrator.id, functionId: functions[0].id },
      { administratorId: adminAccount.administrator.id, functionId: functions[1].id },
    ],
  });

  // ===== Giáo viên =====
  const teacherAccount = await prisma.account.create({
    data: {
      fullName: "Huynh - Giáo viên",
      email: "teacher@roadstudy.vn",
      passwordHash: defaultPassword,
      role: "TEACHER",
      status: "HOAT_DONG",
      teacher: {
        create: {
          specialization: "Lập trình Web",
          biography: "Giảng viên có 5 năm kinh nghiệm lập trình Web.",
          teachingExperience: "5 năm giảng dạy React, Node.js",
          approvalStatus: "DA_DUYET",
        },
      },
    },
    include: { teacher: true },
  });

  // ===== Học viên =====
  await prisma.account.create({
    data: {
      fullName: "Học viên Demo",
      email: "student@roadstudy.vn",
      passwordHash: defaultPassword,
      role: "STUDENT",
      status: "HOAT_DONG",
      student: {
        create: {
          dateOfBirth: new Date("2003-05-10"),
          gender: "NAM",
          address: "TP. Hồ Chí Minh",
        },
      },
    },
  });

  // ===== Category =====
  const category = await prisma.category.create({
    data: { categoryName: "Lập trình Web", description: "Các khóa học về lập trình web" },
  });

  // ===== Course =====
  const course = await prisma.course.create({
    data: {
      courseName: "React cơ bản cho người mới bắt đầu",
      description: "Khóa học nhập môn React, xây dựng ứng dụng web hiện đại.",
      price: 499000,
      status: "DANG_MO",
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-12-31"),
      categoryId: category.id,
      teacherId: teacherAccount.teacher.id,
    },
  });

  // ===== Mã giảm giá =====
  await prisma.discountCode.create({
    data: {
      code: "ROADSTUDY10",
      discountAmount: 50000,
      startDate: new Date("2026-10-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 100,
      status: "HOAT_DONG",
    },
  });

  console.log("Seed xong!");
  console.log("Leader admin : leader@roadstudy.vn / Password123!");
  console.log("Admin thường : admin@roadstudy.vn / Password123!");
  console.log("Giáo viên    : teacher@roadstudy.vn / Password123!");
  console.log("Học viên     : student@roadstudy.vn / Password123!");
  console.log("Khóa học mẫu :", course.courseName);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
