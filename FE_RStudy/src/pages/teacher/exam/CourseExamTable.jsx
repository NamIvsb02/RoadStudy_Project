import { useCallback, useState } from "react";
import { examApi } from "../../../api/examApi";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DashboardPanel from "../../../components/common/DashboardPanel";
import StatusBadge from "../../../components/ui/StatusBadge";
import { useFetch } from "../../../hooks/useFetch";
import { formatScore } from "../../exam/examFormat";
import ExamActions from "./ExamActions";
import ShowAnswersSwitch from "./ShowAnswersSwitch";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function CourseExamTable({ courseId }) {
  const request = useCallback(() => examApi.listByCourse(courseId, { limit: 50 }), [courseId]);
  const { data, loading, error, reload } = useFetch(request);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState(null);
  const [actionError, setActionError] = useState("");
  const items = data?.items ?? [];

  const run = async (work) => {
    setBusy(true);
    setActionError("");
    try {
      await work();
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    const exam = target;
    setTarget(null);
    await run(() => examApi.remove(exam.id));
  };

  return (
    <>
      {actionError && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {actionError}
        </p>
      )}
      <DashboardPanel title="Đề thi của khóa học" loading={loading} error={error} empty={items.length === 0} emptyText="Khóa học này chưa có đề thi nào.">
        <table className="w-full min-w-[880px]">
          <thead>
            <tr>
              <th className={th}>Đề thi</th>
              <th className={th}>Số câu</th>
              <th className={th}>Thời gian</th>
              <th className={th}>Điểm đạt</th>
              <th className={th}>Lượt tối đa</th>
              <th className={th}>Hiện đáp án</th>
              <th className={th}>Lượt làm</th>
              <th className={th}>Trạng thái</th>
              <th className={th} />
            </tr>
          </thead>
          <tbody>
            {items.map((exam) => (
              <tr key={exam.id}>
                <td className={td}>{exam.examName}</td>
                <td className={td}>{exam.questionCount}</td>
                <td className={td}>{exam.durationMinutes} phút</td>
                <td className={td}>{formatScore(exam.passingScore)}</td>
                <td className={td}>{exam.maxAttempts}</td>
                <td className={td}>
                  <ShowAnswersSwitch exam={exam} busy={busy} onToggle={(item) => run(() => examApi.update(item.id, { showAnswers: !item.showAnswers }))} />
                </td>
                <td className={td}>{exam.attemptCount}</td>
                <td className={td}>
                  <StatusBadge type="ExamStatus" value={exam.status} />
                </td>
                <td className={td}>
                  <ExamActions exam={exam} busy={busy} onChangeStatus={(item, status) => run(() => examApi.changeStatus(item.id, status))} onDelete={setTarget} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
      <ConfirmDialog
        open={Boolean(target)}
        title="Xóa đề thi?"
        message={target ? `${target.examName}. Chỉ xóa được khi chưa có bài làm.` : ""}
        confirmLabel="Xóa"
        danger
        onConfirm={handleDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
