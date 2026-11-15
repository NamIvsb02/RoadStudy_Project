require("dotenv").config();
const prisma = require("../src/config/database");
const { signAccessToken } = require("../src/utils/jwt");

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;

let passed = 0;
let failed = 0;

const check = (name, condition, detail = "") => {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}${detail ? `  -> ${detail}` : ""}`);
  }
};

const start = async (token, examId) => {
  const res = await fetch(`${API}/submission/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ examId }),
  });
  let json = null;
  try {
    json = await res.json();
  } catch (_) {}
  return { status: res.status, json };
};

async function main() {
  console.log(`Kiểm tra bắt đầu bài thi song song tại ${API}\n`);

  const registration = await prisma.courseRegistration.findFirst({
    where: { status: "DA_THANH_TOAN", course: { exams: { some: { status: "DANG_MO" } } } },
    include: { student: true, course: { include: { exams: { where: { status: "DANG_MO" }, take: 1 } } } },
  });
  if (!registration) {
    console.log("Cần có 1 học viên đã thanh toán một khóa học có đề DANG_MO.");
    process.exit(1);
  }
  const studentId = registration.studentId;
  const examId = registration.course.exams[0].id;
  const token = signAccessToken({ sub: registration.student.accountId, role: "STUDENT" });

  await prisma.examAttempt.updateMany({ where: { studentId, examId, status: "DANG_LAM" }, data: { status: "HUY" } });

  console.log("[Hai request start cùng lúc]");
  const [a, b] = await Promise.all([start(token, examId), start(token, examId)]);
  check("Request 1 -> 200", a.status === 200, `status ${a.status} ${a.json?.message ?? ""}`);
  check("Request 2 -> 200", b.status === 200, `status ${b.status} ${b.json?.message ?? ""}`);
  const idA = a.json?.data?.attempt?.id;
  const idB = b.json?.data?.attempt?.id;
  check("Có dữ liệu bài làm (attempt.id, danh sách câu hỏi)", Boolean(idA) && Array.isArray(a.json?.data?.questions), `data: ${JSON.stringify(a.json?.data)}`);
  check("Cả hai trả về cùng một bài làm", Boolean(idA) && idA === idB);

  const inProgress = await prisma.examAttempt.count({ where: { studentId, examId, status: "DANG_LAM" } });
  check("Chỉ có đúng 1 bài đang làm trong DB", inProgress === 1, `có ${inProgress}`);

  const c = await start(token, examId);
  check("Gọi lần ba vẫn là bài đó (làm tiếp, không tính thêm lượt)", Boolean(idA) && c.json?.data?.attempt?.id === idA);
  await prisma.examAttempt.updateMany({ where: { studentId, examId, status: "DANG_LAM" }, data: { status: "HUY" } });
  console.log("  (đã hủy bài thử, không tính vào 3 lượt)");

  console.log(`\nKết quả: ${passed} đạt, ${failed} lỗi`);
  await prisma.$disconnect();
  process.exit(failed ? 1 : 0);
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
