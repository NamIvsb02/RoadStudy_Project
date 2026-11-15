import { Link } from "react-router-dom";
import { enrollmentApi } from "../../api/enrollmentApi";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import CourseExams from "./list/CourseExams";

const fetchPaidCourses = () => enrollmentApi.getMine({ status: "DA_THANH_TOAN", limit: 100 });

export default function ExamListPage() {
  const { data, loading, error } = useFetch(fetchPaidCourses);

  if (loading) return <LoadingState />;
  if (error) return <FormAlert message={error} />;

  const courses = (data?.items ?? []).map((item) => item.course);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-ink">Đề thi</h1>
      {courses.length === 0 ? (
        <div className="rounded-xl border border-line bg-white p-8 text-center">
          <p className="text-sm text-muted">Bạn chưa có khóa học nào đã thanh toán nên chưa có đề thi.</p>
          <Link to={ROUTES.COURSES} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            Xem danh sách khóa học
          </Link>
        </div>
      ) : (
        courses.map((course) => <CourseExams key={course.id} course={course} />)
      )}
    </div>
  );
}
