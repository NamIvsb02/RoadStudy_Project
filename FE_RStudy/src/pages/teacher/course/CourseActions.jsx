import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { ACTION_LINK, ACTIONS } from "../../manage/tableStyles";
import { EDITABLE_STATUSES } from "./courseSchema";

const HINTS = {
  CHO_DUYET: "Đang chờ admin duyệt",
  DA_PHE_DUYET: "Chờ admin mở đăng ký",
};

export default function CourseActions({ course, busy, onSubmitForApproval }) {
  return (
    <div className={ACTIONS}>
      {EDITABLE_STATUSES.includes(course.status) && (
        <Link to={generatePath(ROUTES.TEACHER.COURSE_EDIT, { id: course.id })} className={ACTION_LINK}>
          Sửa
        </Link>
      )}
      {course.status === "BAN_NHAP" && (
        <button type="button" disabled={busy} onClick={() => onSubmitForApproval(course)} className={ACTION_LINK}>
          Gửi duyệt
        </button>
      )}
      <Link to={generatePath(ROUTES.TEACHER.COURSE_LEARNING, { id: course.id })} className={ACTION_LINK}>
        Lớp học
      </Link>
      <Link to={`${ROUTES.TEACHER.EXAMS}?courseId=${course.id}`} className={ACTION_LINK}>
        Đề thi
      </Link>
      {HINTS[course.status] && <span className="px-2 text-xs text-muted">{HINTS[course.status]}</span>}
    </div>
  );
}
