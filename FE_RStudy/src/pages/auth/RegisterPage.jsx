import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import AuthShell from "../../components/common/AuthShell";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useToast } from "../../hooks/useToast";
import { studentSchema, teacherSchema } from "./authSchemas";
import CommonRegisterFields from "./CommonRegisterFields";
import StudentFields from "./StudentFields";
import TeacherFields from "./TeacherFields";

const ROLE_TABS = [
  { value: ROLES.STUDENT, label: "Học viên" },
  { value: ROLES.TEACHER, label: "Giáo viên" },
];

const DEFAULT_VALUES = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  specialization: "",
  teachingExperience: "",
  biography: "",
};

const buildPayload = (role, values) => {
  const payload = { role, ...values };
  delete payload.confirmPassword;
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== ""));
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [role, setRole] = useState(ROLES.STUDENT);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(role === ROLES.STUDENT ? studentSchema : teacherSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const changeRole = (next) => {
    setRole(next);
    setServerError("");
    clearErrors();
  };

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const res = await authApi.register(buildPayload(role, values));
      toast.success(res.message);
      navigate(ROUTES.VERIFY_EMAIL, { state: { email: values.email } });
    } catch (error) {
      if (error.response?.status === 409) setError("email", { message: error.message });
      else setServerError(error.message);
    }
  };

  return (
    <AuthShell welcome="Tạo tài khoản" subtitle="Đăng ký để bắt đầu học và luyện thi cùng RoadStudy." title="Đăng ký">
      <div role="tablist" className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-surface p-1">
        {ROLE_TABS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={role === value}
            onClick={() => changeRole(value)}
            className={`h-10 rounded-lg text-sm font-semibold transition-colors ${role === value ? "bg-white text-primary shadow-card" : "text-muted hover:text-primary"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {role === ROLES.TEACHER && <p className="mb-4 text-xs text-muted">Tài khoản giáo viên cần được quản trị viên duyệt trước khi tạo khóa học.</p>}
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CommonRegisterFields register={register} errors={errors} />
        {role === ROLES.STUDENT ? <StudentFields register={register} errors={errors} /> : <TeacherFields register={register} errors={errors} />}
        <FormAlert message={serverError} />
        <div className="flex justify-center pt-2">
          <Button type="submit" loading={isSubmitting} className="min-w-44">
            Tạo tài khoản
          </Button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-ink">
        Đã có tài khoản?{" "}
        <Link to={ROUTES.LOGIN} className="font-medium text-primary transition-colors hover:text-primary-dark">
          Đăng nhập
        </Link>
      </p>
    </AuthShell>
  );
}
