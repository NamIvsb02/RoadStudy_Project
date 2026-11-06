import FormField from "../../components/ui/FormField";
import PasswordInput from "../../components/ui/PasswordInput";
import TextField from "../../components/ui/TextField";

export default function CommonRegisterFields({ register, errors }) {
  return (
    <>
      <TextField id="fullName" label="Họ và tên" placeholder="Họ và tên" autoComplete="name" required error={errors.fullName?.message} {...register("fullName")} />
      <TextField id="email" type="email" label="Email" placeholder="Email" autoComplete="email" required error={errors.email?.message} {...register("email")} />
      <FormField label="Mật khẩu" htmlFor="password" error={errors.password?.message} required>
        <PasswordInput id="password" placeholder="Mật khẩu" autoComplete="new-password" hasError={Boolean(errors.password)} {...register("password")} />
      </FormField>
      <FormField label="Xác nhận lại mật khẩu" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
        <PasswordInput id="confirmPassword" placeholder="Xác nhận lại mật khẩu" autoComplete="new-password" hasError={Boolean(errors.confirmPassword)} {...register("confirmPassword")} />
      </FormField>
      <TextField id="phoneNumber" type="tel" label="Số điện thoại" placeholder="Số điện thoại" autoComplete="tel" error={errors.phoneNumber?.message} {...register("phoneNumber")} />
    </>
  );
}
