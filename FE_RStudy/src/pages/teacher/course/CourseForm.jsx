import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import FormField from "../../../components/ui/FormField";
import TextField from "../../../components/ui/TextField";
import { inputClass } from "../../../components/ui/inputClass";
import { useCategories } from "../../resource/useCategories";
import { courseSchema, toCourseBody } from "./courseSchema";
import CoverUploader from "./CoverUploader";

export default function CourseForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const categories = useCategories();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(courseSchema), defaultValues: initialValues });

  useEffect(() => {
    if (categories.length > 0 && initialValues.categoryId) setValue("categoryId", initialValues.categoryId);
  }, [categories, initialValues.categoryId, setValue]);

  const submit = async (values) => {
    setSubmitError("");
    try {
      await onSubmit(toCourseBody(values));
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextField id="courseName" label="Tên khóa học" required error={errors.courseName?.message} {...register("courseName")} />
      </div>
      <div className="sm:col-span-2">
        <TextField id="description" label="Mô tả" multiline rows={5} required error={errors.description?.message} {...register("description")} />
      </div>
      <FormField label="Danh mục" htmlFor="categoryId" error={errors.categoryId?.message} required>
        <select id="categoryId" aria-invalid={Boolean(errors.categoryId)} className={inputClass(Boolean(errors.categoryId))} {...register("categoryId")}>
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </FormField>
      <TextField id="price" label="Học phí (VND)" hint="Nhập 0 nếu miễn phí" inputMode="decimal" required error={errors.price?.message} {...register("price")} />
      <TextField id="startDate" type="date" label="Ngày bắt đầu" required error={errors.startDate?.message} {...register("startDate")} />
      <TextField id="endDate" type="date" label="Ngày kết thúc" required error={errors.endDate?.message} {...register("endDate")} />
      <div className="sm:col-span-2">
        <CoverUploader value={watch("coverImageUrl")} onChange={(url) => setValue("coverImageUrl", url, { shouldDirty: true })} />
      </div>
      <div className="sm:col-span-2">
        <FormAlert message={submitError} />
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
