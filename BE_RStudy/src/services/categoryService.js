const { CategoryStatus } = require('@prisma/client');
const AppError = require('../utils/AppError');
const categoryRepository = require('../repositories/categoryRepository');

const buildPagination = ({ page, limit }, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});

const getExistingOrThrow = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) throw new AppError('Danh mục không tồn tại', 404);
  return category;
};

const assertNameAvailable = async (name, excludeId) => {
  const duplicated = await categoryRepository.findByName(name, excludeId);
  if (duplicated) throw new AppError('Tên danh mục đã tồn tại', 409);
};

//PUBLIC: chỉ danh mục đang hoạt động
const getPublicList = async ({ q, ...pg }) => {
  const { items, total } = await categoryRepository.findAndCount({
    q,
    status: CategoryStatus.HOAT_DONG,
    skip: pg.skip,
    take: pg.take,
    withCourseCount: true,
  });
  const data = items.map(({ _count, ...c }) => ({ ...c, courseCount: _count.courses }));
  return { items: data, pagination: buildPagination(pg, total) };
};

const getPublicById = async (id) => {
  const category = await getExistingOrThrow(id);
  if (category.status !== CategoryStatus.HOAT_DONG) {
    throw new AppError('Danh mục không tồn tại', 404);
  }
  return category;
};

//ADMIN
const getAdminList = async ({ q, status, ...pg }) => {
  if (status && !Object.values(CategoryStatus).includes(status)) {
    throw new AppError('Trạng thái lọc không hợp lệ', 400);
  }
  const { items, total } = await categoryRepository.findAndCount({
    q,
    status,
    skip: pg.skip,
    take: pg.take,
  });
  return { items, pagination: buildPagination(pg, total) };
};

const getAdminById = async (id) => {
  const category = await getExistingOrThrow(id);
  const relations = await categoryRepository.countRelations(id);
  return { ...category, relations };
};

const create = async ({ categoryName, description, status }) => {
  await assertNameAvailable(categoryName);
  return categoryRepository.create({ categoryName, description, status });
};

const update = async (id, { categoryName, description, status }) => {
  await getExistingOrThrow(id);
  if (categoryName !== undefined) await assertNameAvailable(categoryName, id);
  return categoryRepository.update(id, { categoryName, description, status });
};

const changeStatus = async (id, status) => {
  await getExistingOrThrow(id);
  return categoryRepository.update(id, { status });
};

// Chỉ xóa hẳn khi chưa phát sinh dữ liệu; ngược lại phải ẩn (quy tắc nghiệp vụ SRS)
const remove = async (id) => {
  await getExistingOrThrow(id);
  const { courses, resources } = await categoryRepository.countRelations(id);
  if (courses > 0 || resources > 0) {
    throw new AppError(
      'Danh mục đã có khóa học hoặc tài liệu nên không thể xóa. Hãy chuyển sang trạng thái ẩn',
      409
    );
  }
  await categoryRepository.remove(id);
};

module.exports = {
  getPublicList,
  getPublicById,
  getAdminList,
  getAdminById,
  create,
  update,
  changeStatus,
  remove,
};