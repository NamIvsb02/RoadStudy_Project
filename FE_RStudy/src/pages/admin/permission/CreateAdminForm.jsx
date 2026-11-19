import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { adminApi } from "../../../api/adminApi";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import CommonRegisterFields from "../../auth/CommonRegisterFields";
import { createAdminSchema } from "./createAdminSchema";

const DEFAULT_VALUES = { fullName: "", email: "", password: "", confirmPassword: "", phoneNumber: "" };

export default function CreateAdminForm({ onClose, onCreated }) {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(createAdminSchema), defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSubmitting, onClose]);

  const onSubmit = async (values) => {
    setSubmitError("");
    const body = { fullName: values.fullName, email: values.email, password: values.password };
    if (values.phoneNumber) body.phoneNumber = values.phoneNumber;
    try {
      const res = await adminApi.create(body);
      onCreated(res.data);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 flex flex-col gap-4">
      <CommonRegisterFields register={register} errors={errors} />
      <FormAlert message={submitError} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Tạo tài khoản
        </Button>
      </div>
    </form>
  );
}
