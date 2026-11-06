import { ROLES } from './roles';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  TEACHER_PROFILE: '/teachers/:id',
  STUDENT: { ROOT: '/student' },
  TEACHER: { ROOT: '/teacher' },
  ADMIN: { ROOT: '/admin' },
};

export const ROLE_HOME = {
  [ROLES.STUDENT]: ROUTES.HOME,
  [ROLES.TEACHER]: ROUTES.TEACHER.ROOT,
  [ROLES.ADMINISTRATOR]: ROUTES.ADMIN.ROOT,
};