import { useRef, useState } from "react";
import { accountApi } from "../../api/accountApi";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROLES } from "../../constants/roles";
import { ROLE_LABELS } from "../../constants/statuses";
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
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <Avatar name={account.fullName} src={account.avatarUrl} size="xl" />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="truncate text-xl font-semibold text-ink">{account.fullName}</p>
          <p className="truncate text-sm text-muted">{account.email}</p>
          <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
            <span className="text-sm text-ink">{ROLE_LABELS[account.role]}</span>
            {account.role === ROLES.TEACHER && <StatusBadge type="ApprovalStatus" value={account.teacher?.approvalStatus} />}
          </div>
        </div>
        <Button variant="secondary" loading={uploading} onClick={() => inputRef.current?.click()}>
          Đổi ảnh đại diện
        </Button>
        <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} onChange={handleChange} className="hidden" />
      </div>
      <div className="mt-4 empty:hidden">
        <FormAlert message={error} />
      </div>
    </section>
  );
}
