import { BookMarked, BookOpen, FileText, GraduationCap, House } from "lucide-react";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { hasPermission } from "../../utils/permission";

const HOME_ITEM = { label: "Trang chủ", to: ROUTES.HOME, icon: House };
const COURSES_ITEM = { label: "Khóa học", to: ROUTES.COURSES, icon: GraduationCap };
const RESOURCES_ITEM = { label: "Tài liệu", to: ROUTES.RESOURCES, icon: BookOpen };
const MY_COURSES_ITEM = { label: "Khóa học của tôi", shortLabel: "Của tôi", to: ROUTES.MY_COURSES, icon: BookMarked };

// /exams chỉ dành cho học viên (ProtectedRoute chặn vai trò khác và đẩy về trang chủ của vai trò),
// nên giáo viên và admin được dẫn tới trang quản lý đề thi của mình; admin thiếu quyền thì ẩn mục.
const examPathFor = (account) => {
  if (account?.role === ROLES.TEACHER) return ROUTES.TEACHER.EXAMS;
  if (account?.role === ROLES.ADMINISTRATOR) return hasPermission(account, PERMISSIONS.QUAN_LY_BAI_THI) ? ROUTES.ADMIN.EXAMS : null;
  return ROUTES.EXAMS;
};

export const getMenuItems = (account) => {
  const examPath = examPathFor(account);
  return [HOME_ITEM, COURSES_ITEM, ...(examPath ? [{ label: "Bài thi", to: examPath, icon: FileText }] : []), RESOURCES_ITEM];
};

export const getNavItems = (account) => (account?.role === ROLES.STUDENT ? [...getMenuItems(account), MY_COURSES_ITEM] : getMenuItems(account));
