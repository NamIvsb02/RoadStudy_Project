import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import CourseSelect from "../../components/common/CourseSelect";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/ui/LoadingState";
import { useFetch } from "../../hooks/useFetch";
import CourseExamTable from "../teacher/exam/CourseExamTable";

const fetchCourses = () => courseApi.getAdminList({ limit: 100 });

export default function AdminExamsPage() {
  const { data, loading, error } = useFetch(fetchCourses);
  const [params, setParams] = useSearchParams();
  const courseId = params.get("courseId") ?? "";
  const courses = useMemo(() => data?.items ?? [], [data]);
  const selected = courses.find((course) => course.id === courseId);
  const scope = useMemo(() => (selected ? [selected] : courses), [selected, courses]);

  if (loading) return <LoadingState />;
  if (error) return <FormAlert message={error} />;
  if (courses.length === 0) return <p className="rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">Chưa có khóa học nào.</p>;

  return (
    <div className="flex flex-col gap-4">
      <CourseSelect courses={courses} value={selected ? courseId : ""} onChange={(value) => setParams(value ? { courseId: value } : {}, { replace: true })} />
      <CourseExamTable key={selected?.id ?? "all"} courses={scope} isAdmin />
    </div>
  );
}
