// Chạy: node tests/course.admin-edit.test.js   (server phải đang chạy ở terminal khác)
// Kiểm tra PUT /course/:id cho admin có QUAN_LY_KHOA_HOC: sửa được mọi trạng thái trừ DA_KET_THUC,
// giữ quy tắc khóa học phí/ngày khi có học viên, báo giáo viên phụ trách; và các nhánh 401/403/404/409.
// Test tự tạo dữ liệu tạm bằng Prisma và tự xóa khi xong.
require('dotenv').config();
const prisma = require('../src/config/database');
const { authHeaders } = require('./helpers/auth');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}/api/course`;
const stamp = Date.now();

let passed = 0;
let failed = 0;

const put = async (id, body, auth) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(auth) },
    body: JSON.stringify(body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch (_) {}
  return { status: res.status, json };
};

const check = (name, condition, detail = '') => {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}${detail ? `  -> ${detail}` : ''}`);
  }
};

async function main() {
  console.log(`Kiểm tra admin sửa khóa học tại ${BASE}\n`);
  const accounts = [];
  const makeAccount = async (tag, role, extra = {}) => {
    const account = await prisma.account.create({
      data: { fullName: `AdminEdit ${tag}`, email: `adminedit.${tag}.${stamp}@example.com`, passwordHash: 'x', role, status: 'HOAT_DONG', ...extra },
      include: { teacher: true, administrator: true, student: true },
    });
    accounts.push(account.id);
    return account;
  };

  const category = await prisma.category.create({ data: { categoryName: `AdminEdit ${stamp}` } });
  const teacherAcc = await makeAccount('teacher', 'TEACHER', { teacher: { create: { specialization: 'x', biography: 'x', teachingExperience: 'x', approvalStatus: 'DA_DUYET' } } });
  const otherTeacherAcc = await makeAccount('teacher2', 'TEACHER', { teacher: { create: { specialization: 'x', biography: 'x', teachingExperience: 'x', approvalStatus: 'DA_DUYET' } } });
  const studentAcc = await makeAccount('student', 'STUDENT', { student: { create: {} } });
  const adminNoPerm = await makeAccount('admin-noperm', 'ADMINISTRATOR', { administrator: { create: { isLeader: false } } });
  const adminWithPerm = await makeAccount('admin-perm', 'ADMINISTRATOR', { administrator: { create: { isLeader: false } } });
  const fn = await prisma.systemFunction.findUnique({ where: { functionName: 'QUAN_LY_KHOA_HOC' } });
  await prisma.permissionAssignment.create({ data: { administratorId: adminWithPerm.administrator.id, functionId: fn.id } });

  const baseCourse = (status, name) => ({
    courseName: `AdminEdit ${name} ${stamp}`,
    description: 'Mô tả',
    price: 1000000,
    status,
    startDate: new Date('2027-01-01T00:00:00Z'),
    endDate: new Date('2027-06-01T00:00:00Z'),
    categoryId: category.id,
    teacherId: teacherAcc.teacher.id,
  });
  const pending = await prisma.course.create({ data: baseCourse('CHO_DUYET', 'pending') });
  const open = await prisma.course.create({ data: baseCourse('DANG_MO', 'open') });
  const ended = await prisma.course.create({ data: baseCourse('DA_KET_THUC', 'ended') });
  const courseIds = [pending.id, open.id, ended.id];
  const registration = await prisma.courseRegistration.create({ data: { studentId: studentAcc.student.id, courseId: open.id, status: 'CHO_THANH_TOAN' } });

  const admin = { who: adminWithPerm.id, role: 'ADMINISTRATOR' };

  try {
    console.log('[Quyền]');
    let r = await put(pending.id, { courseName: 'x' });
    check('Không token -> 401', r.status === 401, String(r.status));
    r = await put(pending.id, { courseName: 'x' }, { who: studentAcc.id, role: 'STUDENT' });
    check('Học viên -> 403', r.status === 403, String(r.status));
    r = await put(pending.id, { courseName: 'x' }, { who: adminNoPerm.id, role: 'ADMINISTRATOR' });
    check('Admin không có QUAN_LY_KHOA_HOC -> 403', r.status === 403, String(r.status));
    r = await put(open.id, { courseName: 'x' }, { who: otherTeacherAcc.id, role: 'TEACHER' });
    check('Giáo viên khác sửa khóa không phải của mình -> 404', r.status === 404, String(r.status));

    console.log('\n[Admin sửa]');
    const before = new Date();
    r = await put(pending.id, { courseName: `AdminEdit pending sửa ${stamp}`, description: 'Mô tả mới' }, admin);
    check('Admin sửa khóa CHO_DUYET -> 200', r.status === 200, `${r.status} ${r.json?.message}`);
    check('Tên và mô tả được cập nhật', r.json?.data?.courseName === `AdminEdit pending sửa ${stamp}` && r.json?.data?.description === 'Mô tả mới');
    check('Trạng thái không đổi (vẫn CHO_DUYET)', r.json?.data?.status === 'CHO_DUYET', r.json?.data?.status);
    const notification = await prisma.notification.findFirst({ where: { accountId: teacherAcc.id, type: 'COURSE_UPDATED_BY_ADMIN', createdAt: { gte: before } } });
    check('Giáo viên phụ trách nhận thông báo COURSE_UPDATED_BY_ADMIN', Boolean(notification));

    r = await put(ended.id, { courseName: 'x' }, admin);
    check('Admin sửa khóa DA_KET_THUC -> 409', r.status === 409, `${r.status} ${r.json?.message}`);

    r = await put(open.id, { price: 2000000 }, admin);
    check('Khóa có đơn CHO_THANH_TOAN: admin đổi học phí -> 409', r.status === 409, `${r.status} ${r.json?.message}`);
    r = await put(open.id, { courseName: `AdminEdit open sửa ${stamp}`, price: 1000000 }, admin);
    check('Khóa có học viên: admin đổi tên, gửi lại đúng học phí cũ -> 200', r.status === 200, `${r.status} ${r.json?.message}`);

    r = await put(pending.id, { endDate: '2026-01-01' }, admin);
    check('Ngày kết thúc trước ngày bắt đầu -> 400', r.status === 400, `${r.status} ${r.json?.message}`);

    console.log('\n[Giáo viên vẫn như cũ]');
    r = await put(pending.id, { courseName: 'x' }, { who: teacherAcc.id, role: 'TEACHER' });
    check('Giáo viên sửa khóa CHO_DUYET của mình -> 409', r.status === 409, `${r.status} ${r.json?.message}`);
  } finally {
    await prisma.notification.deleteMany({ where: { accountId: { in: accounts } } });
    await prisma.courseRegistration.deleteMany({ where: { id: registration.id } });
    await prisma.course.deleteMany({ where: { id: { in: courseIds } } });
    await prisma.permissionAssignment.deleteMany({ where: { administratorId: adminWithPerm.administrator.id } });
    await prisma.administrator.deleteMany({ where: { accountId: { in: accounts } } });
    await prisma.teacher.deleteMany({ where: { accountId: { in: accounts } } });
    await prisma.student.deleteMany({ where: { accountId: { in: accounts } } });
    await prisma.account.deleteMany({ where: { id: { in: accounts } } });
    await prisma.category.deleteMany({ where: { id: category.id } });
  }

  console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
  process.exitCode = failed ? 1 : 0;
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
