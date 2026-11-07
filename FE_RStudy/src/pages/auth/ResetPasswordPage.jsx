import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import AuthShell from "../../components/common/AuthShell";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import FormField from "../../components/ui/FormField";
import PasswordInput from "../../components/ui/PasswordInput";
import TextField from "../../components/ui/TextField";
import { ROUTES } from "../../constants/routes";
import { useToast } from "../../hooks/useToast";
import { resetPasswordSchema } from "./authSchemas";

const OTP_PURPOSE = "QUEN_MAT_KHAU";
const linkClass = "font-medium text-primary transition-colors hover:text-primary-dark";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [serverError, setServerError] = useState("");
  const [resending, setResending] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: location.state?.email ?? "", code: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async ({ email, code, newPassword }) => {
    setServerError("");
    try {
      const res = await authApi.resetPassword({ email, code, newPassword });
      toast.success(res.message);
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      setServerError(error.message);
    }
  };

  const handleResend = async () => {
    setServerError("");
    if (!(await trigger("email"))) return;
    setResending(true);
    try {
      const res = await authApi.resendOtp({ email: getValues("email"), purpose: OTP_PURPOSE });
      toast.success(res.message);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell welcome="Đặt lại mật khẩu" subtitle="Nhập mã xác thực trong email và mật khẩu mới của bạn." title="Đặt lại mật khẩu">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField id="email" type="email" label="Email" placeholder="Email" autoComplete="email" required error={errors.email?.message} {...register("email")} />
        <TextField id="code" label="Mã xác thực" placeholder="6 chữ số" inputMode="numeric" maxLength={6} autoComplete="one-time-code" required error={errors.code?.message} {...register("code")} />
        <FormField label="Mật khẩu mới" htmlFor="newPassword" error={errors.newPassword?.message} required>
          <PasswordInput id="newPassword" placeholder="Mật khẩu mới" autoComplete="new-password" hasError={Boolean(errors.newPassword)} {...register("newPassword")} />
        </FormField>
        <FormField label="Xác nhận mật khẩu mới" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
          <PasswordInput id="confirmPassword" placeholder="Xác nhận mật khẩu mới" autoComplete="new-password" hasError={Boolean(errors.confirmPassword)} {...register("confirmPassword")} />
        </FormField>
        <FormAlert message={serverError} />
        <div className="flex justify-center pt-2">
          <Button type="submit" loading={isSubmitting} className="min-w-44">
            Đặt lại mật khẩu
          </Button>
        </div>
      </form>
      <div className="mt-6 space-y-2 text-center text-sm text-ink">
        <p>
          Chưa nhận được mã?{" "}
          <button type="button" onClick={handleResend} disabled={resending} className={`${linkClass} disabled:opacity-60`}>
            {resending ? "Đang gửi..." : "Gửi lại mã"}
          </button>
        </p>
        <p>
          <Link to={ROUTES.LOGIN} className={linkClass}>
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
