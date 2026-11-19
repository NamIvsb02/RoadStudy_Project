import { formatDate } from "../../utils/format";
import EnrollPanel from "./EnrollPanel";

export default function CourseEnrollBox({ course }) {
  return (
    <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <EnrollPanel course={course} />
      <dl className="space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Khai giảng</dt>
          <dd className="font-medium text-slate-800">{formatDate(course.startDate)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Kết thúc</dt>
          <dd className="font-medium text-slate-800">{formatDate(course.endDate)}</dd>
        </div>
      </dl>
    </div>
  );
}