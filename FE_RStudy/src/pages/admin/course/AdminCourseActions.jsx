import { generatePath, Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { ACTION_LINK, ACTIONS } from "../../manage/tableStyles";
import { canAdminEdit, STEPS } from "./courseActions";

export default function AdminCourseActions({ course, busy, onAction }) {
  const steps = STEPS[course.status] ?? [];

  return (
    <div className={ACTIONS}>
      {canAdminEdit(course) && (
        <Link to={generatePath(ROUTES.ADMIN.COURSE_EDIT, { id: course.id })} className={ACTION_LINK}>
          Sửa
        </Link>
      )}
      {steps.map((step) => (
        <button key={step.key} type="button" disabled={busy} onClick={() => onAction(course, step.key)} className={ACTION_LINK}>
          {step.label}
        </button>
      ))}
    </div>
  );
}
