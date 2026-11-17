import { STEPS } from "./courseActions";

export default function AdminCourseActions({ course, busy, onAction }) {
  const steps = STEPS[course.status] ?? [];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {steps.map((step) => (
        <button key={step.key} type="button" disabled={busy} onClick={() => onAction(course, step.key)} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">
          {step.label}
        </button>
      ))}
    </div>
  );
}
