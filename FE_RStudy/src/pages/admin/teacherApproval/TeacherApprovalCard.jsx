import Avatar from "../../../components/ui/Avatar";
import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDate } from "../../../utils/format";

export default function TeacherApprovalCard({ teacher, onApprove, onReject }) {
  const { account, approvalStatus } = teacher;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <Avatar name={account.fullName} src={account.avatarUrl} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink">{account.fullName}</p>
            <StatusBadge type="ApprovalStatus" value={approvalStatus} />
          </div>
          <p className="text-sm text-muted">{[account.email, account.phoneNumber].filter(Boolean).join(" · ")}</p>
          <p className="mt-2 text-sm text-ink">
            <span className="font-medium">Chuyên môn:</span> {teacher.specialization}
          </p>
          <p className="mt-1 line-clamp-3 text-sm text-muted">Giới thiệu: {teacher.biography}</p>
          <p className="mt-1 line-clamp-3 text-sm text-muted">Kinh nghiệm: {teacher.teachingExperience}</p>
          <p className="mt-1 text-xs text-muted">Đăng ký ngày {formatDate(account.createdAt)}</p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        {approvalStatus !== "DA_DUYET" && <Button onClick={onApprove}>Duyệt</Button>}
        {approvalStatus !== "TU_CHOI" && approvalStatus !== "DA_DUYET" && (
          <Button variant="secondary" onClick={onReject}>
            Từ chối
          </Button>
        )}
      </div>
    </article>
  );
}
