import { BookOpen, ClipboardList, FileText, Flag, FolderOpen, LayoutDashboard, ShieldCheck, Ticket, Undo2, UserCheck, UserCog, Users, Wallet } from "lucide-react";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { hasPermission, isLeader } from "../../utils/permission";

const TEACHER_NAV = [
  { label: "Tổng quan", to: ROUTES.TEACHER.ROOT, icon: LayoutDashboard, end: true },
  { label: "Khóa học của tôi", to: ROUTES.TEACHER.COURSES, icon: BookOpen },
  { label: "Đề thi", to: ROUTES.TEACHER.EXAMS, icon: ClipboardList },
  { label: "Bài làm của học viên", to: ROUTES.TEACHER.SUBMISSIONS, icon: FileText },
  { label: "Tài liệu", to: ROUTES.TEACHER.RESOURCES, icon: FolderOpen },
  { label: "Hồ sơ giáo viên", to: ROUTES.PROFILE, icon: UserCog },
];

const ADMIN_NAV = [
  { label: "Tổng quan", to: ROUTES.ADMIN.ROOT, icon: LayoutDashboard, end: true },
  { label: "Tài khoản", to: ROUTES.ADMIN.ACCOUNTS, icon: Users, permission: PERMISSIONS.QUAN_LY_TAI_KHOAN },
  { label: "Duyệt giáo viên", to: ROUTES.ADMIN.TEACHER_APPROVAL, icon: UserCheck, permission: PERMISSIONS.DUYET_GIAO_VIEN },
  { label: "Khóa học", to: ROUTES.ADMIN.COURSES, icon: BookOpen, permission: PERMISSIONS.QUAN_LY_KHOA_HOC },
  { label: "Thanh toán", to: ROUTES.ADMIN.PAYMENTS, icon: Wallet, permission: PERMISSIONS.QUAN_LY_THANH_TOAN },
  { label: "Hoàn tiền", to: ROUTES.ADMIN.REFUNDS, icon: Undo2, permission: PERMISSIONS.XU_LY_HOAN_TIEN },
  { label: "Báo cáo vi phạm", to: ROUTES.ADMIN.REPORTS, icon: Flag, permission: PERMISSIONS.XU_LY_BAO_CAO_VI_PHAM },
  { label: "Mã giảm giá", to: ROUTES.ADMIN.COUPONS, icon: Ticket, permission: PERMISSIONS.QUAN_LY_MA_GIAM_GIA },
  { label: "Bài thi", to: ROUTES.ADMIN.EXAMS, icon: ClipboardList, permission: PERMISSIONS.QUAN_LY_BAI_THI },
  { label: "Phân quyền", to: ROUTES.ADMIN.PERMISSIONS, icon: ShieldCheck, leaderOnly: true },
];

export const getManageNav = (account) => {
  if (account.role === ROLES.TEACHER) return TEACHER_NAV;
  if (account.role === ROLES.ADMINISTRATOR) {
    return ADMIN_NAV.filter((item) => {
      if (item.leaderOnly) return isLeader(account);
      return !item.permission || hasPermission(account, item.permission);
    });
  }
  return [];
};
