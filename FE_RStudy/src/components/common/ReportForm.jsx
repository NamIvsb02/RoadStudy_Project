import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { reportApi } from "../../api/reportApi";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";

const schema = z.object({
  reason: z.string().trim().min(1, "Vui lòng nhập lý do").max(500, "Lý do tối đa 500 ký tự"),
  content: z.string().trim().min(1, "Vui lòng mô tả chi tiết").max(2000, "Mô tả tối đa 2000 ký tự"),
});

export default function ReportForm({ target, onClose, onSent }) {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { reason: "", content: "" } });

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSubmitting, onClose]);

  const onSubmit = async (values) => {
    setSubmitError("");
    try {
      await reportApi.create({ ...values, ...target });
      onSent();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 flex flex-col gap-4">
      <TextField id="report-reason" label="Lý do" placeholder="Ví dụ: ngôn từ xúc phạm" required error={errors.reason?.message} {...register("reason")} />
      <TextField id="report-content" label="Mô tả chi tiết" multiline rows={4} required error={errors.content?.message} {...register("content")} />
      <FormAlert message={submitError} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Gửi báo cáo
        </Button>
      </div>
    </form>
  );
}
