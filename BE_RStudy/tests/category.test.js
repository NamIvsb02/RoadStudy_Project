require('dotenv').config();
const prisma = require('../src/config/database');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}/api/category`;
const ADMIN = 'ADMINISTRATOR';
const unique = `Test DM ${Date.now()}`;

let passed = 0;
let failed = 0;

const call = async (method, path, { role, body } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(role && { 'x-dev-role': role }) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
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

const names = (r) => (r.json?.data?.items || []).map((i) => i.categoryName);

async function main() {
  console.log(`Kiểm tra API Category tại ${BASE}\n`);
  let id;

  console.log('[Tạo mới]');
  let r = await call('POST', '', { role: ADMIN, body: { categoryName: unique, description: 'Mô tả test' } });
  check('Tạo danh mục -> 201', r.status === 201, `status ${r.status}`);
  id = r.json?.data?.id;
  check('Trả về id', !!id);
  check('Trạng thái mặc định là HOAT_DONG', r.json?.data?.status === 'HOAT_DONG', r.json?.data?.status);
  if (!id) {
    console.log('\nKhông tạo được danh mục, dừng test. Xem log ở terminal chạy server.');
    process.exit(1);
  }

  r = await call('POST', '', { role: ADMIN, body: { categoryName: unique.toUpperCase() } });
  check('Trùng tên (khác hoa thường) -> 409', r.status === 409, `status ${r.status}`);

  r = await call('POST', '', { role: ADMIN, body: { description: 'thiếu tên' } });
  check('Thiếu tên -> 400', r.status === 400, `status ${r.status}`);

  r = await call('POST', '', { role: ADMIN, body: { categoryName: 'x'.repeat(101) } });
  check('Tên quá 100 ký tự -> 400', r.status === 400, `status ${r.status}`);

  r = await call('POST', '', { role: ADMIN, body: { categoryName: `${unique} b`, status: 'SAI' } });
  check('Trạng thái sai -> 400', r.status === 400, `status ${r.status}`);

  r = await call('POST', '', { role: 'STUDENT', body: { categoryName: `${unique} c` } });
  check('Học viên tạo -> 403', r.status === 403, `status ${r.status}`);

  console.log('\n[Public]');
  const q = encodeURIComponent(unique);
  r = await call('GET', `?q=${q}`);
  check('Danh sách public -> 200', r.status === 200, `status ${r.status}`);
  check('Danh sách có danh mục vừa tạo', names(r).includes(unique));
  check('Có thông tin phân trang', typeof r.json?.data?.pagination?.total === 'number');
  check('Có courseCount là số', typeof r.json?.data?.items?.[0]?.courseCount === 'number');

  r = await call('GET', `?q=${q}&page=1&limit=1`);
  check('Phân trang limit=1 -> tối đa 1 phần tử', (r.json?.data?.items || []).length <= 1);

  r = await call('GET', `/${id}`);
  check('Chi tiết public -> 200', r.status === 200, `status ${r.status}`);

  r = await call('GET', '/id-khong-ton-tai');
  check('Chi tiết id không tồn tại -> 404', r.status === 404, `status ${r.status}`);

  console.log('\n[Sửa]');
  r = await call('PUT', `/${id}`, { role: ADMIN, body: { description: 'Đã sửa' } });
  check('Sửa mô tả -> 200', r.status === 200, `status ${r.status}`);
  check('Mô tả đã đổi', r.json?.data?.description === 'Đã sửa');
  check('Tên giữ nguyên', r.json?.data?.categoryName === unique);

  r = await call('PUT', `/${id}`, { role: ADMIN, body: {} });
  check('Sửa với body rỗng -> 400', r.status === 400, `status ${r.status}`);

  r = await call('PUT', '/id-khong-ton-tai', { role: ADMIN, body: { description: 'x' } });
  check('Sửa id không tồn tại -> 404', r.status === 404, `status ${r.status}`);

  r = await call('PUT', `/${id}`, { role: 'STUDENT', body: { description: 'x' } });
  check('Học viên sửa -> 403', r.status === 403, `status ${r.status}`);

  console.log('\n[Ẩn / hiện]');
  r = await call('PATCH', `/${id}/status`, { role: ADMIN, body: { status: 'AN' } });
  check('Ẩn danh mục -> 200', r.status === 200, `status ${r.status}`);

  r = await call('GET', `/${id}`);
  check('Chi tiết public khi ẩn -> 404', r.status === 404, `status ${r.status}`);

  r = await call('GET', `?q=${q}`);
  check('Danh sách public không còn danh mục ẩn', !names(r).includes(unique));

  r = await call('GET', `/manage?q=${q}`, { role: ADMIN });
  check('Admin vẫn thấy danh mục ẩn', names(r).includes(unique), `status ${r.status}`);

  r = await call('GET', `/manage?status=AN&q=${q}`, { role: ADMIN });
  check('Admin lọc status=AN thấy danh mục', names(r).includes(unique));

  r = await call('GET', `/manage?status=HOAT_DONG&q=${q}`, { role: ADMIN });
  check('Admin lọc status=HOAT_DONG không thấy', !names(r).includes(unique));

  r = await call('GET', '/manage?status=ABC', { role: ADMIN });
  check('Lọc status sai -> 400', r.status === 400, `status ${r.status}`);

  r = await call('GET', '/manage', { role: 'STUDENT' });
  check('Học viên xem danh sách admin -> 403', r.status === 403, `status ${r.status}`);

  r = await call('PATCH', `/${id}/status`, { role: ADMIN, body: { status: 'HOAT_DONG' } });
  check('Hiện lại danh mục -> 200', r.status === 200, `status ${r.status}`);

  r = await call('GET', `/${id}`);
  check('Chi tiết public sau khi hiện lại -> 200', r.status === 200, `status ${r.status}`);

  console.log('\n[Xóa]');
  r = await call('GET', `/manage/${id}`, { role: ADMIN });
  check('Chi tiết admin có relations', r.status === 200 && r.json?.data?.relations?.courses === 0);

  // Tạo khóa học gắn vào danh mục để thử quy tắc "đã có dữ liệu thì không xóa"
  const stamp = Date.now();
  let account, teacher, course;
  try {
    account = await prisma.account.create({
      data: {
        fullName: 'GV Test',
        email: `gv.test.${stamp}@example.com`,
        passwordHash: 'x',
        role: 'TEACHER',
        status: 'HOAT_DONG',
      },
    });
    teacher = await prisma.teacher.create({
      data: {
        specialization: 'Test',
        biography: 'Test',
        teachingExperience: 'Test',
        accountId: account.id,
      },
    });
    course = await prisma.course.create({
      data: {
        courseName: `Khóa test ${stamp}`,
        description: 'Test',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        categoryId: id,
        teacherId: teacher.id,
      },
    });

    r = await call('DELETE', `/${id}`, { role: ADMIN });
    check('Xóa danh mục đã có khóa học -> 409', r.status === 409, `status ${r.status}`);
  } catch (e) {
    check('Chuẩn bị dữ liệu khóa học để test xóa', false, e.message);
  } finally {
    if (course) await prisma.course.delete({ where: { id: course.id } });
    if (teacher) await prisma.teacher.delete({ where: { id: teacher.id } });
    if (account) await prisma.account.delete({ where: { id: account.id } });
  }

  r = await call('DELETE', `/${id}`, { role: 'STUDENT' });
  check('Học viên xóa -> 403', r.status === 403, `status ${r.status}`);

  r = await call('DELETE', `/${id}`, { role: ADMIN });
  check('Xóa danh mục chưa có khóa học -> 200', r.status === 200, `status ${r.status}`);

  r = await call('DELETE', `/${id}`, { role: ADMIN });
  check('Xóa lần nữa -> 404', r.status === 404, `status ${r.status}`);

  console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
  await prisma.$disconnect();
  process.exit(failed ? 1 : 0);
}

main().catch(async (e) => {
  console.error('\nLỗi khi chạy test (server đã chạy chưa? đúng port chưa?):', e.message);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});