import { Link, useSearchParams } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import CourseExamTable from "./exam/CourseExamTable";

const fetchMyCourses = () => courseApi.getMine({ limit: 100 });

export default function TeacherExamsPage() {
  const { data, loading, error } = useFetch(fetchMyCourses);
  const [params, setParams] = useSearchParams();
  const courses = data?.items ?? [];
  const courseId = (courses.find((course) => course.id === params.get("courseId")) ?? courses[0])?.id;

  if (loading) return <LoadingState />;
  if (error) return <FormAlert message={error} />;
  if (courses.length === 0) {
    return <p className="rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">Bạn chưa có khóa học nào nên chưa tạo được đề thi.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          aria-label="Chọn khóa học"
          value={courseId}
          onChange={(event) => setParams({ courseId: event.target.value }, { replace: true })}
          className="h-10 min-w-64 rounded-lg border border-line bg-white px-3 text-sm text-ink"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseName}
            </option>
          ))}
        </select>
        <Link
          to={`${ROUTES.TEACHER.EXAM_NEW}?courseId=${courseId}`}
          className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Tạo đề thi
        </Link>
      </div>
      <CourseExamTable key={courseId} courseId={courseId} />
    </div>
  );
}
