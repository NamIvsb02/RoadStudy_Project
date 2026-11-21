import { useCallback } from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import DashboardPanel from "../../components/common/DashboardPanel";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import { learningApi } from "../../api/learningApi";
import { formatDate } from "../../utils/format";
import LearnExams from "./LearnExams";
import SessionList from "./SessionList";
import CommentSection from "../courseDetail/CommentSection";

const linkButton = "inline-flex items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors";

export default function LearnPage() {
  const { courseId } = useParams();
  const request = useCallback(() => learningApi.get(courseId), [courseId]);
  const { data, loading, error } = useFetch(request);

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <FormAlert message={error} />
        <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: courseId })} className="text-sm font-semibold text-primary hover:underline">
          Xem trang khóa học
        </Link>
      </div>
    );
  }

  const { course } = data;

  return (
    <div className="flex flex-col gap-4">
      <BackButton fallback={ROUTES.MY_COURSES}>Quay lại khóa học của tôi</BackButton>
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-white p-5">
        <div>
          <h1 className="text-2xl font-bold text-primary">{course.courseName}</h1>
          <p className="mt-1 text-sm text-muted">
            {course.teacher?.account?.fullName} · {formatDate(course.startDate)} - {formatDate(course.endDate)}
          </p>
        </div>
        <div className="text-right">
          {data.classUrl ? (
            <a href={data.classUrl} target="_blank" rel="noopener noreferrer" className={`${linkButton} h-12 bg-primary text-white hover:bg-primary-dark`}>
              Vào học
            </a>
          ) : (
            <span className={`${linkButton} h-12 cursor-not-allowed bg-line text-muted`}>Vào học</span>
          )}
          {!data.classUrl && <p className="mt-1.5 text-xs text-muted">Giáo viên chưa cập nhật link vào học.</p>}
        </div>
      </section>
      <div className="grid items-start gap-4 lg:grid-cols-[1.4fr_1fr]">
        <DashboardPanel title="Lịch học online" empty={false}>
          <SessionList sessions={data.sessions} />
        </DashboardPanel>
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-2 text-base font-semibold text-ink">Tài liệu</h2>
            {data.driveUrl ? (
              <>
                <p className="mb-3 text-sm text-muted">Thư mục tài liệu do giáo viên chia sẻ trên Google Drive.</p>
                <a href={data.driveUrl} target="_blank" rel="noopener noreferrer" className={`${linkButton} h-10 bg-soft text-primary hover:bg-primary/10`}>
                  Mở thư mục tài liệu
                </a>
              </>
            ) : (
              <p className="text-sm text-muted">Giáo viên chưa cập nhật tài liệu.</p>
            )}
          </section>
        </div>
      </div>
      {data.showExams && <LearnExams courseId={course.id} />}
      <CommentSection courseId={course.id} />
    </div>
  );
}
