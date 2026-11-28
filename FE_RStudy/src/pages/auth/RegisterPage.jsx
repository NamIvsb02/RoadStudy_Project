import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import AuthShell from "../../components/common/AuthShell";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import { stepSlide, tabIndicator } from "../../constants/motion";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useToast } from "../../hooks/useToast";
import { studentSchema, teacherSchema } from "./authSchemas";
import CommonRegisterFields from "./CommonRegisterFields";
import StudentFields from "./StudentFields";
import TeacherFields from "./TeacherFields";
import { useGlobalLoading } from "../../hooks/useGlobalLoading";

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
  const loading = useGlobalLoading();
  const [role, setRole] = useState(ROLES.STUDENT);
  const roleRefs = useRef([]);
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

  const handleRoleKeyDown = (event, index) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const nextIndex = (index + step + ROLE_TABS.length) % ROLE_TABS.length;
    changeRole(ROLE_TABS[nextIndex].value);
    roleRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const res = await loading.run(() => authApi.register(buildPayload(role, values)), "Đang đăng ký...");
      toast.success(res.message);
      navigate(ROUTES.VERIFY_EMAIL, { state: { email: values.email } });
    } catch (error) {
      if (error.response?.status === 409) setError("email", { message: error.message });
      else setServerError(error.message);
    }
  };

  return (
    <AuthShell welcome="Tạo tài khoản" subtitle="Đăng ký để bắt đầu học và luyện thi cùng RoadStudy." title="Đăng ký">
      <div role="radiogroup" aria-label="Loại tài khoản" className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-surface p-1">
        {ROLE_TABS.map(({ value, label }, index) => (
          <button
            key={value}
            ref={(node) => {
              roleRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={role === value}
            tabIndex={role === value ? 0 : -1}
            onClick={() => changeRole(value)}
            onKeyDown={(event) => handleRoleKeyDown(event, index)}
            className={`relative h-11 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${role === value ? "text-primary" : "text-muted hover:text-primary"}`}
          >
            {role === value && <motion.span layoutId="register-role-indicator" transition={tabIndicator} className="absolute inset-0 rounded-lg bg-white shadow-card" />}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
      {role === ROLES.TEACHER && <p className="mb-4 text-xs text-muted">Tài khoản giáo viên cần được quản trị viên duyệt trước khi tạo khóa học.</p>}
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CommonRegisterFields register={register} errors={errors} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={role} variants={stepSlide} initial="hidden" animate="visible" exit="exit" className="space-y-4">
            {role === ROLES.STUDENT ? <StudentFields register={register} errors={errors} /> : <TeacherFields register={register} errors={errors} />}
          </motion.div>
        </AnimatePresence>
        <FormAlert message={serverError} />
        <div className="flex justify-center pt-2">
          <Button type="submit" loading={isSubmitting} className="min-w-44">
            Tạo tài khoản
          </Button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-ink">
        Đã có tài khoản?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="rounded-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthShell>
  );
}
