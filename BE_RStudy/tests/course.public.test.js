// Chạy: node tests/course.public.test.js   (server phải đang chạy ở terminal khác)
// Test tự tạo danh mục/giáo viên/khóa học/đánh giá tạm bằng Prisma và tự xóa khi xong.
require('dotenv').config();
const prisma = require('../src/config/database');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}/api/course`;
const stamp = Date.now();
const KEY = String(stamp);

let passed = 0;
let failed = 0;

const call = async (method, path, { role } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(role && { 'x-dev-role': role }) },
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
const sameSet = (a, b) => a.length === b.length && b.every((x) => a.includes(x));
const sameOrder = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const list = (qs) => call('GET', `?q=${KEY}&limit=50${qs ? `&${qs}` : ''}`);

async function main() {
  console.log(`Kiểm tra API Course công khai tại ${BASE}\n`);

  // ----- Chuẩn bị dữ liệu tạm -----
  const catA = await prisma.category.create({ data: { categoryName: `Pub A ${stamp}` } });
  const catB = await prisma.category.create({ data: { categoryName: `Pub B ${stamp}` } });
  const catHidden = await prisma.category.create({
    data: { categoryName: `Pub ẩn ${stamp}`, status: 'AN' },
  });

  const makeAccount = (tag, role) =>
    prisma.account.create({
      data: {
        fullName: `Pub ${tag}`,
        email: `pub.${tag}.${stamp}@example.com`,
        passwordHash: 'x',
        role,
        status: 'HOAT_DONG',
      },
    });

  const accT1 = await makeAccount('t1', 'TEACHER');
  const accT2 = await makeAccount('t2', 'TEACHER');
  const accS1 = await makeAccount('s1', 'STUDENT');
  const accS2 = await makeAccount('s2', 'STUDENT');

  const makeTeacher = (accountId) =>
    prisma.teacher.create({
      data: {
        specialization: 'Toán',
        biography: 'Tiểu sử giáo viên test',
        teachingExperience: '10 năm',
        approvalStatus: 'DA_DUYET',
        accountId,
      },
    });
  const t1 = await makeTeacher(accT1.id);
  const t2 = await makeTeacher(accT2.id);
  const s1 = await prisma.student.create({ data: { accountId: accS1.id } });
  const s2 = await prisma.student.create({ data: { accountId: accS2.id } });

  const makeCourse = (name, o) =>
    prisma.course.create({
      data: {
        courseName: name,
        description: o.description || 'Mô tả khóa học test',
        price: o.price ?? 0,
        startDate: new Date(o.start || '2026-12-01'),
        endDate: new Date('2027-06-01'),
        categoryId: o.cat,
        teacherId: o.teacher,
        status: o.status || 'DANG_MO',
      },
    });

  // 3 khóa công khai
  const c1 = await makeCourse(`Alpha ${stamp}`, { cat: catA.id, teacher: t1.id, price: 100000, start: '2026-12-01' });
  const c2 = await makeCourse(`Beta ${stamp}`, { cat: catA.id, teacher: t1.id, price: 300000, start: '2026-11-15' });
  const c3 = await makeCourse(`Gamma ${stamp}`, {
    cat: catB.id,
    teacher: t2.id,
    price: 0,
    start: '2027-01-10',
    description: `Có từ khóa riêng tukhoamo${stamp}`,
  });
  // 5 khóa KHÔNG được công khai
  const draft = await makeCourse(`Nhap ${stamp}`, { cat: catA.id, teacher: t1.id, status: 'BAN_NHAP' });
  const waiting = await makeCourse(`Cho ${stamp}`, { cat: catA.id, teacher: t1.id, status: 'CHO_DUYET' });
  const paused = await makeCourse(`Ngung ${stamp}`, { cat: catA.id, teacher: t1.id, status: 'TAM_NGUNG' });
  const ended = await makeCourse(`Xong ${stamp}`, { cat: catA.id, teacher: t1.id, status: 'DA_KET_THUC' });
  const hiddenCat = await makeCourse(`Han ${stamp}`, { cat: catHidden.id, teacher: t1.id, status: 'DANG_MO' });

  // Đánh giá: chỉ review HIEN_THI được tính
  await prisma.review.create({ data: { rating: 4, status: 'HIEN_THI', studentId: s1.id, courseId: c1.id } });
  await prisma.review.create({ data: { rating: 1, status: 'CHO_DUYET', studentId: s2.id, courseId: c1.id } });

  const allCourseIds = [c1, c2, c3, draft, waiting, paused, ended, hiddenCat].map((c) => c.id);

  try {
    let r;

    console.log('[Danh sách công khai]');
    r = await list();
    check('Không cần đăng nhập -> 200', r.status === 200, `status ${r.status} ${JSON.stringify(r.json)}`);
    check('Chỉ thấy 3 khóa đang mở', sameSet(ids(r), [c1.id, c2.id, c3.id]), JSON.stringify(ids(r)));
    check(
      'Không lộ khóa nháp, chờ duyệt, tạm ngưng, kết thúc, danh mục ẩn',
      ![draft, waiting, paused, ended, hiddenCat].some((c) => ids(r).includes(c.id))
    );
    check('Tổng số đúng (3)', r.json?.data?.pagination?.total === 3, String(r.json?.data?.pagination?.total));

    r = await call('GET', `?q=${KEY}&page=1&limit=2`); // không dùng list() vì nó đã tự gắn limit=50
    check('Phân trang limit=2 -> 2 phần tử, 2 trang', r.json?.data?.items?.length === 2 && r.json?.data?.pagination?.totalPages === 2);
    r = await call('GET', `?q=${KEY}&page=2&limit=2`);
    check('Trang 2 -> còn 1 phần tử', r.json?.data?.items?.length === 1);

    console.log('\n[Tìm kiếm]');
    r = await call('GET', `?q=${encodeURIComponent(`alpha ${stamp}`)}`);
    check('Tìm theo tên, không phân biệt hoa thường', sameSet(ids(r), [c1.id]), JSON.stringify(ids(r)));
    r = await call('GET', `?q=tukhoamo${stamp}`);
    check('Tìm theo nội dung mô tả', sameSet(ids(r), [c3.id]), JSON.stringify(ids(r)));
    r = await call('GET', `?q=${encodeURIComponent(`Nhap ${stamp}`)}`);
    check('Tìm tên khóa nháp -> không thấy', ids(r).length === 0);

    console.log('\n[Lọc]');
    r = await list(`categoryId=${catA.id}`);
    check('Lọc theo danh mục', sameSet(ids(r), [c1.id, c2.id]), JSON.stringify(ids(r)));
    r = await list(`categoryId=${catHidden.id}`);
    check('Lọc theo danh mục ẩn -> rỗng', ids(r).length === 0);
    r = await list(`teacherId=${t2.id}`);
    check('Lọc theo giáo viên', sameSet(ids(r), [c3.id]), JSON.stringify(ids(r)));
    r = await list('minPrice=100000');
    check('Lọc minPrice', sameSet(ids(r), [c1.id, c2.id]), JSON.stringify(ids(r)));
    r = await list('maxPrice=100000');
    check('Lọc maxPrice', sameSet(ids(r), [c1.id, c3.id]), JSON.stringify(ids(r)));
    r = await list('minPrice=50000&maxPrice=200000');
    check('Lọc khoảng giá', sameSet(ids(r), [c1.id]), JSON.stringify(ids(r)));
    r = await list(`categoryId=${catA.id}&maxPrice=100000`);
    check('Lọc kết hợp danh mục + giá', sameSet(ids(r), [c1.id]), JSON.stringify(ids(r)));

    console.log('\n[Sắp xếp]');
    r = await list('sort=price_asc');
    check('price_asc', sameOrder(ids(r), [c3.id, c1.id, c2.id]), JSON.stringify(ids(r)));
    r = await list('sort=price_desc');
    check('price_desc', sameOrder(ids(r), [c2.id, c1.id, c3.id]), JSON.stringify(ids(r)));
    r = await list('sort=name');
    check('name (A-Z)', sameOrder(ids(r), [c1.id, c2.id, c3.id]), JSON.stringify(ids(r)));
    r = await list('sort=start_soon');
    check('start_soon (sắp khai giảng trước)', sameOrder(ids(r), [c2.id, c1.id, c3.id]), JSON.stringify(ids(r)));

    console.log('\n[Tham số sai]');
    r = await list('sort=abc');
    check('sort sai -> 400', r.status === 400, `status ${r.status}`);
    r = await list('minPrice=abc');
    check('minPrice không phải số -> 400', r.status === 400, `status ${r.status}`);
    r = await list('minPrice=-1');
    check('minPrice âm -> 400', r.status === 400, `status ${r.status}`);
    r = await list('minPrice=500&maxPrice=100');
    check('minPrice lớn hơn maxPrice -> 400', r.status === 400, `status ${r.status}`);
    r = await call('GET', '?q=&minPrice=&maxPrice=&sort=');
    check('Tham số rỗng được bỏ qua -> 200', r.status === 200, `status ${r.status}`);

    console.log('\n[Dữ liệu trả về]');
    r = await list('sort=name');
    const item = r.json?.data?.items?.[0];
    check('Có danh mục và giáo viên', !!item?.category?.categoryName && !!item?.teacher?.account?.fullName);
    check('Học phí dạng chuỗi', typeof item?.price === 'string', typeof item?.price);
    check('Không lộ status', item && !('status' in item));
    check('Không lộ trạng thái duyệt của giáo viên', item?.teacher && !('approvalStatus' in item.teacher));
    check('Không lộ email giáo viên', item?.teacher?.account && !('email' in item.teacher.account));

    console.log('\n[Điểm đánh giá]');
    r = await list('sort=name');
    const byId = Object.fromEntries((r.json?.data?.items || []).map((i) => [i.id, i]));
    check('Khóa có đánh giá: trung bình 4, 1 lượt (bỏ review chưa duyệt)', byId[c1.id]?.averageRating === 4 && byId[c1.id]?.reviewCount === 1, JSON.stringify([byId[c1.id]?.averageRating, byId[c1.id]?.reviewCount]));
    check('Khóa chưa có đánh giá: null, 0 lượt', byId[c2.id]?.averageRating === null && byId[c2.id]?.reviewCount === 0);

    console.log('\n[Chi tiết công khai]');
    r = await call('GET', `/${c1.id}`);
    check('Chi tiết khóa đang mở -> 200', r.status === 200, `status ${r.status}`);
    check('Có tiểu sử và kinh nghiệm giáo viên', !!r.json?.data?.teacher?.biography && !!r.json?.data?.teacher?.teachingExperience);
    check('Có điểm đánh giá', r.json?.data?.averageRating === 4 && r.json?.data?.reviewCount === 1);
    check('Không lộ status', r.json?.data && !('status' in r.json.data));
    check('Không lộ email giáo viên', r.json?.data?.teacher?.account && !('email' in r.json.data.teacher.account));

    for (const [label, c] of [
      ['nháp', draft],
      ['chờ duyệt', waiting],
      ['tạm ngưng', paused],
      ['đã kết thúc', ended],
      ['thuộc danh mục ẩn', hiddenCat],
    ]) {
      r = await call('GET', `/${c.id}`);
      check(`Chi tiết khóa ${label} -> 404`, r.status === 404, `status ${r.status}`);
    }
    r = await call('GET', '/id-khong-ton-tai');
    check('Chi tiết id không tồn tại -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Thứ tự route]');
    r = await call('GET', '/manage', { role: 'STUDENT' });
    check('/manage không bị /:id nuốt -> 403', r.status === 403, `status ${r.status}`);
    r = await call('GET', '/mine', { role: 'STUDENT' });
    check('/mine không bị /:id nuốt -> 403', r.status === 403, `status ${r.status}`);
  } finally {
    // ----- Dọn dữ liệu tạm -----
    try {
      await prisma.review.deleteMany({ where: { courseId: { in: allCourseIds } } });
      await prisma.course.deleteMany({ where: { id: { in: allCourseIds } } });
      await prisma.student.deleteMany({ where: { id: { in: [s1.id, s2.id] } } });
      await prisma.teacher.deleteMany({ where: { id: { in: [t1.id, t2.id] } } });
      await prisma.account.deleteMany({
        where: { id: { in: [accT1.id, accT2.id, accS1.id, accS2.id] } },
      });
      await prisma.category.deleteMany({ where: { id: { in: [catA.id, catB.id, catHidden.id] } } });
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