import { useRef, useState } from "react";
import { courseApi } from "../../../api/courseApi";
import Button from "../../../components/ui/Button";
import FormField from "../../../components/ui/FormField";
import { assetUrl } from "../../../utils/format";

const MAX_SIZE = 3 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function CoverUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Ảnh tối đa 3MB");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const res = await courseApi.uploadCover(file);
      setPreviewFailed(false);
      onChange(res.data.coverImageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormField label="Ảnh bìa" htmlFor="coverImage" error={error} hint="JPG, PNG hoặc WEBP, tối đa 3MB. Không bắt buộc.">
      <div className="flex flex-wrap items-center gap-4">
        {value && !previewFailed ? (
          <img src={assetUrl(value)} alt="Ảnh bìa khóa học" onError={() => setPreviewFailed(true)} className="aspect-video w-48 rounded-lg border border-line object-cover" />
        ) : (
          <div className="flex aspect-video w-48 items-center justify-center rounded-lg border border-dashed border-line text-xs text-muted">Chưa có ảnh</div>
        )}
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
