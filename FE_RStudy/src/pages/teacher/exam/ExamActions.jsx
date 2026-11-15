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

const actionClass = "text-xs font-semibold text-primary hover:underline disabled:opacity-50";

export default function ExamActions({ exam, busy, onChangeStatus, onDelete }) {
  const empty = exam.attemptCount === 0;
  const steps = (NEXT[exam.status] ?? []).filter((step) => !step.needsEmpty || empty);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <Link to={generatePath(ROUTES.TEACHER.EXAM_SUBMISSIONS, { id: exam.id })} className={actionClass}>
        Bài làm
      </Link>
      {exam.status === "BAN_NHAP" && <span className="text-xs text-muted">Chờ admin phê duyệt</span>}
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
