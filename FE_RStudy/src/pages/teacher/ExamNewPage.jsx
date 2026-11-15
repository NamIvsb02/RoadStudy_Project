import { Link, useSearchParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { ROUTES } from "../../constants/routes";
import ExamForm from "./exam/ExamForm";

export default function ExamNewPage() {
  const [params] = useSearchParams();
  const courseId = params.get("courseId");

  if (!courseId) {
    return (
      <div className="rounded-xl border border-line bg-white p-8 text-center">
        <p className="text-sm text-muted">Chưa chọn khóa học để tạo đề thi.</p>
        <Link to={ROUTES.TEACHER.EXAMS} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Về trang Đề thi
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BackButton fallback={`${ROUTES.TEACHER.EXAMS}?courseId=${courseId}`}>Quay lại danh sách đề thi</BackButton>
      <ExamForm courseId={courseId} />
    </div>
  );
}
