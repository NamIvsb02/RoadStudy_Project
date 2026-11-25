// Nạp dữ liệu giả vào DB benchmark. Chạy BÊN TRONG container backend của môi trường đo (xem run.sh).
// Từ chối chạy nếu DATABASE_URL không phải DB benchmark, để không bao giờ ghi nhầm vào DB dùng chung.
const url = process.env.DATABASE_URL || "";
if (!url.includes("@db:5432/bench")) {
  console.error("Từ chối: DATABASE_URL không phải DB benchmark (@db:5432/bench)");
  process.exit(1);
}
const { PrismaClient } = require("/app/node_modules/@prisma/client");
const crypto = require("crypto");
const prisma = new PrismaClient();

const uuid = () => crypto.randomUUID();
const CATEGORIES = 12; // 10 hiển thị + 2 ẩn
const TEACHERS = 30;
const STUDENTS = 200;
const COURSES = 500;
const REVIEWS = 3000;
const TOPICS = ["Lập trình", "Thiết kế", "Tiếng Anh", "Marketing", "Kế toán", "Âm nhạc", "Nhiếp ảnh", "Dữ liệu", "Kinh doanh", "Kỹ năng mềm", "Ẩn A", "Ẩn B"];
const LOREM = "Khóa học cung cấp kiến thức nền tảng và thực hành theo từng bước, phù hợp cho người mới bắt đầu muốn nâng cao kỹ năng và áp dụng vào công việc thực tế. ";
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

async function main() {
  if ((await prisma.course.count()) > 0) {
    console.log("DB benchmark đã có dữ liệu, bỏ qua nạp lại");
    return;
  }
  const categories = Array.from({ length: CATEGORIES }, (_, i) => ({
    id: uuid(),
    categoryName: TOPICS[i],
    description: `Danh mục ${TOPICS[i]}`,
    status: i < 10 ? "HOAT_DONG" : "AN",
  }));
  const teacherAccounts = Array.from({ length: TEACHERS }, (_, i) => ({ id: uuid(), fullName: `Giáo viên ${i + 1}`, email: `gv${i + 1}@bench.test`, passwordHash: "x", role: "TEACHER", status: "HOAT_DONG" }));
  const studentAccounts = Array.from({ length: STUDENTS }, (_, i) => ({ id: uuid(), fullName: `Học viên ${i + 1}`, email: `hv${i + 1}@bench.test`, passwordHash: "x", role: "STUDENT", status: "HOAT_DONG" }));
  const teachers = teacherAccounts.map((a, i) => ({ id: uuid(), specialization: `Chuyên môn ${i + 1}`, biography: LOREM.repeat(2), teachingExperience: LOREM, approvalStatus: "DA_DUYET", accountId: a.id }));
  const students = studentAccounts.map((a) => ({ id: uuid(), accountId: a.id }));
  const base = Date.now();
  const courses = Array.from({ length: COURSES }, (_, i) => ({
    id: uuid(),
    courseName: `${TOPICS[i % CATEGORIES]} nâng cao khóa ${i + 1}`,
    description: LOREM.repeat(3),
    price: (i % 7) * 150000,
    // 90% đang mở; còn lại bản nháp hoặc chờ duyệt. Khóa thuộc danh mục ẩn không hiển thị công khai
    status: i % 10 === 9 ? (i % 20 === 9 ? "BAN_NHAP" : "CHO_DUYET") : "DANG_MO",
    startDate: new Date(base + (30 + (i % 60)) * 86400000),
    endDate: new Date(base + (120 + (i % 60)) * 86400000),
    createdAt: new Date(base - i * 3600000),
    categoryId: categories[i % CATEGORIES].id,
    teacherId: teachers[i % TEACHERS].id,
  }));
  const reviews = [];
  const used = new Set();
  for (let n = 0; reviews.length < REVIEWS && n < REVIEWS * 4; n++) {
    const s = students[n % STUDENTS];
    const c = courses[(Math.floor(n / STUDENTS) * 17 + (n % STUDENTS) * 3) % COURSES];
    const key = `${s.id}:${c.id}`;
    if (used.has(key)) continue;
    used.add(key);
    reviews.push({ id: uuid(), rating: 1 + (n % 5), content: "Khóa học rất hữu ích", status: n % 15 === 0 ? "AN" : "HIEN_THI", studentId: s.id, courseId: c.id });
  }
  await prisma.category.createMany({ data: categories });
  for (const part of chunk([...teacherAccounts, ...studentAccounts], 200)) await prisma.account.createMany({ data: part });
  await prisma.teacher.createMany({ data: teachers });
  await prisma.student.createMany({ data: students });
  for (const part of chunk(courses, 200)) await prisma.course.createMany({ data: part });
  for (const part of chunk(reviews, 500)) await prisma.review.createMany({ data: part });
  const open = await prisma.course.count({ where: { status: "DANG_MO", category: { status: "HOAT_DONG" } } });
  console.log(`Đã nạp: ${CATEGORIES} danh mục, ${TEACHERS} giáo viên, ${STUDENTS} học viên, ${COURSES} khóa học (${open} hiển thị công khai), ${reviews.length} đánh giá`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
