import { ROLES } from "./roles";

export const ROUTES = {
  HOME: "/",
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:id",
  TEACHER_PROFILE: "/teachers/:id",
  EXAMS: "/exams",
  RESOURCES: "/resources",
  BOOKS: "/books",
  ITEMS: "/profile/items",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/profile",
  FORBIDDEN: "/forbidden",
  STUDENT: { ROOT: "/student" },
  TEACHER: {
    ROOT: "/teacher",
    COURSES: "/teacher/courses",
    EXAMS: "/teacher/exams",
    SUBMISSIONS: "/teacher/submissions",
    RESOURCES: "/teacher/resources",
  },
  ADMIN: {
    ROOT: "/admin",
    ACCOUNTS: "/admin/accounts",
    TEACHER_APPROVAL: "/admin/teacher-approval",
    PAYMENTS: "/admin/payments",
    REFUNDS: "/admin/refunds",
    REPORTS: "/admin/reports",
    COUPONS: "/admin/coupons",
    EXAMS: "/admin/exams",
    COURSES: "/admin/courses",
    PERMISSIONS: "/admin/permissions",
  },
};

export const ROLE_HOME = {
  [ROLES.STUDENT]: ROUTES.HOME,
  [ROLES.TEACHER]: ROUTES.TEACHER.ROOT,
  [ROLES.ADMINISTRATOR]: ROUTES.ADMIN.ROOT,
};
