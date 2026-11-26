import { Flag, GraduationCap, Lock, RotateCcw, UserCheck, Users, Wallet } from "lucide-react";
import { PERMISSIONS } from "../../../constants/permissions";
import { ROUTES } from "../../../constants/routes";
import { accountApi } from "../../../api/accountApi";
import { invoiceApi } from "../../../api/invoiceApi";
import { reportApi } from "../../../api/reportApi";
import { teacherApi } from "../../../api/teacherApi";

export const PENDING_CARDS = [
  {
    key: "teachers",
    label: "Giáo viên chờ duyệt",
    icon: UserCheck,
    permission: PERMISSIONS.DUYET_GIAO_VIEN,
    request: () => teacherApi.getAdminList({ approvalStatus: "CHO_DUYET", limit: 1 }),
    to: ROUTES.ADMIN.TEACHER_APPROVAL,
    actionLabel: "Duyệt ngay",
  },
  {
    key: "payments",
    label: "Thanh toán chờ xác nhận",
    icon: Wallet,
    permission: PERMISSIONS.QUAN_LY_THANH_TOAN,
    request: () => invoiceApi.getList({ pending: true, limit: 1 }),
    to: ROUTES.ADMIN.PAYMENTS,
    actionLabel: "Xem danh sách",
  },
  {
    key: "refunds",
    label: "Yêu cầu hoàn tiền",
    icon: RotateCcw,
    permission: PERMISSIONS.XU_LY_HOAN_TIEN,
    request: () => invoiceApi.getRefundRequests({ status: "CHO_XU_LY", limit: 1 }),
    to: ROUTES.ADMIN.REFUNDS,
    actionLabel: "Xử lý",
  },
  {
    key: "reports",
    label: "Báo cáo vi phạm",
    icon: Flag,
    permission: PERMISSIONS.XU_LY_BAO_CAO_VI_PHAM,
    request: () => reportApi.getList({ status: "CHO_XU_LY", limit: 1 }),
    to: ROUTES.ADMIN.REPORTS,
    actionLabel: "Xử lý",
  },
];

export const TOTAL_CARDS = [
  {
    key: "students",
    label: "Học viên",
    icon: Users,
    request: () => accountApi.getList({ role: "STUDENT", limit: 1 }),
  },
  {
    key: "teachers",
    label: "Giáo viên đã duyệt",
    icon: GraduationCap,
    request: () => teacherApi.getPublicList({ limit: 1 }),
  },
  {
    key: "locked",
    label: "Tài khoản đang bị khóa",
    icon: Lock,
    request: () => accountApi.getList({ status: "BI_KHOA", limit: 1 }),
  },
];

export const fetchPendingPayments = () => invoiceApi.getList({ pending: true, limit: 3 });
export const fetchPendingTeachers = () => teacherApi.getAdminList({ approvalStatus: "CHO_DUYET", limit: 3 });
