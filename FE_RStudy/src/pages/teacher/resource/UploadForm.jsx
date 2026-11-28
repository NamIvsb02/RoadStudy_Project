import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resourceApi } from "../../../api/resourceApi";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import FormField from "../../../components/ui/FormField";
import TextField from "../../../components/ui/TextField";
import { inputClass } from "../../../components/ui/inputClass";
import { useCategories } from "../../../hooks/useCategories";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const schema = z.object({
  resourceName: z.string().trim().min(1, "Nhập tên tài liệu").max(200, "Tên tối đa 200 ký tự"),
  categoryId: z.string().min(1, "Chọn danh mục"),
});

export default function UploadForm({ onUploaded }) {
  const categories = useCategories();
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { resourceName: "", categoryId: "" } });

  const handleFile = (event) => {
    const picked = event.target.files[0] ?? null;
    setFile(picked);
    if (picked && !ALLOWED.includes(picked.type)) setFileError("Chỉ chấp nhận tệp PDF hoặc DOCX");
    else if (picked && picked.size > MAX_SIZE) setFileError("Tệp tối đa 10MB");
    else setFileError("");
  };

  const onSubmit = async (values) => {
    if (!file) {
      setFileError("Vui lòng chọn tệp");
      return;
    }
    if (fileError) return;
    setSubmitError("");
    const body = new FormData();
    body.append("resourceName", values.resourceName);
    body.append("categoryId", values.categoryId);
    body.append("file", file);
    try {
      await resourceApi.upload(body);
      reset();
      setFile(null);
      setFileKey((key) => key + 1);
      onUploaded();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextField id="resourceName" label="Tên tài liệu" required error={errors.resourceName?.message} {...register("resourceName")} />
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
      <FormField label="Tệp (PDF hoặc DOCX, tối đa 10MB)" htmlFor="resourceFile" error={fileError} required>
        <input
          key={fileKey}
          id="resourceFile"
          type="file"
          accept=".pdf,.docx"
          onChange={handleFile}
          className="block w-full text-sm text-ink file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
        />
      </FormField>
      <div className="sm:col-span-2">
        <FormAlert message={submitError} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" loading={isSubmitting}>
          Tải tài liệu lên
        </Button>
      </div>
    </form>
  );
}
