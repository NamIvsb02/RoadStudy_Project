import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import AuthShell from "../../components/common/AuthShell";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import TextField from "../../components/ui/TextField";
import { ROUTES } from "../../constants/routes";
import { useToast } from "../../hooks/useToast";
import { forgotPasswordSchema } from "./authSchemas";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const res = await authApi.forgotPassword(values);
      toast.success(res.message);
      navigate(ROUTES.RESET_PASSWORD, { state: { email: values.email } });
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <AuthShell welcome="Quên mật khẩu?" subtitle="Nhập email để nhận mã đặt lại mật khẩu." title="Quên mật khẩu">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField id="email" type="email" label="Email" placeholder="Email" autoComplete="email" required error={errors.email?.message} {...register("email")} />
        <FormAlert message={serverError} />
        <div className="flex justify-center pt-2">
          <Button type="submit" loading={isSubmitting} className="min-w-44">
            Gửi mã
          </Button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-ink">
        <Link to={ROUTES.LOGIN} className="font-medium text-primary transition-colors hover:text-primary-dark">
          Quay lại đăng nhập
        </Link>
      </p>
    </AuthShell>
  );
}
