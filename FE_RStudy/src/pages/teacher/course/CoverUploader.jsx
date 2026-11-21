import { useRef, useState } from "react";
import { courseApi } from "../../../api/courseApi";
import CourseCover from "../../../components/common/CourseCover";
import Button from "../../../components/ui/Button";
import FormField from "../../../components/ui/FormField";
import { toCoverFile } from "./coverImage";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function CoverUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Ảnh tối đa 10MB");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const res = await courseApi.uploadCover(await toCoverFile(file));
      onChange(res.data.coverImageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormField label="Ảnh bìa" htmlFor="coverImage" error={error} hint="JPG, PNG hoặc WEBP, tối thiểu 640x360. Ảnh tự được cắt giữa theo tỉ lệ 16:9. Không bắt buộc.">
      <div className="flex flex-wrap items-center gap-4">
        <CourseCover src={value} alt="Ảnh bìa khóa học" className="max-w-3xs rounded-lg border border-line" />
        <div className="flex gap-2">
          <input ref={inputRef} id="coverImage" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="sr-only" />
          <Button variant="outline" loading={uploading} onClick={() => inputRef.current?.click()}>
            {value ? "Đổi ảnh" : "Chọn ảnh"}
          </Button>
          {value && (
            <Button variant="ghost" disabled={uploading} onClick={() => onChange("")}>
              Xóa ảnh
            </Button>
          )}
        </div>
      </div>
    </FormField>
  );
}
