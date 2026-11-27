import { formatDate } from "../../utils/format";
import EnrollPanel from "./EnrollPanel";

export default function CourseEnrollBox({ course }) {
  return (
    <div className="space-y-4 rounded-xl border border-line bg-white p-5 shadow-card">
      <EnrollPanel course={course} />
      <dl className="space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Khai giảng</dt>
          <dd className="font-medium text-ink-strong">{formatDate(course.startDate)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Kết thúc</dt>
          <dd className="font-medium text-ink-strong">{formatDate(course.endDate)}</dd>
        </div>
      </dl>
    </div>
  );
}