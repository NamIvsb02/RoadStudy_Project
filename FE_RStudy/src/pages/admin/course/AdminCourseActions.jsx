import { ACTION_LINK, ACTIONS } from "../../manage/tableStyles";
import { STEPS } from "./courseActions";

export default function AdminCourseActions({ course, busy, onAction }) {
  const steps = STEPS[course.status] ?? [];

  return (
    <div className={ACTIONS}>
      {steps.map((step) => (
        <button key={step.key} type="button" disabled={busy} onClick={() => onAction(course, step.key)} className={ACTION_LINK}>
          {step.label}
        </button>
      ))}
    </div>
  );
}
