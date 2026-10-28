const { CourseStatus, CategoryStatus, ApprovalStatus } = require('@prisma/client');
const AppError = require('../utils/AppError');
const courseRepository = require('../repositories/courseRepository');
const categoryRepository = require('../repositories/categoryRepository');


const TEACHER_EDITABLE = [
  CourseStatus.BAN_NHAP,
  CourseStatus.DA_PHE_DUYET,
  CourseStatus.DANG_MO,
  CourseStatus.TAM_NGUNG,
];

const ADMIN_TRANSITIONS = {
  [CourseStatus.CHO_DUYET]: [CourseStatus.DA_PHE_DUYET, CourseStatus.BAN_NHAP],
  [CourseStatus.DA_PHE_DUYET]: [CourseStatus.DANG_MO],
  [CourseStatus.DANG_MO]: [CourseStatus.TAM_NGUNG, CourseStatus.DA_KET_THUC],
  [CourseStatus.TAM_NGUNG]: [CourseStatus.DANG_MO, CourseStatus.DA_KET_THUC],
};

const buildPagination = ({ page, limit }, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});

// ---------- hàm dùng chung ----------
const getTeacherOrThrow = async (accountId) => {
  const teacher = await courseRepository.findTeacherByAccountId(accountId);
  if (!teacher) throw new AppError('Tài khoản này không phải giáo viên', 403);
  if (teacher.approvalStatus !== ApprovalStatus.DA_DUYET) {
    throw new AppError('Tài khoản giáo viên chưa được quản trị viên duyệt', 403);
  }
  return teacher;
};

const getOwnCourseOrThrow = async (id, teacherId) => {
  const course = await courseRepository.findOwnById(id, teacherId);
  if (!course) throw new AppError('Khóa học không tồn tại', 404);
  return course;
};

const assertCategoryUsable = async (categoryId) => {
  const category = await categoryRepository.findById(categoryId);
  if (!category) throw new AppError('Danh mục không tồn tại', 400);
  if (category.status !== CategoryStatus.HOAT_DONG) {
    throw new AppError('Danh mục đang bị ẩn, không thể dùng cho khóa học', 400);
  }
};

//GIÁO VIÊN
const createByTeacher = async (accountId, data) => {
  const teacher = await getTeacherOrThrow(accountId);
  await assertCategoryUsable(data.categoryId);
  // teacherId lấy từ tài khoản đăng nhập, status luôn là BAN_NHAP (không nhận từ client)
  return courseRepository.create({
    ...data,
    teacherId: teacher.id,
    status: CourseStatus.BAN_NHAP,
  });
};

const getMyList = async (accountId, { q, status, ...pg }) => {
  if (status && !Object.values(CourseStatus).includes(status)) {
    throw new AppError('Trạng thái lọc không hợp lệ', 400);
  }
  const teacher = await getTeacherOrThrow(accountId);
  const { items, total } = await courseRepository.findAndCount({
    q,
    status,
    teacherId: teacher.id,
    skip: pg.skip,
    take: pg.take,
  });
  return { items, pagination: buildPagination(pg, total) };
};

const getMyById = async (accountId, id) => {
  const teacher = await getTeacherOrThrow(accountId);
  return getOwnCourseOrThrow(id, teacher.id);
};

const updateByTeacher = async (accountId, id, data) => {
  const teacher = await getTeacherOrThrow(accountId);
  const course = await getOwnCourseOrThrow(id, teacher.id);

  if (!TEACHER_EDITABLE.includes(course.status)) {
    throw new AppError('Khóa học đang chờ duyệt hoặc đã kết thúc nên không thể sửa', 409);
  }

  if (data.categoryId !== undefined && data.categoryId !== course.categoryId) {
    await assertCategoryUsable(data.categoryId);
  }

  const start = data.startDate ?? course.startDate;
  const end = data.endDate ?? course.endDate;
  if (end <= start) throw new AppError('Ngày kết thúc phải sau ngày bắt đầu', 400);

  return courseRepository.update(id, data);
};

