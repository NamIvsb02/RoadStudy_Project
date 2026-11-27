import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { learningApi } from "../../api/learningApi";
import BackButton from "../../components/common/BackButton";
import FormAlert from "../../components/ui/FormAlert";
import ListSkeleton from "../../components/common/ListSkeleton";
import Switch from "../../components/ui/Switch";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import LinksForm from "./learning/LinksForm";
import SessionManager from "./learning/SessionManager";

export default function CourseLearningPage() {
  const { id } = useParams();
  const request = useCallback(() => learningApi.get(id), [id]);
  const { data, loading, error, reload } = useFetch(request);
  const [busy, setBusy] = useState(false);
  const [switchError, setSwitchError] = useState("");

  const handleShowExams = async (value) => {
    setBusy(true);
    setSwitchError("");
    try {
      await learningApi.update(id, { showExams: value });
      reload();
    } catch (err) {
      setSwitchError(err.message);
    } finally {
      setBusy(false);
    }
  };

  let content;
  if (loading) content = <ListSkeleton />;
  else if (error) content = <FormAlert message={error} />;
  else {
    content = (
      <div className="grid items-start gap-4 lg:grid-cols-[1fr_1.5fr]">
        <div className="flex flex-col gap-4">
          <LinksForm key={`${data.classUrl}|${data.driveUrl}`} courseId={id} initial={data} onSaved={reload} />
          <section className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-ink">Hiển thị cho học viên</h2>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">Mục Bài thi</p>
                <p className="text-xs text-muted">Bật thì học viên thấy các đề đang mở của khóa này trong lớp học</p>
              </div>
              <Switch checked={data.showExams} disabled={busy} label="Hiện mục Bài thi cho học viên" onChange={handleShowExams} />
            </div>
            <FormAlert message={switchError} />
          </section>
        </div>
        <SessionManager courseId={id} sessions={data.sessions} onChanged={reload} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BackButton fallback={ROUTES.TEACHER.COURSES}>Quay lại danh sách khóa học</BackButton>
      {data && <h1 className="text-xl font-semibold text-ink">{data.course.courseName}: Lớp học</h1>}
      {content}
    </div>
  );
}
