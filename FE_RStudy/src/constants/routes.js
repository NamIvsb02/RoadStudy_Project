import { ROLES } from "./roles";

export const ROUTES = {
  HOME: "/",
  COURSES: "/courses",
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
  TEACHER: { ROOT: "/teacher" },
  ADMIN: { ROOT: "/admin" },
};

export const ROLE_HOME = {
  [ROLES.STUDENT]: ROUTES.HOME,
  [ROLES.TEACHER]: ROUTES.TEACHER.ROOT,
  [ROLES.ADMINISTRATOR]: ROUTES.ADMIN.ROOT,
};
