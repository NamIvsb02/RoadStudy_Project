const { CategoryStatus } = require("@prisma/client");
const AppError = require("../utils/AppError");
const storage = require("../utils/storage");
const resourceRepository = require("../repositories/resourceRepository");
const categoryRepository = require("../repositories/categoryRepository");

const getExistingOrThrow = async (id) => {
  const resource = await resourceRepository.findById(id);
  if (!resource) throw new AppError("Tài liệu không tồn tại", 404);
  return resource;
};

const getList = async ({ q, categoryId, page, limit, skip, take }) => {
  const { items, total } = await resourceRepository.findAndCount({ q, categoryId, skip, take });
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

const getById = async (id) => {
  const resource = await getExistingOrThrow(id);
  const category = await categoryRepository.findById(resource.categoryId);
  if (!category || category.status !== CategoryStatus.HOAT_DONG) {
    throw new AppError("Tài liệu không tồn tại", 404);
  }
  return resource;
};

const create = async (accountId, { resourceName, categoryId }, file) => {
  const teacher = await resourceRepository.findTeacherByAccountId(accountId);
  if (!teacher) throw new AppError("Không tìm thấy hồ sơ giáo viên", 403);

  const category = await categoryRepository.findById(categoryId);
  if (!category || category.status !== CategoryStatus.HOAT_DONG) {
    throw new AppError("Danh mục không tồn tại hoặc đang bị ẩn", 400);
  }

  // Lưu file sau khi đã kiểm tra quyền và danh mục; ghi DB lỗi thì xóa file vừa lưu
  const fileUrl = await storage.save(file, "resources");
  try {
    return await resourceRepository.create({ resourceName, categoryId, fileUrl, uploadedByTeacherId: teacher.id });
  } catch (err) {
    await storage.remove(fileUrl);
    throw err;
  }
};

// Giáo viên chỉ xóa tài liệu của mình; admin xóa được tất cả
const remove = async (id, user) => {
  const resource = await getExistingOrThrow(id);
  if (user.role === "TEACHER") {
    const teacher = await resourceRepository.findTeacherByAccountId(user.id);
    if (!teacher || teacher.id !== resource.uploadedByTeacherId) {
      throw new AppError("Bạn chỉ được xóa tài liệu của mình", 403);
    }
  }
  await resourceRepository.remove(id);
  await storage.remove(resource.fileUrl);
};

module.exports = { getList, getById, create, remove };
