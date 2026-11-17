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
import ExamLayout from "../components/ExamLayout";
import ExamDetailPage from "../pages/exam/ExamDetailPage";
import ExamTakePage from "../pages/exam/ExamTakePage";
import ExamListPage from "../pages/exam/ExamListPage";
import ExamReviewPage from "../pages/exam/ExamReviewPage";
import ReportsPage from "../pages/admin/ReportsPage";
import ExamNewPage from "../pages/teacher/ExamNewPage";
import ExamSubmissionsPage from "../pages/teacher/ExamSubmissionsPage";
import TeacherAttemptPage from "../pages/teacher/TeacherAttemptPage";
import TeacherExamsPage from "../pages/teacher/TeacherExamsPage";
import AdminExamsPage from "../pages/admin/AdminExamsPage";
import ResourceListPage from "../pages/resource/ResourceListPage";
import TeacherResourcesPage from "../pages/teacher/TeacherResourcesPage";
import MyCoursesPage from "../pages/student/MyCoursesPage";
import TeacherCoursesPage from "../pages/teacher/TeacherCoursesPage";
import CourseNewPage from "../pages/teacher/CourseNewPage";
import CourseEditPage from "../pages/teacher/CourseEditPage";
import AdminCoursesPage from "../pages/admin/AdminCoursesPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.COURSES} element={<CourseListPage />} />
        <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetailPage />} />
        <Route path={ROUTES.TEACHER_PROFILE} element={<TeacherProfilePage />} />
        <Route path={ROUTES.RESOURCES} element={<ResourceListPage />} />
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route path={ROUTES.EXAM_DETAIL} element={<ExamDetailPage />} />
          <Route path={ROUTES.EXAMS} element={<ExamListPage />} />
          <Route path={ROUTES.ATTEMPT_DETAIL} element={<ExamReviewPage />} />
          <Route path={ROUTES.MY_COURSES} element={<MyCoursesPage />} />
        </Route>
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
          <Route path={ROUTES.TEACHER.EXAM_NEW} element={<ExamNewPage />} />
          <Route path={ROUTES.TEACHER.EXAM_SUBMISSIONS} element={<ExamSubmissionsPage />} />
          <Route path={ROUTES.TEACHER.ATTEMPT} element={<TeacherAttemptPage />} />
          <Route path={ROUTES.TEACHER.EXAMS} element={<TeacherExamsPage />} />
          <Route path={ROUTES.TEACHER.RESOURCES} element={<TeacherResourcesPage />} />
          <Route path={ROUTES.TEACHER.COURSES} element={<TeacherCoursesPage />} />
          <Route path={ROUTES.TEACHER.COURSE_NEW} element={<CourseNewPage />} />
          <Route path={ROUTES.TEACHER.COURSE_EDIT} element={<CourseEditPage />} />
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
          <Route element={<PermissionRoute permission={PERMISSIONS.XU_LY_BAO_CAO_VI_PHAM} />}>
            <Route path={ROUTES.ADMIN.REPORTS} element={<ReportsPage />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.QUAN_LY_BAI_THI} />}>
            <Route path={ROUTES.ADMIN.EXAMS} element={<AdminExamsPage />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.QUAN_LY_KHOA_HOC} />}>
            <Route path={ROUTES.ADMIN.COURSES} element={<AdminCoursesPage />} />
          </Route>
          <Route path="*" element={<ComingSoonPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route element={<ExamLayout />}>
          <Route path={ROUTES.EXAM_TAKE} element={<ExamTakePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
