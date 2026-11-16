import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const NEXT = {
  DA_PHE_DUYET: [{ status: "DANG_MO", label: "Mở đề" }],
  DANG_MO: [{ status: "TAM_NGUNG", label: "Tạm ngưng" }],
  TAM_NGUNG: [
    { status: "DANG_MO", label: "Mở lại" },
    { status: "BAN_NHAP", label: "Về bản nháp", needsEmpty: true },
  ],
};
const ADMIN_NEXT = { BAN_NHAP: [{ status: "DA_PHE_DUYET", label: "Phê duyệt" }] };

const actionClass = "text-xs font-semibold text-primary hover:underline disabled:opacity-50";

export default function ExamActions({ exam, busy, isAdmin = false, onChangeStatus, onDelete, onPreview }) {
  const empty = exam.attemptCount === 0;
  const steps = [...(isAdmin ? (ADMIN_NEXT[exam.status] ?? []) : []), ...(NEXT[exam.status] ?? [])].filter((step) => !step.needsEmpty || empty);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <button type="button" onClick={() => onPreview(exam)} className={actionClass}>
        Xem đề
      </button>
      {!isAdmin && (
        <Link to={generatePath(ROUTES.TEACHER.EXAM_SUBMISSIONS, { id: exam.id })} className={actionClass}>
          Bài làm
        </Link>
      )}
      {!isAdmin && exam.status === "BAN_NHAP" && <span className="text-xs text-muted">Chờ admin phê duyệt</span>}
      {steps.map((step) => (
        <button key={step.status} type="button" disabled={busy} onClick={() => onChangeStatus(exam, step.status)} className={actionClass}>
          {step.label}
        </button>
      ))}
      {empty && (
        <button type="button" disabled={busy} onClick={() => onDelete(exam)} className="text-xs font-semibold text-danger hover:underline disabled:opacity-50">
          Xóa
        </button>
      )}
    </div>
  );
}
