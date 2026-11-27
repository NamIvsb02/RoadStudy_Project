const accountRepository = require("../repositories/accountRepository");
const AppError = require("../utils/AppError");
const storage = require("../utils/storage");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const COMMON_FIELDS = ["fullName", "phoneNumber"];
const STUDENT_FIELDS = ["dateOfBirth", "gender", "address"];
const TEACHER_FIELDS = ["specialization", "biography", "teachingExperience"];
const ROLES = ["STUDENT", "TEACHER", "ADMINISTRATOR"];
const STATUSES = ["HOAT_DONG", "BI_KHOA", "CHO_XAC_MINH"];

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

const updateProfile = async (user, body) => {
  const accountData = pick(body, COMMON_FIELDS);
  const studentData = pick(body, STUDENT_FIELDS);
  const teacherData = pick(body, TEACHER_FIELDS);

  if (user.role !== "STUDENT" && Object.keys(studentData).length) {
    throw new AppError("Chỉ học viên mới có ngày sinh, giới tính, địa chỉ", 400);
  }
  if (user.role !== "TEACHER" && Object.keys(teacherData).length) {
    throw new AppError("Chỉ giáo viên mới có chuyên môn, giới thiệu, kinh nghiệm", 400);
  }
  if (accountData.phoneNumber === "") accountData.phoneNumber = null;

  return accountRepository.updateProfile(user.id, accountData, studentData, teacherData);
};

const updateAvatar = async (user, file) => {
  if (!file) throw new AppError('Chưa chọn ảnh (trường tên "avatar")', 400);

  const current = await accountRepository.findByIdSafe(user.id);
  if (!current) throw new AppError("Không tìm thấy tài khoản", 404);

  // Lưu ảnh mới -> cập nhật DB -> xóa ảnh cũ: sự cố giữa chừng chỉ để lại file thừa, ảnh đang dùng luôn còn.
  // Cập nhật kiểu compare-and-set: hai request đổi ảnh cùng lúc thì chỉ một request thắng; request thua xóa ảnh
  // của chính nó và trả 409, nên không có file mồ côi và không request nào xóa nhầm ảnh đang dùng.
  const newUrl = await storage.save(file, "avatars");
  let ok;
  try {
    ok = await accountRepository.updateAvatarIfCurrent(user.id, current.avatarUrl, newUrl);
  } catch (err) {
    await storage.remove(newUrl);
    throw err;
  }
  if (!ok) {
    await storage.remove(newUrl);
    throw new AppError("Ảnh đại diện vừa được thay đổi ở nơi khác, vui lòng tải lại trang", 409);
  }
  await storage.remove(current.avatarUrl);
  return accountRepository.findByIdSafe(user.id);
};

const listAccounts = async (query) => {
  const { page, limit, skip, take } = getPagination(query);
  const where = {};

  if (query.role) {
    if (!ROLES.includes(query.role)) throw new AppError("role không hợp lệ", 400);
    where.role = query.role;
  }
  if (query.status) {
    if (!STATUSES.includes(query.status)) throw new AppError("status không hợp lệ", 400);
    where.status = query.status;
  }
  const search = typeof query.search === "string" ? query.search.trim() : "";
  if (search) {
    where.OR = [{ fullName: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }];
  }

  const [items, total] = await accountRepository.list({ where, skip, take });
  return { items, pagination: buildPaginationMeta(total, page, limit) };
};

const changeStatus = async (actor, targetId, status) => {
  if (actor.id === targetId) {
    throw new AppError("Không thể tự khóa hoặc mở khóa tài khoản của mình", 400);
  }
  const target = await accountRepository.findByIdSafe(targetId);
  if (!target) throw new AppError("Không tìm thấy tài khoản", 404);

  if (target.role === "ADMINISTRATOR") {
    const me = await accountRepository.findByIdSafe(actor.id);
    if (!me?.administrator?.isLeader) {
      throw new AppError("Chỉ quản trị viên trưởng mới được khóa hoặc mở khóa quản trị viên", 403);
    }
    if (target.administrator?.isLeader) {
      throw new AppError("Không thể khóa quản trị viên trưởng", 403);
    }
  }

  const updated = await accountRepository.updateStatus(targetId, status);
  if (status === "BI_KHOA") await accountRepository.revokeAllRefreshTokens(targetId);
  return updated;
};

module.exports = { updateProfile, updateAvatar, listAccounts, changeStatus };
