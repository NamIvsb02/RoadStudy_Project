import { BookMarked, BookOpen, FileText, GraduationCap, House } from "lucide-react";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";

export const NAV_ITEMS = [
  { label: "Trang chủ", to: ROUTES.HOME, icon: House },
  { label: "Khóa học", to: ROUTES.COURSES, icon: GraduationCap },
  { label: "Bài thi", to: ROUTES.EXAMS, icon: FileText },
  { label: "Tài liệu", to: ROUTES.RESOURCES, icon: BookOpen },
];

const MY_COURSES_ITEM = { label: "Khóa học của tôi", shortLabel: "Của tôi", to: ROUTES.MY_COURSES, icon: BookMarked };

export const getNavItems = (account) => (account?.role === ROLES.STUDENT ? [...NAV_ITEMS, MY_COURSES_ITEM] : NAV_ITEMS);
