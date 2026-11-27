import { lazy, Suspense } from "react";
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
import CourseListPage from "../pages/CourseListPage";
import CourseDetailPage from "../pages/CourseDetailPage";
import ManageLayout from "../components/ManageLayout";
import { ROLES } from "../constants/roles";
import PermissionRoute from "../components/PermissionRoute";
import { PERMISSIONS } from "../constants/permissions";
import ForbiddenPage from "../pages/ForbiddenPage";
import LeaderRoute from "../components/LeaderRoute";
import ExamLayout from "../components/ExamLayout";
import LoadingState from "../components/common/LoadingState";

// Trang riêng từng vai trò tải theo yêu cầu để bundle đầu nhỏ; trang công khai và đăng nhập giữ import tĩnh
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const TeacherProfilePage = lazy(() => import("../pages/TeacherProfilePage"));
const ComingSoonPage = lazy(() => import("../pages/manage/ComingSoonPage"));
const AdminDashboardPage = lazy(
  () => import("../pages/admin/AdminDashboardPage"),
);
const AccountsPage = lazy(() => import("../pages/admin/AccountsPage"));
const TeacherApprovalPage = lazy(
  () => import("../pages/admin/teacherApproval/TeacherApprovalPage"),
);
const PermissionsPage = lazy(() => import("../pages/admin/PermissionsPage"));
const TeacherDashboardPage = lazy(
  () => import("../pages/teacher/TeacherDashboardPage"),
);
const ExamDetailPage = lazy(() => import("../pages/exam/ExamDetailPage"));
const ExamTakePage = lazy(() => import("../pages/exam/ExamTakePage"));
const ExamListPage = lazy(() => import("../pages/exam/ExamListPage"));
const ExamReviewPage = lazy(() => import("../pages/exam/ExamReviewPage"));
const ReportsPage = lazy(() => import("../pages/admin/ReportsPage"));
const ExamNewPage = lazy(() => import("../pages/teacher/ExamNewPage"));
const ExamSubmissionsPage = lazy(
  () => import("../pages/teacher/ExamSubmissionsPage"),
);
const TeacherAttemptPage = lazy(
  () => import("../pages/teacher/TeacherAttemptPage"),
);
const TeacherExamsPage = lazy(
  () => import("../pages/teacher/TeacherExamsPage"),
);
const AdminExamsPage = lazy(() => import("../pages/admin/AdminExamsPage"));
const ResourceListPage = lazy(
  () => import("../pages/resource/ResourceListPage"),
);
const TeacherResourcesPage = lazy(
  () => import("../pages/teacher/TeacherResourcesPage"),
);
const MyCoursesPage = lazy(() => import("../pages/student/MyCoursesPage"));
const TeacherCoursesPage = lazy(
  () => import("../pages/teacher/TeacherCoursesPage"),
);
const CourseNewPage = lazy(() => import("../pages/teacher/CourseNewPage"));
const CourseEditPage = lazy(() => import("../pages/teacher/CourseEditPage"));
const AdminCoursesPage = lazy(() => import("../pages/admin/AdminCoursesPage"));
const AdminCouponsPage = lazy(() => import("../pages/admin/AdminCouponsPage"));
const PaymentPage = lazy(() => import("../pages/payment/PaymentPage"));
const AdminPaymentsPage = lazy(
  () => import("../pages/admin/AdminPaymentsPage"),
);
const AdminRefundsPage = lazy(() => import("../pages/admin/AdminRefundsPage"));
const TeacherSubmissionsPage = lazy(
  () => import("../pages/teacher/TeacherSubmissionsPage"),
);
const LearnPage = lazy(() => import("../pages/learn/LearnPage"));
const CourseLearningPage = lazy(
  () => import("../pages/teacher/CourseLearningPage"),
);
const AdminCategoriesPage = lazy(
  () => import("../pages/admin/AdminCategoriesPage"),
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.COURSES} element={<CourseListPage />} />
          <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetailPage />} />
          <Route
            path={ROUTES.TEACHER_PROFILE}
            element={<TeacherProfilePage />}
          />
          <Route path={ROUTES.RESOURCES} element={<ResourceListPage />} />
          <Route path={ROUTES.LEARN} element={<LearnPage />} />
          <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
            <Route path={ROUTES.EXAM_DETAIL} element={<ExamDetailPage />} />
            <Route path={ROUTES.EXAMS} element={<ExamListPage />} />
            <Route path={ROUTES.ATTEMPT_DETAIL} element={<ExamReviewPage />} />
            <Route path={ROUTES.MY_COURSES} element={<MyCoursesPage />} />
            <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
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
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
          <Route path={ROUTES.TEACHER.ROOT} element={<ManageLayout />}>
            <Route index element={<TeacherDashboardPage />} />
            <Route path={ROUTES.TEACHER.EXAM_NEW} element={<ExamNewPage />} />
            <Route
              path={ROUTES.TEACHER.EXAM_SUBMISSIONS}
              element={<ExamSubmissionsPage />}
            />
            <Route
              path={ROUTES.TEACHER.ATTEMPT}
              element={<TeacherAttemptPage />}
            />
            <Route path={ROUTES.TEACHER.EXAMS} element={<TeacherExamsPage />} />
            <Route
              path={ROUTES.TEACHER.RESOURCES}
              element={<TeacherResourcesPage />}
            />
            <Route
              path={ROUTES.TEACHER.COURSES}
              element={<TeacherCoursesPage />}
            />
            <Route
              path={ROUTES.TEACHER.COURSE_NEW}
              element={<CourseNewPage />}
            />
            <Route
              path={ROUTES.TEACHER.COURSE_EDIT}
              element={<CourseEditPage />}
            />
            <Route
              path={ROUTES.TEACHER.SUBMISSIONS}
              element={<TeacherSubmissionsPage />}
            />
            <Route
              path={ROUTES.TEACHER.COURSE_LEARNING}
              element={<CourseLearningPage />}
            />
            <Route path="*" element={<ComingSoonPage />} />
          </Route>
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]} />}
        >
          <Route path={ROUTES.ADMIN.ROOT} element={<ManageLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route
              element={
                <PermissionRoute permission={PERMISSIONS.QUAN_LY_TAI_KHOAN} />
              }
            >
              <Route path={ROUTES.ADMIN.ACCOUNTS} element={<AccountsPage />} />
            </Route>
            <Route
              element={
                <PermissionRoute permission={PERMISSIONS.DUYET_GIAO_VIEN} />
              }
            >
              <Route
                path={ROUTES.ADMIN.TEACHER_APPROVAL}
                element={<TeacherApprovalPage />}
              />
            </Route>
            <Route element={<LeaderRoute />}>
              <Route
                path={ROUTES.ADMIN.PERMISSIONS}
                element={<PermissionsPage />}
              />
            </Route>
            <Route
              element={
                <PermissionRoute
                  permission={PERMISSIONS.XU_LY_BAO_CAO_VI_PHAM}
                />
              }
            >
              <Route path={ROUTES.ADMIN.REPORTS} element={<ReportsPage />} />
            </Route>
            <Route
              element={
                <PermissionRoute permission={PERMISSIONS.QUAN_LY_BAI_THI} />
              }
            >
              <Route path={ROUTES.ADMIN.EXAMS} element={<AdminExamsPage />} />
            </Route>
            <Route
              element={
                <PermissionRoute permission={PERMISSIONS.QUAN_LY_KHOA_HOC} />
              }
            >
              <Route
                path={ROUTES.ADMIN.COURSES}
                element={<AdminCoursesPage />}
              />
              <Route
                path={ROUTES.ADMIN.CATEGORIES}
                element={<AdminCategoriesPage />}
              />
            </Route>
            <Route
              element={
                <PermissionRoute permission={PERMISSIONS.QUAN_LY_MA_GIAM_GIA} />
              }
            >
              <Route
                path={ROUTES.ADMIN.COUPONS}
                element={<AdminCouponsPage />}
              />
            </Route>
            <Route
              element={
                <PermissionRoute permission={PERMISSIONS.QUAN_LY_THANH_TOAN} />
              }
            >
              <Route
                path={ROUTES.ADMIN.PAYMENTS}
                element={<AdminPaymentsPage />}
              />
            </Route>
            <Route
              element={
                <PermissionRoute permission={PERMISSIONS.XU_LY_HOAN_TIEN} />
              }
            >
              <Route
                path={ROUTES.ADMIN.REFUNDS}
                element={<AdminRefundsPage />}
              />
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
    </Suspense>
  );
}