const submitForApproval = async (accountId, id) => {
  const teacher = await getTeacherOrThrow(accountId);
  const course = await getOwnCourseOrThrow(id, teacher.id);

  if (course.status !== CourseStatus.BAN_NHAP) {
    throw new AppError('Chỉ khóa học ở trạng thái nháp mới được gửi duyệt', 409);
  }
  await assertCategoryUsable(course.categoryId);

  const changed = await courseRepository.transition(
    id,
    [CourseStatus.BAN_NHAP],
    CourseStatus.CHO_DUYET
  );
  if (!changed) throw new AppError('Trạng thái khóa học vừa thay đổi, vui lòng tải lại', 409);
  return courseRepository.findById(id);
};

//QUẢN TRỊ VIÊN
const getAdminList = async ({ q, status, categoryId, teacherId, ...pg }) => {
  if (status && !Object.values(CourseStatus).includes(status)) {
    throw new AppError('Trạng thái lọc không hợp lệ', 400);
  }
  const { items, total } = await courseRepository.findAndCount({
    q,
    status,
    categoryId,
    teacherId,
    skip: pg.skip,
    take: pg.take,
  });
  return { items, pagination: buildPagination(pg, total) };
};

const getAdminById = async (id) => {
  const course = await courseRepository.findById(id);
  if (!course) throw new AppError('Khóa học không tồn tại', 404);
  return course;
};

const changeStatusByAdmin = async (id, toStatus) => {
  const course = await getAdminById(id);
  const allowed = ADMIN_TRANSITIONS[course.status] || [];
  if (!allowed.includes(toStatus)) {
    throw new AppError(`Không thể chuyển khóa học từ ${course.status} sang ${toStatus}`, 409);
  }

  // Khi mở đăng ký: giáo viên phải đã được duyệt và danh mục phải đang hiển thị
  if (toStatus === CourseStatus.DANG_MO) {
    if (course.teacher.approvalStatus !== ApprovalStatus.DA_DUYET) {
      throw new AppError('Giáo viên phụ trách chưa được duyệt, không thể mở khóa học', 409);
    }
    await assertCategoryUsable(course.categoryId);
  }

  const changed = await courseRepository.transition(id, [course.status], toStatus);
  if (!changed) throw new AppError('Trạng thái khóa học vừa thay đổi, vui lòng tải lại', 409);
  return courseRepository.findById(id);
};

//CÔNG KHAI (khách xem)
const attachRating = (course, stats) => {
  const s = stats.get(course.id);
  return {
    ...course,
    averageRating: s && s.averageRating !== null ? Math.round(s.averageRating * 10) / 10 : null,
    reviewCount: s ? s.reviewCount : 0,
  };
};

const getPublicList = async ({ q, categoryId, teacherId, minPrice, maxPrice, sort, ...pg }) => {
  const { items, total } = await courseRepository.findPublicAndCount({
    q,
    categoryId,
    teacherId,
    minPrice,
    maxPrice,
    sort,
    skip: pg.skip,
    take: pg.take,
  });
  const stats = await courseRepository.getRatingStats(items.map((c) => c.id));
  return {
    items: items.map((c) => attachRating(c, stats)),
    pagination: buildPagination(pg, total),
  };
};

// Khóa chưa mở, đã ngưng/kết thúc hoặc thuộc danh mục ẩn đều trả 404 như không tồn tại
const getPublicById = async (id) => {
  const course = await courseRepository.findPublicById(id);
  if (!course) throw new AppError('Khóa học không tồn tại', 404);
  const stats = await courseRepository.getRatingStats([course.id]);
  return attachRating(course, stats);
};

const approve = (id) => changeStatusByAdmin(id, CourseStatus.DA_PHE_DUYET);
const reject = (id) => changeStatusByAdmin(id, CourseStatus.BAN_NHAP);

module.exports = {
  createByTeacher,
  getMyList,
  getMyById,
  updateByTeacher,
  submitForApproval,
  getAdminList,
  getAdminById,
  changeStatusByAdmin,
  approve,
  reject,
  getPublicList,
  getPublicById,
};