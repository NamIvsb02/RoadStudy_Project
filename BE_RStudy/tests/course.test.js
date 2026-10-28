require('dotenv').config();
const prisma = require('../src/config/database');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}/api/course`;
const ADMIN = { role: 'ADMINISTRATOR' };
const STUDENT = { role: 'STUDENT' };
const stamp = Date.now();
const courseName = `Khóa test ${stamp}`;

let passed = 0;
let failed = 0;

const call = async (method, path, { role, userId, body } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(role && { 'x-dev-role': role }),
      ...(userId && { 'x-dev-user-id': userId }),
    },
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

const ids = (r) => (r.json?.data?.items || []).map((i) => i.id);

const makeTeacher = async (tag, approvalStatus) => {
  const account = await prisma.account.create({
    data: {
      fullName: `GV ${tag}`,
      email: `gv.${tag}.${stamp}@example.com`,
      passwordHash: 'x',
      role: 'TEACHER',
      status: 'HOAT_DONG',
    },
  });
  const teacher = await prisma.teacher.create({
    data: {
      specialization: 'Test',
      biography: 'Test',
      teachingExperience: 'Test',
      approvalStatus,
      accountId: account.id,
    },
  });
  return { account, teacher, as: { role: 'TEACHER', userId: account.id } };
};

const validBody = (categoryId, extra = {}) => ({
  courseName,
  description: 'Mô tả khóa học test',
  price: 500000,
  startDate: '2026-12-01',
  endDate: '2026-12-31',
  categoryId,
  ...extra,
});

async function main() {
  console.log(`Kiểm tra API Course tại ${BASE}\n`);

  // ----- Chuẩn bị dữ liệu tạm -----
  const cat = await prisma.category.create({ data: { categoryName: `Cat test ${stamp}` } });
  const hiddenCat = await prisma.category.create({
    data: { categoryName: `Cat ẩn test ${stamp}`, status: 'AN' },
  });
  const A = await makeTeacher('A', 'DA_DUYET');
  const B = await makeTeacher('B', 'DA_DUYET');
  const P = await makeTeacher('P', 'CHO_DUYET'); // chưa được duyệt

  try {
    let r;

    console.log('[Giáo viên tạo khóa học]');
    r = await call('POST', '', { ...A.as, body: validBody(cat.id) });
    check('Tạo khóa học -> 201', r.status === 201, `status ${r.status} ${JSON.stringify(r.json)}`);
    const id = r.json?.data?.id;
    if (!id) {
      console.log('\nKhông tạo được khóa học, dừng test. Xem log ở terminal chạy server.');
      return;
    }
    check('Trạng thái mặc định BAN_NHAP', r.json.data.status === 'BAN_NHAP', r.json.data.status);
    check('Học phí trả về dạng chuỗi', typeof r.json.data.price === 'string', typeof r.json.data.price);
    check('teacherId là giáo viên đang đăng nhập', r.json.data.teacher?.id === A.teacher.id);

    r = await call('POST', '', {
      ...A.as,
      body: validBody(cat.id, { status: 'DANG_MO', teacherId: B.teacher.id }),
    });
    check('Gửi kèm status/teacherId bị bỏ qua', r.status === 201 && r.json?.data?.status === 'BAN_NHAP' && r.json?.data?.teacher?.id === A.teacher.id);

    r = await call('POST', '', { ...STUDENT, body: validBody(cat.id) });
    check('Học viên tạo -> 403', r.status === 403, `status ${r.status}`);

    r = await call('POST', '', { ...P.as, body: validBody(cat.id) });
    check('Giáo viên chưa được duyệt tạo -> 403', r.status === 403, `status ${r.status}`);

    r = await call('POST', '', { ...A.as, body: validBody(cat.id, { courseName: '' }) });
    check('Thiếu tên -> 400', r.status === 400, `status ${r.status}`);

    r = await call('POST', '', { ...A.as, body: validBody(cat.id, { price: -5 }) });
    check('Học phí âm -> 400', r.status === 400, `status ${r.status}`);

    r = await call('POST', '', { ...A.as, body: validBody(cat.id, { endDate: '2026-11-01' }) });
    check('Ngày kết thúc trước ngày bắt đầu -> 400', r.status === 400, `status ${r.status}`);

    r = await call('POST', '', { ...A.as, body: validBody('id-khong-ton-tai') });
    check('Danh mục không tồn tại -> 400', r.status === 400, `status ${r.status}`);

    r = await call('POST', '', { ...A.as, body: validBody(hiddenCat.id) });
    check('Danh mục đang ẩn -> 400', r.status === 400, `status ${r.status}`);

    console.log('\n[Giáo viên xem khóa học của mình]');
    r = await call('GET', `/mine?q=${encodeURIComponent(courseName)}`, A.as);
    check('Giáo viên A thấy khóa của mình', r.status === 200 && ids(r).includes(id), `status ${r.status}`);
    check('Có phân trang', typeof r.json?.data?.pagination?.total === 'number');

    r = await call('GET', `/mine?q=${encodeURIComponent(courseName)}`, B.as);
    check('Giáo viên B không thấy khóa của A', r.status === 200 && !ids(r).includes(id));

    r = await call('GET', `/mine?status=DANG_MO&q=${encodeURIComponent(courseName)}`, A.as);
    check('Lọc status=DANG_MO không thấy khóa nháp', !ids(r).includes(id));

    r = await call('GET', '/mine?status=ABC', A.as);
    check('Lọc status sai -> 400', r.status === 400, `status ${r.status}`);

    r = await call('GET', `/mine/${id}`, A.as);
    check('Chi tiết khóa của mình -> 200', r.status === 200, `status ${r.status}`);

    r = await call('GET', `/mine/${id}`, B.as);
    check('Giáo viên B xem khóa của A -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Giáo viên sửa khóa học]');
    r = await call('PUT', `/${id}`, { ...A.as, body: { description: 'Đã sửa mô tả' } });
    check('Sửa mô tả -> 200', r.status === 200, `status ${r.status}`);
    check('Mô tả đã đổi, tên giữ nguyên', r.json?.data?.description === 'Đã sửa mô tả' && r.json?.data?.courseName === courseName);

    r = await call('PUT', `/${id}`, { ...B.as, body: { description: 'x' } });
    check('Giáo viên B sửa khóa của A -> 404', r.status === 404, `status ${r.status}`);

    r = await call('PUT', `/${id}`, { ...A.as, body: {} });
    check('Sửa với body rỗng -> 400', r.status === 400, `status ${r.status}`);

    r = await call('PUT', `/${id}`, { ...A.as, body: { status: 'DANG_MO' } });
    check('Giáo viên tự đổi status qua PUT -> 400', r.status === 400, `status ${r.status}`);

    r = await call('PUT', `/${id}`, { ...A.as, body: { endDate: '2026-11-01' } });
    check('Sửa ngày kết thúc trước ngày bắt đầu -> 400', r.status === 400, `status ${r.status}`);

    r = await call('PUT', `/${id}`, { ...A.as, body: { categoryId: hiddenCat.id } });
    check('Sửa sang danh mục ẩn -> 400', r.status === 400, `status ${r.status}`);

    console.log('\n[Gửi duyệt]');
    r = await call('POST', `/${id}/submit`, B.as);
    check('Giáo viên B gửi duyệt khóa của A -> 404', r.status === 404, `status ${r.status}`);

    r = await call('POST', `/${id}/submit`, A.as);
    check('Gửi duyệt -> 200, CHO_DUYET', r.status === 200 && r.json?.data?.status === 'CHO_DUYET', `status ${r.status}`);

    r = await call('POST', `/${id}/submit`, A.as);
    check('Gửi duyệt lần 2 -> 409', r.status === 409, `status ${r.status}`);

    r = await call('PUT', `/${id}`, { ...A.as, body: { description: 'sửa lúc chờ duyệt' } });
    check('Sửa khi đang chờ duyệt -> 409', r.status === 409, `status ${r.status}`);

    console.log('\n[Phân quyền quản trị]');
    r = await call('GET', '/manage', A.as);
    check('Giáo viên xem danh sách admin -> 403', r.status === 403, `status ${r.status}`);

    r = await call('POST', `/${id}/approve`, A.as);
    check('Giáo viên tự duyệt -> 403', r.status === 403, `status ${r.status}`);

    r = await call('PATCH', `/${id}/status`, { ...STUDENT, body: { status: 'DANG_MO' } });
    check('Học viên đổi trạng thái -> 403', r.status === 403, `status ${r.status}`);

    console.log('\n[Admin xem danh sách]');
    r = await call('GET', `/manage?status=CHO_DUYET&q=${encodeURIComponent(courseName)}`, ADMIN);
    check('Admin thấy khóa đang chờ duyệt', r.status === 200 && ids(r).includes(id), `status ${r.status}`);

    r = await call('GET', `/manage?categoryId=${cat.id}&teacherId=${A.teacher.id}`, ADMIN);
    check('Admin lọc theo danh mục + giáo viên', r.status === 200 && ids(r).includes(id));

    r = await call('GET', `/manage/${id}`, ADMIN);
    check('Chi tiết admin -> 200', r.status === 200, `status ${r.status}`);

    r = await call('GET', '/manage/id-khong-ton-tai', ADMIN);
    check('Chi tiết id không tồn tại -> 404', r.status === 404, `status ${r.status}`);

    r = await call('GET', '/manage?status=ABC', ADMIN);
    check('Admin lọc status sai -> 400', r.status === 400, `status ${r.status}`);

    console.log('\n[Admin duyệt / từ chối / đổi trạng thái]');
    r = await call('PATCH', `/${id}/status`, { ...ADMIN, body: { status: 'DANG_MO' } });
    check('Nhảy cóc CHO_DUYET -> DANG_MO -> 409', r.status === 409, `status ${r.status}`);

    r = await call('PATCH', `/${id}/status`, { ...ADMIN, body: { status: 'ABC' } });
    check('Trạng thái không hợp lệ -> 400', r.status === 400, `status ${r.status}`);

    r = await call('POST', `/${id}/reject`, ADMIN);
    check('Từ chối -> 200, về BAN_NHAP', r.status === 200 && r.json?.data?.status === 'BAN_NHAP', `status ${r.status}`);

    r = await call('POST', `/${id}/reject`, ADMIN);
    check('Từ chối lần 2 -> 409', r.status === 409, `status ${r.status}`);

    r = await call('PUT', `/${id}`, { ...A.as, body: { description: 'Sửa sau khi bị từ chối' } });
    check('Sau khi bị từ chối giáo viên sửa lại được -> 200', r.status === 200, `status ${r.status}`);

    r = await call('POST', `/${id}/submit`, A.as);
    check('Gửi duyệt lại -> 200', r.status === 200, `status ${r.status}`);

    r = await call('POST', `/${id}/approve`, ADMIN);
    check('Duyệt -> 200, DA_PHE_DUYET', r.status === 200 && r.json?.data?.status === 'DA_PHE_DUYET', `status ${r.status}`);

    r = await call('POST', `/${id}/approve`, ADMIN);
    check('Duyệt lần 2 -> 409', r.status === 409, `status ${r.status}`);

    r = await call('PUT', `/${id}`, { ...A.as, body: { price: 600000 } });
    check('Giáo viên sửa khi đã phê duyệt -> 200', r.status === 200, `status ${r.status}`);

    r = await call('PATCH', `/${id}/status`, { ...ADMIN, body: { status: 'DANG_MO' } });
    check('Mở khóa học -> 200, DANG_MO', r.status === 200 && r.json?.data?.status === 'DANG_MO', `status ${r.status}`);

    r = await call('PATCH', `/${id}/status`, { ...ADMIN, body: { status: 'TAM_NGUNG' } });
    check('Tạm ngưng -> 200', r.status === 200, `status ${r.status}`);

    r = await call('PATCH', `/${id}/status`, { ...ADMIN, body: { status: 'DANG_MO' } });
    check('Mở lại -> 200', r.status === 200, `status ${r.status}`);

    r = await call('PATCH', `/${id}/status`, { ...ADMIN, body: { status: 'DA_KET_THUC' } });
    check('Kết thúc -> 200', r.status === 200, `status ${r.status}`);

    r = await call('PATCH', `/${id}/status`, { ...ADMIN, body: { status: 'DANG_MO' } });
    check('Mở lại khóa đã kết thúc -> 409', r.status === 409, `status ${r.status}`);

    r = await call('PUT', `/${id}`, { ...A.as, body: { description: 'sửa khi đã kết thúc' } });
    check('Giáo viên sửa khóa đã kết thúc -> 409', r.status === 409, `status ${r.status}`);

    console.log('\n[Giáo viên chưa được duyệt]');
    const pCourse = await prisma.course.create({
      data: {
        courseName: `Khóa GV chưa duyệt ${stamp}`,
        description: 'Test',
        startDate: new Date('2026-12-01'),
        endDate: new Date('2026-12-31'),
        categoryId: cat.id,
        teacherId: P.teacher.id,
        status: 'CHO_DUYET',
      },
    });
    r = await call('POST', `/${pCourse.id}/approve`, ADMIN);
    check('Duyệt khóa của giáo viên chưa duyệt -> 200', r.status === 200, `status ${r.status}`);
    r = await call('PATCH', `/${pCourse.id}/status`, { ...ADMIN, body: { status: 'DANG_MO' } });
    check('Mở khóa của giáo viên chưa được duyệt -> 409', r.status === 409, `status ${r.status}`);

    console.log('\n[Danh mục bị ẩn sau khi duyệt]');
    const hCourse = await prisma.course.create({
      data: {
        courseName: `Khóa DM ẩn ${stamp}`,
        description: 'Test',
        startDate: new Date('2026-12-01'),
        endDate: new Date('2026-12-31'),
        categoryId: hiddenCat.id,
        teacherId: A.teacher.id,
        status: 'DA_PHE_DUYET',
      },
    });
    r = await call('PATCH', `/${hCourse.id}/status`, { ...ADMIN, body: { status: 'DANG_MO' } });
    check('Mở khóa thuộc danh mục đang ẩn -> 400', r.status === 400, `status ${r.status}`);
  } finally {
    // ----- Dọn dữ liệu tạm -----
    try {
      await prisma.course.deleteMany({ where: { categoryId: { in: [cat.id, hiddenCat.id] } } });
      await prisma.teacher.deleteMany({
        where: { id: { in: [A.teacher.id, B.teacher.id, P.teacher.id] } },
      });
      await prisma.account.deleteMany({
        where: { id: { in: [A.account.id, B.account.id, P.account.id] } },
      });
      await prisma.category.deleteMany({ where: { id: { in: [cat.id, hiddenCat.id] } } });
    } catch (e) {
      console.log(`\nCẢNH BÁO: dọn dữ liệu tạm bị lỗi (${e.message}). Kiểm tra pgAdmin4, xóa tay các dòng có "test ${stamp}".`);
    }
  }

  console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(failed ? 1 : 0);
  })
  .catch(async (e) => {
    console.error('\nLỗi khi chạy test (server đã chạy chưa? đúng port chưa?):', e.message);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  });