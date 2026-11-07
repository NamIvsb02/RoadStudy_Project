import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import FormField from "../../components/ui/FormField";
import PasswordInput from "../../components/ui/PasswordInput";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { changePasswordSchema } from "./profileSchemas";

export default function ChangePasswordForm() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async ({ oldPassword, newPassword }) => {
    setServerError("");
    try {
      const res = await authApi.changePassword({ oldPassword, newPassword });
      await logout();
      toast.success(res.message);
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <h2 className="text-lg font-semibold text-ink">Đổi mật khẩu</h2>
      <p className="mb-4 text-sm text-muted">Sau khi đổi, bạn sẽ được đăng xuất và cần đăng nhập lại.</p>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Mật khẩu hiện tại" htmlFor="oldPassword" error={errors.oldPassword?.message} required>
          <PasswordInput id="oldPassword" placeholder="Mật khẩu hiện tại" autoComplete="current-password" hasError={Boolean(errors.oldPassword)} {...register("oldPassword")} />
        </FormField>
        <FormField label="Mật khẩu mới" htmlFor="newPassword" error={errors.newPassword?.message} required>
          <PasswordInput id="newPassword" placeholder="Mật khẩu mới" autoComplete="new-password" hasError={Boolean(errors.newPassword)} {...register("newPassword")} />
        </FormField>
        <FormField label="Xác nhận mật khẩu mới" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
          <PasswordInput id="confirmPassword" placeholder="Xác nhận mật khẩu mới" autoComplete="new-password" hasError={Boolean(errors.confirmPassword)} {...register("confirmPassword")} />
        </FormField>
        <FormAlert message={serverError} />
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            Đổi mật khẩu
          </Button>
        </div>
      </form>
    </section>
  );
}
