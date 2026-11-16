import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import CourseSelect from "../../components/common/CourseSelect";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import CourseExamTable from "./exam/CourseExamTable";

const fetchMyCourses = () => courseApi.getMine({ limit: 100 });

export default function TeacherExamsPage() {
  const { data, loading, error } = useFetch(fetchMyCourses);
  const [params, setParams] = useSearchParams();
  const courseId = params.get("courseId") ?? "";
  const courses = useMemo(() => data?.items ?? [], [data]);
  const selected = courses.find((course) => course.id === courseId);
  const scope = useMemo(() => (selected ? [selected] : courses), [selected, courses]);

  if (loading) return <LoadingState />;
  if (error) return <FormAlert message={error} />;
  if (courses.length === 0) {
    return <p className="rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">Bạn chưa có khóa học nào nên chưa tạo được đề thi.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CourseSelect courses={courses} value={selected ? courseId : ""} onChange={(value) => setParams(value ? { courseId: value } : {}, { replace: true })} />
        {selected ? (
          <Link
            to={`${ROUTES.TEACHER.EXAM_NEW}?courseId=${selected.id}`}
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Tạo đề thi
          </Link>
        ) : (
          <p className="text-sm text-muted">Chọn một khóa học cụ thể để tạo đề thi.</p>
        )}
      </div>
      <CourseExamTable key={selected?.id ?? "all"} courses={scope} />
    </div>
  );
}
