import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import TextField from "../../../components/ui/TextField";

const schema = z.object({
  categoryName: z.string().trim().min(1, "Nhập tên danh mục").max(100, "Tên danh mục tối đa 100 ký tự"),
  description: z.string().trim().max(500, "Mô tả tối đa 500 ký tự"),
  status: z.enum(["HOAT_DONG", "AN"]),
});

const toBody = (values, editing) => ({
  categoryName: values.categoryName,
  status: values.status,
  ...(values.description ? { description: values.description } : editing ? { description: null } : {}),
});

export default function CategoryForm({ category, onSubmit, onCancel }) {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { categoryName: category?.categoryName ?? "", description: category?.description ?? "", status: category?.status ?? "HOAT_DONG" },
  });

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" && !isSubmitting) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSubmitting, onCancel]);

  const submit = async (values) => {
    setSubmitError("");
    try {
      await onSubmit(toBody(values, Boolean(category)));
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="mt-4 flex flex-col gap-4">
      <TextField id="categoryName" label="Tên danh mục" required error={errors.categoryName?.message} {...register("categoryName")} />
      <TextField id="description" label="Mô tả" multiline rows={3} hint="Không bắt buộc" error={errors.description?.message} {...register("description")} />
      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-1 text-sm font-medium text-ink">Trạng thái</legend>
        {[
          ["HOAT_DONG", "Hiển thị với học viên"],
          ["AN", "Ẩn"],
        ].map(([value, label]) => (
          <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="radio" value={value} className="size-4 accent-primary" {...register("status")} />
            {label}
          </label>
        ))}
      </fieldset>
      <FormAlert message={submitError} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {category ? "Lưu thay đổi" : "Tạo danh mục"}
        </Button>
      </div>
    </form>
  );
}
