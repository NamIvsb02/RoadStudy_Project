import { BookOpen, FileText, GraduationCap, House } from "lucide-react";
import { ROUTES } from "../../constants/routes";

export const NAV_ITEMS = [
  { label: "Trang chủ", to: ROUTES.HOME, icon: House },
  { label: "Khóa học", to: ROUTES.COURSES, icon: GraduationCap },
  { label: "Bài thi", to: ROUTES.EXAMS, icon: FileText },
  { label: "Tài liệu", to: ROUTES.RESOURCES, icon: BookOpen },
];
