import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { EDITABLE_STATUSES } from "./courseSchema";

const actionClass = "text-xs font-semibold text-primary hover:underline disabled:opacity-50";
const HINTS = { CHO_DUYET: "Đang chờ admin duyệt", DA_PHE_DUYET: "Chờ admin mở đăng ký" };

export default function CourseActions({ course, busy, onSubmitForApproval }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {EDITABLE_STATUSES.includes(course.status) && (
        <Link to={generatePath(ROUTES.TEACHER.COURSE_EDIT, { id: course.id })} className={actionClass}>
          Sửa
        </Link>
      )}
      {course.status === "BAN_NHAP" && (
        <button type="button" disabled={busy} onClick={() => onSubmitForApproval(course)} className={actionClass}>
          Gửi duyệt
        </button>
      )}
      <Link to={generatePath(ROUTES.TEACHER.COURSE_LEARNING, { id: course.id })} className={actionClass}>
        Lớp học
      </Link>
      <Link to={`${ROUTES.TEACHER.EXAMS}?courseId=${course.id}`} className={actionClass}>
        Đề thi
      </Link>
      {HINTS[course.status] && <span className="text-xs text-muted">{HINTS[course.status]}</span>}
    </div>
  );
}
