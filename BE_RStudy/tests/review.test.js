// Chạy: node tests/review.test.js   (server phải đang chạy ở terminal khác)
// Test tự tạo giáo viên/học viên/khóa học/đăng ký tạm bằng Prisma và tự xóa khi xong.
require('dotenv').config();
const prisma = require('../src/config/database');
const { signAccessToken } = require('../src/utils/jwt');

// Token thử nghiệm giống hệt token mà authService.login cấp: sub = mã tài khoản, role = vai trò.
// Không có role thì không gửi gì (gọi công khai). Thiếu who thì dùng một mã giả (ví dụ quản trị viên).
const authHeaders = ({ who, role } = {}) =>
  role
    ? { Authorization: `Bearer ${signAccessToken({ sub: who || `test-${role.toLowerCase()}`, role })}` }
    : {};

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}/api/review`;
const stamp = Date.now();

let passed = 0;
let failed = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const call = async (method, path, { who, role, body } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders({ role, who }) },
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
const sameOrder = (a, b) => JSON.stringify(a) === JSON.stringify(b);

async function main() {
  console.log(`Kiểm tra API Review/Review response tại ${BASE}\n`);

  // ----- Chuẩn bị dữ liệu tạm -----
  const cat = await prisma.category.create({ data: { categoryName: `Rv cat ${stamp}` } });
  const hiddenCat = await prisma.category.create({
    data: { categoryName: `Rv cat ẩn ${stamp}`, status: 'AN' },
  });

  const makeAccount = (tag, role) =>
    prisma.account.create({
      data: {
        fullName: `Rv ${tag}`,
        email: `rv.${tag}.${stamp}@example.com`,
        passwordHash: 'x',
        role,
        status: 'HOAT_DONG',
      },
    });

  const accT1 = await makeAccount('t1', 'TEACHER'); // giáo viên phụ trách
  const accT2 = await makeAccount('t2', 'TEACHER'); // giáo viên khác
  const accS = {};
  for (const tag of ['s1', 's2', 's3', 's4', 's5', 's6']) accS[tag] = await makeAccount(tag, 'STUDENT');

  const makeTeacher = (accountId) =>
    prisma.teacher.create({
      data: { specialization: 'Test', biography: 'Test', teachingExperience: 'Test', approvalStatus: 'DA_DUYET', accountId },
    });
  const t1 = await makeTeacher(accT1.id);
  const t2 = await makeTeacher(accT2.id);

  // s6 chỉ có tài khoản, không có hồ sơ học viên
  const stu = {};
  for (const tag of ['s1', 's2', 's3', 's4', 's5']) {
    stu[tag] = await prisma.student.create({ data: { accountId: accS[tag].id } });
  }

  const makeCourse = (name, status, categoryId = cat.id) =>
    prisma.course.create({
      data: {
        courseName: `${name} ${stamp}`,
        description: 'Test',
        startDate: new Date('2026-12-01'),
        endDate: new Date('2027-06-01'),
        categoryId,
        teacherId: t1.id,
        status,
      },
    });
  const cOpen = await makeCourse('Rv open', 'DANG_MO');
  const cEnded = await makeCourse('Rv ended', 'DA_KET_THUC');
  const cDraft = await makeCourse('Rv draft', 'BAN_NHAP');
  const cHidden = await makeCourse('Rv hidden', 'DANG_MO', hiddenCat.id);
  const courseIds = [cOpen.id, cEnded.id, cDraft.id, cHidden.id];

  const reg = (tag, courseId, status) =>
    prisma.courseRegistration.create({ data: { studentId: stu[tag].id, courseId, status } });
  await reg('s1', cOpen.id, 'DA_THANH_TOAN');
  await reg('s2', cOpen.id, 'CHO_THANH_TOAN');
  await reg('s3', cOpen.id, 'HOAN_TIEN');
  await reg('s4', cOpen.id, 'HOAN_THANH');
  await reg('s4', cEnded.id, 'HOAN_THANH');
  // s5: có hồ sơ học viên nhưng chưa đăng ký; s6: không có hồ sơ học viên

  // Đánh giá bị ẩn do vi phạm (tạo thẳng bằng Prisma; admin xử lý ở module Report)
  const violated = await prisma.review.create({
    data: { rating: 1, content: 'Vi phạm', status: 'VI_PHAM', studentId: stu.s3.id, courseId: cOpen.id },
  });

  const S = (tag) => ({ who: accS[tag].id, role: 'STUDENT' });
  const T = (acc) => ({ who: acc.id, role: 'TEACHER' });
  const ADMIN = { role: 'ADMINISTRATOR' };
  const path = `/course/${cOpen.id}`;

  try {
    let r;

    console.log('[Gửi đánh giá: điều kiện đăng ký]');
    r = await call('POST', path, { ...S('s1'), body: { rating: 5, content: '  Rất tốt  ' } });
    check('Học viên đã thanh toán -> 201', r.status === 201, `status ${r.status} ${JSON.stringify(r.json)}`);
    const rev1 = r.json?.data;
    if (!rev1?.id) {
      console.log('\nKhông gửi được đánh giá, dừng test. Xem log ở terminal chạy server.');
      return;
    }
    check('Số sao và nhận xét đúng, nhận xét được cắt khoảng trắng', rev1.rating === 5 && rev1.content === 'Rất tốt', JSON.stringify([rev1.rating, rev1.content]));
    check('Có thông tin người viết, isMine và danh sách câu trả lời', rev1.student?.account?.fullName === 'Rv s1' && rev1.isMine === true && Array.isArray(rev1.responses));
    check('Không lộ email người viết', rev1.student?.account && !('email' in rev1.student.account));
    await sleep(20);

    r = await call('POST', path, { ...S('s4'), body: { rating: '3' } });
    check('Học viên đã hoàn thành, số sao dạng chuỗi, không nhận xét -> 201', r.status === 201 && r.json?.data?.rating === 3 && r.json?.data?.content === null, `status ${r.status}`);
    const rev4 = r.json?.data;

    r = await call('POST', `/course/${cEnded.id}`, { ...S('s4'), body: { rating: 4 } });
    check('Đánh giá khóa đã kết thúc vẫn được -> 201', r.status === 201, `status ${r.status}`);

    r = await call('POST', path, { ...S('s1'), body: { rating: 4 } });
    check('Đánh giá lần 2 cùng khóa -> 409', r.status === 409, `status ${r.status}`);

    r = await call('POST', path, { ...S('s2'), body: { rating: 4 } });
    check('Học viên chờ thanh toán -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...S('s3'), body: { rating: 4 } });
    check('Học viên đã hoàn tiền -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...S('s5'), body: { rating: 4 } });
    check('Học viên chưa đăng ký -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...S('s6'), body: { rating: 4 } });
    check('Tài khoản học viên chưa có hồ sơ -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...T(accT1), body: { rating: 4 } });
    check('Giáo viên gửi đánh giá -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...ADMIN, body: { rating: 4 } });
    check('Quản trị viên gửi đánh giá -> 403', r.status === 403, `status ${r.status}`);

    console.log('\n[Gửi đánh giá: dữ liệu sai]');
    r = await call('POST', path, { ...S('s1'), body: { content: 'chưa chọn sao' } });
    check('Chưa chọn số sao -> 400', r.status === 400, `status ${r.status}`);
    r = await call('POST', path, { ...S('s1'), body: {} });
    check('Body rỗng -> 400', r.status === 400, `status ${r.status}`);
    for (const bad of [0, 6, 3.5, 'abc', null]) {
      r = await call('POST', path, { ...S('s1'), body: { rating: bad } });
      check(`Số sao ${JSON.stringify(bad)} -> 400`, r.status === 400, `status ${r.status}`);
    }
    r = await call('POST', path, { ...S('s1'), body: { rating: 5, content: 'a'.repeat(1001) } });
    check('Nhận xét quá 1000 ký tự -> 400', r.status === 400, `status ${r.status}`);
    r = await call('POST', '/course/id-khong-ton-tai', { ...S('s1'), body: { rating: 5 } });
    check('Khóa không tồn tại -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Đánh giá của tôi]');
    r = await call('GET', `${path}/mine`, S('s1'));
    check('Học viên đã đánh giá lấy lại đánh giá của mình -> 200', r.status === 200 && r.json?.data?.id === rev1.id, `status ${r.status}`);
    r = await call('GET', `${path}/mine`, S('s5'));
    check('Học viên chưa đánh giá -> 200, null', r.status === 200 && r.json?.data === null, `status ${r.status}`);
    r = await call('GET', `${path}/mine`, S('s6'));
    check('Tài khoản chưa có hồ sơ học viên -> 200, null', r.status === 200 && r.json?.data === null, `status ${r.status}`);
    r = await call('GET', `${path}/mine`, T(accT1));
    check('Giáo viên gọi /mine -> 403', r.status === 403, `status ${r.status}`);
    r = await call('GET', '/course/id-khong-ton-tai/mine', S('s1'));
    check('/mine của khóa không tồn tại -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Danh sách đánh giá công khai]');
    r = await call('GET', path);
    check('Không cần đăng nhập -> 200', r.status === 200, `status ${r.status}`);
    check('Mới nhất ở trên, không lộ đánh giá vi phạm', sameOrder(ids(r), [rev4.id, rev1.id]), JSON.stringify(ids(r)));
    check('Điểm trung bình 4 và 2 lượt đánh giá', r.json?.data?.summary?.averageRating === 4 && r.json?.data?.summary?.reviewCount === 2, JSON.stringify(r.json?.data?.summary));
    const item = r.json?.data?.items?.[0];
    check('Không lộ email và status', item && !('status' in item) && !('email' in (item.student?.account || {})));
    check('Có phân trang', r.json?.data?.pagination?.total === 2);

    r = await call('GET', `${path}?rating=5`);
    check('Lọc 5 sao', sameOrder(ids(r), [rev1.id]), JSON.stringify(ids(r)));
    check('Điểm tổng hợp không đổi khi lọc sao', r.json?.data?.summary?.reviewCount === 2);
    r = await call('GET', `${path}?rating=3`);
    check('Lọc 3 sao', sameOrder(ids(r), [rev4.id]), JSON.stringify(ids(r)));
    r = await call('GET', `${path}?rating=abc`);
    check('Lọc số sao sai -> 400', r.status === 400, `status ${r.status}`);
    r = await call('GET', `${path}?rating=9`);
    check('Lọc số sao ngoài 1 đến 5 -> 400', r.status === 400, `status ${r.status}`);
    r = await call('GET', `${path}?rating=`);
    check('Tham số rỗng được bỏ qua -> 200', r.status === 200, `status ${r.status}`);

    r = await call('GET', `${path}?page=1&limit=1`);
    check('Phân trang limit=1 -> 1 phần tử, 2 trang', r.json?.data?.items?.length === 1 && r.json?.data?.pagination?.totalPages === 2);
    r = await call('GET', `${path}?page=2&limit=1`);
    check('Trang 2 -> còn 1 phần tử', r.json?.data?.items?.length === 1);

    r = await call('GET', `/course/${cDraft.id}`);
    check('Khóa nháp -> 404', r.status === 404, `status ${r.status}`);
    r = await call('GET', `/course/${cEnded.id}`);
    check('Khóa đã kết thúc không công khai -> 404', r.status === 404, `status ${r.status}`);
    r = await call('GET', `/course/${cHidden.id}`);
    check('Khóa thuộc danh mục ẩn -> 404', r.status === 404, `status ${r.status}`);
    r = await call('GET', '/course/id-khong-ton-tai');
    check('Khóa không tồn tại -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Sửa đánh giá]');
    r = await call('PUT', `/${rev1.id}`, { ...S('s1'), body: { rating: 4 } });
    check('Chủ đánh giá sửa số sao -> 200', r.status === 200 && r.json?.data?.rating === 4, `status ${r.status}`);
    r = await call('GET', path);
    check('Điểm trung bình tính lại (4 và 3 = 3.5)', r.json?.data?.summary?.averageRating === 3.5 && r.json?.data?.summary?.reviewCount === 2, JSON.stringify(r.json?.data?.summary));
    r = await call('PUT', `/${rev1.id}`, { ...S('s1'), body: { content: 'Đã sửa nhận xét' } });
    check('Sửa riêng nhận xét, số sao giữ nguyên', r.status === 200 && r.json?.data?.content === 'Đã sửa nhận xét' && r.json?.data?.rating === 4, `status ${r.status}`);
    r = await call('PUT', `/${rev1.id}`, { ...S('s1'), body: { content: null } });
    check('Xóa nhận xét (null) -> 200', r.status === 200 && r.json?.data?.content === null, `status ${r.status}`);
    r = await call('PUT', `/${rev1.id}`, { ...S('s1'), body: {} });
    check('Sửa với body rỗng -> 400', r.status === 400, `status ${r.status}`);
    r = await call('PUT', `/${rev1.id}`, { ...S('s1'), body: { rating: 7 } });
    check('Sửa số sao sai -> 400', r.status === 400, `status ${r.status}`);
    r = await call('PUT', `/${rev1.id}`, { ...S('s4'), body: { rating: 1 } });
    check('Học viên khác sửa -> 403', r.status === 403, `status ${r.status}`);
    r = await call('PUT', `/${rev1.id}`, { ...T(accT1), body: { rating: 1 } });
    check('Giáo viên sửa đánh giá -> 403', r.status === 403, `status ${r.status}`);
    r = await call('PUT', '/id-khong-ton-tai', { ...S('s1'), body: { rating: 1 } });
    check('Sửa đánh giá không tồn tại -> 404', r.status === 404, `status ${r.status}`);
    r = await call('PUT', `/${violated.id}`, { ...S('s3'), body: { rating: 5 } });
    check('Sửa đánh giá đã bị ẩn do vi phạm -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Giáo viên trả lời đánh giá]');
    r = await call('POST', `/${rev1.id}/responses`, { ...T(accT1), body: { content: '  Cảm ơn bạn  ' } });
    check('Giáo viên phụ trách trả lời -> 201', r.status === 201, `status ${r.status} ${JSON.stringify(r.json)}`);
    const resp = r.json?.data;
    check('Nội dung được cắt khoảng trắng, có nhãn vai trò TEACHER', resp?.content === 'Cảm ơn bạn' && resp?.account?.role === 'TEACHER' && resp?.isMine === true);
    r = await call('POST', `/${rev1.id}/responses`, { ...T(accT1), body: { content: 'Trả lời lần 2' } });
    check('Trả lời lần 2 cho cùng đánh giá -> 409', r.status === 409, `status ${r.status}`);
    r = await call('POST', `/${rev1.id}/responses`, { ...T(accT2), body: { content: 'x' } });
    check('Giáo viên không phụ trách -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', `/${rev1.id}/responses`, { ...S('s1'), body: { content: 'x' } });
    check('Học viên trả lời đánh giá -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', `/${rev1.id}/responses`, { ...ADMIN, body: { content: 'x' } });
    check('Quản trị viên trả lời -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', `/${rev4.id}/responses`, { ...T(accT1), body: { content: '' } });
    check('Câu trả lời rỗng -> 400', r.status === 400, `status ${r.status}`);
    r = await call('POST', '/id-khong-ton-tai/responses', { ...T(accT1), body: { content: 'x' } });
    check('Trả lời đánh giá không tồn tại -> 404', r.status === 404, `status ${r.status}`);
    r = await call('POST', `/${violated.id}/responses`, { ...T(accT1), body: { content: 'x' } });
    check('Trả lời đánh giá vi phạm -> 404', r.status === 404, `status ${r.status}`);

    r = await call('GET', path);
    const shown = (r.json?.data?.items || []).find((i) => i.id === rev1.id);
    check('Câu trả lời nằm trong đánh giá, có tên giáo viên', shown?.responses?.length === 1 && shown.responses[0].account?.fullName === 'Rv t1');
    check('Không lộ email giáo viên', shown?.responses?.[0]?.account && !('email' in shown.responses[0].account));

    console.log('\n[Sửa và xóa câu trả lời]');
    r = await call('PUT', `/responses/${resp.id}`, { ...T(accT1), body: { content: 'Đã sửa câu trả lời' } });
    check('Chủ câu trả lời sửa -> 200', r.status === 200 && r.json?.data?.content === 'Đã sửa câu trả lời', `status ${r.status}`);
    r = await call('PUT', `/responses/${resp.id}`, { ...T(accT2), body: { content: 'x' } });
    check('Giáo viên khác sửa -> 403', r.status === 403, `status ${r.status}`);
    r = await call('PUT', `/responses/${resp.id}`, { ...S('s1'), body: { content: 'x' } });
    check('Học viên sửa câu trả lời -> 403', r.status === 403, `status ${r.status}`);
    r = await call('PUT', `/responses/${resp.id}`, { ...T(accT1), body: { content: '' } });
    check('Sửa thành rỗng -> 400', r.status === 400, `status ${r.status}`);
    r = await call('DELETE', `/responses/${resp.id}`, T(accT2));
    check('Giáo viên khác xóa -> 403', r.status === 403, `status ${r.status}`);
    r = await call('DELETE', `/responses/${resp.id}`, T(accT1));
    check('Chủ câu trả lời xóa -> 200', r.status === 200, `status ${r.status}`);
    r = await call('DELETE', `/responses/${resp.id}`, T(accT1));
    check('Xóa lần 2 -> 404', r.status === 404, `status ${r.status}`);
    r = await call('PUT', `/responses/${resp.id}`, { ...T(accT1), body: { content: 'x' } });
    check('Sửa câu trả lời đã xóa -> 404', r.status === 404, `status ${r.status}`);
    r = await call('GET', path);
    const afterDelete = (r.json?.data?.items || []).find((i) => i.id === rev1.id);
    check('Câu trả lời đã xóa biến mất khỏi danh sách', afterDelete && afterDelete.responses.length === 0);
    r = await call('POST', `/${rev1.id}/responses`, { ...T(accT1), body: { content: 'Trả lời lại sau khi xóa' } });
    check('Xóa rồi được trả lời lại -> 201', r.status === 201, `status ${r.status}`);
    const row = await prisma.reviewResponse.findUnique({ where: { id: resp.id } });
    check('Chỉ ẩn, không xóa cứng (status AN trong database)', row?.status === 'AN', row?.status);
  } finally {
    // ----- Dọn dữ liệu tạm -----
    try {
      await prisma.reviewResponse.deleteMany({ where: { review: { courseId: { in: courseIds } } } });
      await prisma.review.deleteMany({ where: { courseId: { in: courseIds } } });
      await prisma.courseRegistration.deleteMany({ where: { courseId: { in: courseIds } } });
      await prisma.course.deleteMany({ where: { id: { in: courseIds } } });
      await prisma.student.deleteMany({ where: { id: { in: Object.values(stu).map((s) => s.id) } } });
      await prisma.teacher.deleteMany({ where: { id: { in: [t1.id, t2.id] } } });
      await prisma.account.deleteMany({
        where: { id: { in: [accT1.id, accT2.id, ...Object.values(accS).map((a) => a.id)] } },
      });
      await prisma.category.deleteMany({ where: { id: { in: [cat.id, hiddenCat.id] } } });
    } catch (e) {
      console.log(`\nCẢNH BÁO: dọn dữ liệu tạm bị lỗi (${e.message}). Vào pgAdmin4 xóa tay các dòng có "${stamp}".`);
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