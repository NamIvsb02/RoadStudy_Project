const fs = require("fs/promises");
const path = require("path");
const { CategoryStatus } = require("@prisma/client");
const AppError = require("../utils/AppError");
const resourceRepository = require("../repositories/resourceRepository");
const categoryRepository = require("../repositories/categoryRepository");

const RESOURCE_DIR = path.join(__dirname, "../../uploads/resources");

const removeFile = async (fileUrl) => {
  try {
    await fs.unlink(path.join(RESOURCE_DIR, path.basename(fileUrl)));
  } catch (e) {
    /* file đã mất thì bỏ qua */
  }
};

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

  return resourceRepository.create({
    resourceName,
    categoryId,
    fileUrl: `/uploads/resources/${file.filename}`,
    uploadedByTeacherId: teacher.id,
  });
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
  await removeFile(resource.fileUrl);
};

module.exports = { getList, getById, create, remove, removeFile };
