import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../components/common/AuthShell";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import FormField from "../../components/ui/FormField";
import PasswordInput from "../../components/ui/PasswordInput";
import TextField from "../../components/ui/TextField";
import { ROLE_HOME, ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "./authSchemas";

const linkClass = "font-medium text-primary transition-colors hover:text-primary-dark";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setServerError("");
    setUnverifiedEmail("");
    try {
      const account = await login(values);
      navigate(location.state?.from ?? ROLE_HOME[account.role] ?? ROUTES.HOME, { replace: true });
    } catch (error) {
      setServerError(error.message);
      if (error.response?.status === 403 && error.message.includes("xác minh")) {
        setUnverifiedEmail(values.email);
      }
    }
  };

  return (
    <AuthShell welcome="Chào mừng trở lại" subtitle="Đăng nhập để tiếp tục học tập cùng RoadStudy." title="Đăng nhập">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField id="email" type="email" label="Email" placeholder="Email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <FormField label="Mật khẩu" htmlFor="password" error={errors.password?.message}>
          <PasswordInput id="password" placeholder="Mật khẩu" autoComplete="current-password" hasError={Boolean(errors.password)} {...register("password")} />
        </FormField>
        <FormAlert message={serverError} />
        {unverifiedEmail && (
          <Link to={ROUTES.VERIFY_EMAIL} state={{ email: unverifiedEmail }} className={`block text-sm ${linkClass}`}>
            Xác minh email ngay
          </Link>
        )}
        <div className="flex justify-center pt-2">
          <Button type="submit" loading={isSubmitting} className="min-w-44">
            Đăng nhập
          </Button>
        </div>
      </form>
      <div className="mt-6 space-y-2 text-center text-sm text-ink">
        <p>
          <Link to={ROUTES.FORGOT_PASSWORD} className={linkClass}>
            Quên mật khẩu?
          </Link>
        </p>
        <p>
          Chưa có tài khoản?{" "}
          <Link to={ROUTES.REGISTER} className={linkClass}>
            Đăng ký
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
