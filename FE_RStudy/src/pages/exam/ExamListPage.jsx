import { Link } from "react-router-dom";
import { enrollmentApi } from "../../api/enrollmentApi";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import ListSkeleton from "../../components/common/ListSkeleton";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import CourseExams from "./list/CourseExams";

const fetchPaidCourses = () => enrollmentApi.getMine({ status: "DA_THANH_TOAN", limit: 100 });

export default function ExamListPage() {
  const { data, loading, error, reload } = useFetch(fetchPaidCourses);

  if (loading) return <ListSkeleton rows={3} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const courses = (data?.items ?? []).map((item) => item.course);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-ink">Đề thi</h1>
      {courses.length === 0 ? (
        <div className="rounded-xl border border-line bg-white">
          <EmptyState
            title="Chưa có đề thi"
            description="Bạn chưa có khóa học nào đã thanh toán nên chưa có đề thi."
            action={
              <Link to={ROUTES.COURSES} className="inline-flex h-11 items-center text-sm font-semibold text-primary hover:underline">
                Xem danh sách khóa học
              </Link>
            }
          />
        </div>
      ) : (
        courses.map((course) => <CourseExams key={course.id} course={course} />)
      )}
    </div>
  );
}
