import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { ROUTES } from "../constants/routes";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import CourseListPage from "../pages/CourseListPage";
import CourseDetailPage from "../pages/CourseDetailPage";
import TeacherProfilePage from "../pages/TeacherProfilePage";
import ManageLayout from "../components/ManageLayout";
import { ROLES } from "../constants/roles";
import ComingSoonPage from "../pages/manage/ComingSoonPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import PermissionRoute from "../components/PermissionRoute";
import { PERMISSIONS } from "../constants/permissions";
import ForbiddenPage from "../pages/ForbiddenPage";
import AccountsPage from "../pages/admin/AccountsPage";
import TeacherApprovalPage from "../pages/admin/teacherApproval/TeacherApprovalPage";
import LeaderRoute from "../components/LeaderRoute";
import PermissionsPage from "../pages/admin/PermissionsPage";
import TeacherDashboardPage from "../pages/teacher/TeacherDashboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.COURSES} element={<CourseListPage />} />
        <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetailPage />} />
        <Route path={ROUTES.TEACHER_PROFILE} element={<TeacherProfilePage />} />
        <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
        <Route path={ROUTES.TEACHER.ROOT} element={<ManageLayout />}>
          <Route index element={<TeacherDashboardPage />} />
          <Route path="*" element={<ComingSoonPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]} />}>
        <Route path={ROUTES.ADMIN.ROOT} element={<ManageLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route element={<PermissionRoute permission={PERMISSIONS.QUAN_LY_TAI_KHOAN} />}>
            <Route path={ROUTES.ADMIN.ACCOUNTS} element={<AccountsPage />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.DUYET_GIAO_VIEN} />}>
            <Route path={ROUTES.ADMIN.TEACHER_APPROVAL} element={<TeacherApprovalPage />} />
          </Route>
          <Route element={<LeaderRoute />}>
            <Route path={ROUTES.ADMIN.PERMISSIONS} element={<PermissionsPage />} />
          </Route>
          <Route path="*" element={<ComingSoonPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
