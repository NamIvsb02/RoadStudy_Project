import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { accountApi } from "../../api/accountApi";
import Avatar from "../../components/ui/Avatar";
import FormAlert from "../../components/ui/FormAlert";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

export default function AvatarUploader() {
  const { account, updateAccount } = useAuth();
  const toast = useToast();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Chỉ chấp nhận ảnh .jpg, .png, .webp");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Ảnh tối đa 2MB");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const res = await accountApi.uploadAvatar(file);
      updateAccount(res.data);
      toast.success(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Đổi ảnh đại diện"
        className="group relative rounded-full disabled:cursor-wait"
      >
        <Avatar name={account.fullName} src={account.avatarUrl} size="xl" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink-strong/50 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera size={24} aria-hidden="true" />
        </span>
      </button>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-primary transition-colors duration-150 hover:text-primary-dark disabled:opacity-60"
      >
        {uploading ? "Đang tải ảnh lên..." : "Đổi ảnh đại diện"}
      </button>
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} onChange={handleChange} className="hidden" />
      <div className="w-full empty:hidden">
        <FormAlert message={error} />
      </div>
    </div>
  );
}
