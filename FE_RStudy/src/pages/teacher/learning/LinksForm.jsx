import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { learningApi } from "../../../api/learningApi";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import TextField from "../../../components/ui/TextField";

const httpsOrEmpty = z
  .string()
  .trim()
  .max(2048, "Đường dẫn tối đa 2048 ký tự")
  .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), "Đường dẫn phải bắt đầu bằng https://");
const schema = z.object({ classUrl: httpsOrEmpty, driveUrl: httpsOrEmpty });

export default function LinksForm({ courseId, initial, onSaved }) {
  const [message, setMessage] = useState({ error: "", saved: false });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { classUrl: initial.classUrl ?? "", driveUrl: initial.driveUrl ?? "" } });

  const onSubmit = async (values) => {
    setMessage({ error: "", saved: false });
    try {
      await learningApi.update(courseId, values);
      setMessage({ error: "", saved: true });
      onSaved();
    } catch (err) {
      setMessage({ error: err.message, saved: false });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5">
      <h2 className="text-base font-semibold text-ink">Liên kết của lớp học</h2>
      <TextField
        id="classUrl"
        label="Link vào học (Meet, Zoom...)"
        hint='Học viên bấm nút "Vào học" sẽ mở link này'
        placeholder="https://meet.google.com/..."
        error={errors.classUrl?.message}
        {...register("classUrl")}
      />
      <TextField id="driveUrl" label="Link tài liệu (Google Drive)" placeholder="https://drive.google.com/..." error={errors.driveUrl?.message} {...register("driveUrl")} />
      <FormAlert message={message.error} />
      {message.saved && <p className="text-sm text-success">Đã lưu.</p>}
      <div>
        <Button type="submit" loading={isSubmitting}>
          Lưu
        </Button>
      </div>
    </form>
  );
}
