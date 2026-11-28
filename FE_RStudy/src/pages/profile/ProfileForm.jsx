import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { accountApi } from "../../api/accountApi";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import TextField from "../../components/ui/TextField";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import StudentFields from "../auth/StudentFields";
import TeacherFields from "../auth/TeacherFields";
import { toFormValues, toPayload } from "./profileMapper";
import { getProfileSchema } from "./profileSchemas";
import { useGlobalLoading } from "../../hooks/useGlobalLoading";

export default function ProfileForm({ onCancel, onSaved }) {
  const { account, updateAccount } = useAuth();
  const toast = useToast();
  const loading = useGlobalLoading();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(getProfileSchema(account.role)),
    defaultValues: toFormValues(account),
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const res = await loading.run(() => accountApi.updateProfile(toPayload(account.role, values)), "Đang lưu thay đổi...");
      updateAccount(res.data);
      reset(toFormValues(res.data));
      toast.success(res.message);
      onSaved?.();
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-lg font-semibold text-ink-strong">Chỉnh sửa thông tin</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField id="email" label="Email" defaultValue={account.email} disabled hint="Email không thể thay đổi." />
        <TextField id="fullName" label="Họ và tên" placeholder="Họ và tên" required error={errors.fullName?.message} {...register("fullName")} />
        <TextField id="phoneNumber" type="tel" label="Số điện thoại" placeholder="Số điện thoại" error={errors.phoneNumber?.message} {...register("phoneNumber")} />
        {account.role === ROLES.STUDENT && <StudentFields register={register} errors={errors} />}
        {account.role === ROLES.TEACHER && <TeacherFields register={register} errors={errors} />}
        <FormAlert message={serverError} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </>
  );
}
