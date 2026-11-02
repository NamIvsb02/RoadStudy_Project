require('dotenv').config();
const prisma = require('../src/config/database');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}/api/comment`;
const stamp = Date.now();

let passed = 0;
let failed = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const call = async (method, path, { who, role, body } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(role && { 'x-dev-role': role }),
      ...(who && { 'x-dev-user-id': who }),
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

async function main() {
  console.log(`Kiểm tra API Comment/Reply tại ${BASE}\n`);

  // ----- Chuẩn bị dữ liệu tạm -----
  const cat = await prisma.category.create({ data: { categoryName: `Cm cat ${stamp}` } });

  const makeAccount = (tag, role) =>
    prisma.account.create({
      data: {
        fullName: `Cm ${tag}`,
        email: `cm.${tag}.${stamp}@example.com`,
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

  const makeCourse = (name, teacherId, status) =>
    prisma.course.create({
      data: {
        courseName: `${name} ${stamp}`,
        description: 'Test',
        startDate: new Date('2026-12-01'),
        endDate: new Date('2027-06-01'),
        categoryId: cat.id,
        teacherId,
        status,
      },
    });
  const cOpen = await makeCourse('Cm open', t1.id, 'DANG_MO');
  const cOther = await makeCourse('Cm other', t2.id, 'DANG_MO');
  const cDraft = await makeCourse('Cm draft', t1.id, 'BAN_NHAP');
  const courseIds = [cOpen.id, cOther.id, cDraft.id];

  const reg = (tag, courseId, status) =>
    prisma.courseRegistration.create({ data: { studentId: stu[tag].id, courseId, status } });
  await reg('s1', cOpen.id, 'DA_THANH_TOAN');
  await reg('s2', cOpen.id, 'CHO_THANH_TOAN');
  await reg('s3', cOpen.id, 'HOAN_TIEN');
  await reg('s4', cOpen.id, 'HOAN_THANH');
  // s5: có hồ sơ học viên nhưng chưa đăng ký; s6: không có hồ sơ học viên

  const S = (tag) => ({ who: accS[tag].id, role: 'STUDENT' });
  const T = (acc) => ({ who: acc.id, role: 'TEACHER' });
  const ADMIN = { role: 'ADMINISTRATOR' };
  const ok = (content) => ({ body: { content } });

  // Bình luận ẩn do vi phạm (tạo thẳng bằng Prisma, admin sẽ xử lý ở module khác)
  const violated = await prisma.comment.create({
    data: { content: 'Vi phạm', courseId: cOpen.id, commenterAccountId: accS.s1.id, status: 'VI_PHAM' },
  });
  // Bình luận thuộc khóa nháp
  const draftComment = await prisma.comment.create({
    data: { content: 'Ở khóa nháp', courseId: cDraft.id, commenterAccountId: accT1.id },
  });

  try {
    let r;
    const path = `/course/${cOpen.id}`;

    console.log('[Gửi bình luận: điều kiện đăng ký]');
    r = await call('POST', path, { ...S('s1'), ...ok('  Bình luận của s1  ') });
    check('Học viên đã thanh toán -> 201', r.status === 201, `status ${r.status} ${JSON.stringify(r.json)}`);
    const cm1 = r.json?.data;
    if (!cm1?.id) {
      console.log('\nKhông gửi được bình luận, dừng test. Xem log ở terminal chạy server.');
      return;
    }
    check('Nội dung được cắt khoảng trắng', cm1.content === 'Bình luận của s1', cm1.content);
    check('Có thông tin người viết và isMine', cm1.commenter?.fullName === 'Cm s1' && cm1.isMine === true && Array.isArray(cm1.replies));
    check('Không lộ email người viết', cm1.commenter && !('email' in cm1.commenter));
    await sleep(20);

    r = await call('POST', path, { ...S('s4'), ...ok('Bình luận của s4') });
    check('Học viên đã hoàn thành -> 201', r.status === 201, `status ${r.status}`);
    const cm2 = r.json?.data;
    await sleep(20);

    r = await call('POST', path, { ...S('s2'), ...ok('x') });
    check('Học viên chờ thanh toán -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...S('s3'), ...ok('x') });
    check('Học viên đã hoàn tiền -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...S('s5'), ...ok('x') });
    check('Học viên chưa đăng ký -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...S('s6'), ...ok('x') });
    check('Tài khoản học viên chưa có hồ sơ -> 403', r.status === 403, `status ${r.status}`);

    console.log('\n[Gửi bình luận: giáo viên và vai trò khác]');
    r = await call('POST', path, { ...T(accT1), ...ok('Giáo viên phụ trách trả lời chung') });
    check('Giáo viên phụ trách -> 201', r.status === 201, `status ${r.status}`);
    const cm3 = r.json?.data;
    check('Người viết có vai trò TEACHER (để gắn nhãn)', cm3?.commenter?.role === 'TEACHER');
    r = await call('POST', path, { ...T(accT2), ...ok('x') });
    check('Giáo viên không phụ trách -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', `/course/${cOther.id}`, { ...T(accT1), ...ok('x') });
    check('Giáo viên bình luận khóa của giáo viên khác -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', path, { ...ADMIN, ...ok('x') });
    check('Quản trị viên -> 403', r.status === 403, `status ${r.status}`);

    console.log('\n[Gửi bình luận: dữ liệu sai và khóa chưa mở]');
    r = await call('POST', path, { ...S('s1'), ...ok('') });
    check('Nội dung rỗng -> 400', r.status === 400, `status ${r.status}`);
    r = await call('POST', path, { ...S('s1'), ...ok('     ') });
    check('Nội dung toàn khoảng trắng -> 400', r.status === 400, `status ${r.status}`);
    r = await call('POST', path, { ...S('s1'), ...ok('a'.repeat(1001)) });
    check('Nội dung quá 1000 ký tự -> 400', r.status === 400, `status ${r.status}`);
    r = await call('POST', path, { ...S('s1'), body: {} });
    check('Thiếu content -> 400', r.status === 400, `status ${r.status}`);
    r = await call('POST', `/course/${cDraft.id}`, { ...T(accT1), ...ok('x') });
    check('Khóa chưa mở -> 404', r.status === 404, `status ${r.status}`);
    r = await call('POST', '/course/id-khong-ton-tai', { ...S('s1'), ...ok('x') });
    check('Khóa không tồn tại -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Danh sách bình luận]');
    r = await call('GET', path, S('s1'));
    check('Học viên xem danh sách -> 200', r.status === 200, `status ${r.status}`);
    check('Mới nhất ở trên', JSON.stringify(ids(r)) === JSON.stringify([cm3.id, cm2.id, cm1.id]), JSON.stringify(ids(r)));
    check('Không lộ bình luận vi phạm', !ids(r).includes(violated.id));
    const mine = Object.fromEntries((r.json?.data?.items || []).map((i) => [i.id, i.isMine]));
    check('isMine đúng cho từng bình luận', mine[cm1.id] === true && mine[cm2.id] === false && mine[cm3.id] === false);
    check('Có phân trang', r.json?.data?.pagination?.total === 3);

    r = await call('GET', path, S('s5'));
    check('Học viên chưa đăng ký vẫn xem được -> 200', r.status === 200, `status ${r.status}`);
    r = await call('GET', path, ADMIN);
    check('Quản trị viên xem được -> 200', r.status === 200, `status ${r.status}`);
    r = await call('GET', `${path}?page=1&limit=2`, S('s1'));
    check('Phân trang limit=2 -> 2 phần tử, 2 trang', r.json?.data?.items?.length === 2 && r.json?.data?.pagination?.totalPages === 2);
    r = await call('GET', `${path}?page=2&limit=2`, S('s1'));
    check('Trang 2 -> còn 1 phần tử', r.json?.data?.items?.length === 1);
    r = await call('GET', `/course/${cDraft.id}`, S('s1'));
    check('Danh sách của khóa chưa mở -> 404', r.status === 404, `status ${r.status}`);
    r = await call('GET', '/course/id-khong-ton-tai', S('s1'));
    check('Danh sách của khóa không tồn tại -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Phản hồi]');
    r = await call('POST', `/${cm3.id}/replies`, { ...S('s1'), ...ok('s1 trả lời giáo viên') });
    check('Học viên đã đăng ký phản hồi -> 201', r.status === 201, `status ${r.status} ${JSON.stringify(r.json)}`);
    const rp1 = r.json?.data;
    await sleep(20);
    r = await call('POST', `/${cm1.id}/replies`, { ...T(accT1), ...ok('Giáo viên trả lời s1') });
    check('Giáo viên phụ trách phản hồi -> 201', r.status === 201, `status ${r.status}`);
    const rp2 = r.json?.data;
    await sleep(20);
    r = await call('POST', `/${cm1.id}/replies`, { ...S('s4'), ...ok('s4 trả lời s1') });
    check('Học viên hoàn thành phản hồi -> 201', r.status === 201, `status ${r.status}`);
    const rp3 = r.json?.data;

    r = await call('POST', `/${cm1.id}/replies`, { ...S('s2'), ...ok('x') });
    check('Học viên chờ thanh toán phản hồi -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', `/${cm1.id}/replies`, { ...S('s5'), ...ok('x') });
    check('Học viên chưa đăng ký phản hồi -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', `/${cm1.id}/replies`, { ...T(accT2), ...ok('x') });
    check('Giáo viên không phụ trách phản hồi -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', `/${cm1.id}/replies`, { ...ADMIN, ...ok('x') });
    check('Quản trị viên phản hồi -> 403', r.status === 403, `status ${r.status}`);
    r = await call('POST', `/${cm1.id}/replies`, { ...S('s1'), ...ok('') });
    check('Phản hồi rỗng -> 400', r.status === 400, `status ${r.status}`);
    r = await call('POST', '/id-khong-ton-tai/replies', { ...S('s1'), ...ok('x') });
    check('Phản hồi bình luận không tồn tại -> 404', r.status === 404, `status ${r.status}`);
    r = await call('POST', `/${violated.id}/replies`, { ...S('s1'), ...ok('x') });
    check('Phản hồi bình luận vi phạm -> 404', r.status === 404, `status ${r.status}`);
    r = await call('POST', `/${draftComment.id}/replies`, { ...T(accT1), ...ok('x') });
    check('Phản hồi bình luận của khóa chưa mở -> 404', r.status === 404, `status ${r.status}`);

    r = await call('GET', path, S('s1'));
    const shown = (r.json?.data?.items || []).find((i) => i.id === cm1.id);
    check('Phản hồi nằm trong bình luận, cũ nhất ở trên', JSON.stringify((shown?.replies || []).map((x) => x.id)) === JSON.stringify([rp2.id, rp3.id]));
    check('Phản hồi có người viết và isMine', shown?.replies?.[0]?.replier?.role === 'TEACHER' && shown?.replies?.[0]?.isMine === false);

    console.log('\n[Sửa bình luận]');
    r = await call('PUT', `/${cm1.id}`, { ...S('s1'), ...ok('Đã sửa') });
    check('Chủ bình luận sửa -> 200', r.status === 200 && r.json?.data?.content === 'Đã sửa', `status ${r.status}`);
    r = await call('PUT', `/${cm1.id}`, { ...S('s4'), ...ok('x') });
    check('Học viên khác sửa -> 403', r.status === 403, `status ${r.status}`);
    r = await call('PUT', `/${cm1.id}`, { ...T(accT1), ...ok('x') });
    check('Giáo viên sửa bình luận của học viên -> 403', r.status === 403, `status ${r.status}`);
    r = await call('PUT', `/${cm1.id}`, { ...S('s1'), ...ok('') });
    check('Sửa thành rỗng -> 400', r.status === 400, `status ${r.status}`);
    r = await call('PUT', '/id-khong-ton-tai', { ...S('s1'), ...ok('x') });
    check('Sửa bình luận không tồn tại -> 404', r.status === 404, `status ${r.status}`);
    r = await call('PUT', `/${violated.id}`, { ...S('s1'), ...ok('x') });
    check('Sửa bình luận đã bị ẩn do vi phạm -> 404', r.status === 404, `status ${r.status}`);

    console.log('\n[Sửa và xóa phản hồi]');
    r = await call('PUT', `/replies/${rp1.id}`, { ...S('s1'), ...ok('Phản hồi đã sửa') });
    check('Chủ phản hồi sửa -> 200', r.status === 200 && r.json?.data?.content === 'Phản hồi đã sửa', `status ${r.status}`);
    r = await call('PUT', `/replies/${rp1.id}`, { ...T(accT1), ...ok('x') });
    check('Người khác sửa phản hồi -> 403', r.status === 403, `status ${r.status}`);
    r = await call('PUT', `/replies/${rp1.id}`, { ...S('s1'), ...ok('') });
    check('Sửa phản hồi thành rỗng -> 400', r.status === 400, `status ${r.status}`);
    r = await call('DELETE', `/replies/${rp1.id}`, S('s4'));
    check('Người khác xóa phản hồi -> 403', r.status === 403, `status ${r.status}`);
    r = await call('DELETE', `/replies/${rp1.id}`, S('s1'));
    check('Chủ phản hồi xóa -> 200', r.status === 200, `status ${r.status}`);
    r = await call('DELETE', `/replies/${rp1.id}`, S('s1'));
    check('Xóa phản hồi lần 2 -> 404', r.status === 404, `status ${r.status}`);
    r = await call('PUT', `/replies/${rp1.id}`, { ...S('s1'), ...ok('x') });
    check('Sửa phản hồi đã xóa -> 404', r.status === 404, `status ${r.status}`);
    r = await call('GET', path, S('s1'));
    const afterReply = (r.json?.data?.items || []).find((i) => i.id === cm3.id);
    check('Phản hồi đã xóa biến mất khỏi danh sách', afterReply && afterReply.replies.length === 0);

    console.log('\n[Xóa bình luận]');
    r = await call('DELETE', `/${cm1.id}`, S('s4'));
    check('Người khác xóa -> 403', r.status === 403, `status ${r.status}`);
    r = await call('DELETE', `/${cm1.id}`, T(accT1));
    check('Giáo viên xóa bình luận của học viên -> 403', r.status === 403, `status ${r.status}`);
    r = await call('DELETE', `/${cm1.id}`, ADMIN);
    check('Quản trị viên xóa qua API này -> 403', r.status === 403, `status ${r.status}`);
    r = await call('DELETE', `/${cm1.id}`, S('s1'));
    check('Chủ bình luận xóa -> 200', r.status === 200, `status ${r.status}`);
    r = await call('DELETE', `/${cm1.id}`, S('s1'));
    check('Xóa lần 2 -> 404', r.status === 404, `status ${r.status}`);
    r = await call('PUT', `/${cm1.id}`, { ...S('s1'), ...ok('x') });
    check('Sửa bình luận đã xóa -> 404', r.status === 404, `status ${r.status}`);
    r = await call('POST', `/${cm1.id}/replies`, { ...S('s4'), ...ok('x') });
    check('Phản hồi bình luận đã xóa -> 404', r.status === 404, `status ${r.status}`);
    r = await call('GET', path, S('s1'));
    check('Bình luận đã xóa biến mất, kéo theo phản hồi của nó', !ids(r).includes(cm1.id) && r.json?.data?.pagination?.total === 2);
    const row = await prisma.comment.findUnique({ where: { id: cm1.id } });
    check('Chỉ ẩn, không xóa cứng (status AN trong database)', row?.status === 'AN', row?.status);
  } finally {
    // ----- Dọn dữ liệu tạm -----
    try {
      await prisma.reply.deleteMany({ where: { comment: { courseId: { in: courseIds } } } });
      await prisma.comment.deleteMany({ where: { courseId: { in: courseIds } } });
      await prisma.courseRegistration.deleteMany({ where: { courseId: { in: courseIds } } });
      await prisma.course.deleteMany({ where: { id: { in: courseIds } } });
      await prisma.student.deleteMany({ where: { id: { in: Object.values(stu).map((s) => s.id) } } });
      await prisma.teacher.deleteMany({ where: { id: { in: [t1.id, t2.id] } } });
      await prisma.account.deleteMany({
        where: { id: { in: [accT1.id, accT2.id, ...Object.values(accS).map((a) => a.id)] } },
      });
      await prisma.category.deleteMany({ where: { id: cat.id } });
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