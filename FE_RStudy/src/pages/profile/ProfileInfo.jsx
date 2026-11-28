import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROLES } from "../../constants/roles";
import { GENDER_LABELS, ROLE_LABELS } from "../../constants/statuses";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/format";

const EMPTY = "Chưa cập nhật";

const buildRows = (account) => {
  const rows = [
    { label: "Họ và tên", value: account.fullName },
    { label: "Email", value: account.email },
    { label: "Số điện thoại", value: account.phoneNumber },
    { label: "Vai trò", value: ROLE_LABELS[account.role] },
  ];
  if (account.role === ROLES.STUDENT) {
    const student = account.student ?? {};
    rows.push(
      { label: "Ngày sinh", value: student.dateOfBirth && formatDate(student.dateOfBirth) },
      { label: "Giới tính", value: GENDER_LABELS[student.gender] },
      { label: "Địa chỉ", value: student.address },
    );
  }
  if (account.role === ROLES.TEACHER) {
    const teacher = account.teacher ?? {};
    rows.push(
      { label: "Trạng thái duyệt", value: teacher.approvalStatus && <StatusBadge type="ApprovalStatus" value={teacher.approvalStatus} /> },
      { label: "Chuyên môn", value: teacher.specialization },
      { label: "Giới thiệu", value: teacher.biography, long: true },
      { label: "Kinh nghiệm giảng dạy", value: teacher.teachingExperience, long: true },
    );
  }
  return rows;
};

export default function ProfileInfo({ onEdit, onChangePassword }) {
  const { account } = useAuth();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink-strong">Thông tin cá nhân</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onEdit}>Chỉnh sửa thông tin</Button>
          <Button variant="secondary" onClick={onChangePassword}>
            Thay đổi mật khẩu
          </Button>
        </div>
      </div>
      <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
        {buildRows(account).map(({ label, value, long }) => (
          <div key={label} className="contents">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className={`-mt-3 break-words text-sm font-medium sm:mt-0 ${value ? "text-ink-strong" : "text-muted"} ${long ? "whitespace-pre-line" : ""}`}>{value || EMPTY}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
