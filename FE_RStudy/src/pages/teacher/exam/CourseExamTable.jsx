import { useCallback, useState } from "react";
import { examApi } from "../../../api/examApi";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DashboardPanel from "../../../components/common/DashboardPanel";
import StatusBadge from "../../../components/ui/StatusBadge";
import { useFetch } from "../../../hooks/useFetch";
import { formatScore } from "../../exam/examFormat";
import ActionError from "../../manage/ActionError";
import ExamActions from "./ExamActions";
import ExamPreviewDialog from "./ExamPreviewDialog";
import ShowAnswersSwitch from "./ShowAnswersSwitch";
import { TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../../manage/tableStyles";

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export default function CourseExamTable({ courses, isAdmin = false }) {
  const request = useCallback(async () => {
    const results = await Promise.all(courses.map((course) => examApi.listByCourse(course.id, { limit: 50 })));
    const items = results.flatMap((res, index) =>
      res.data.items.map((exam) => ({
        ...exam,
        courseName: courses[index].courseName,
      })),
    );
    return { data: { items: items.sort(byNewest) } };
  }, [courses]);
  const { data, loading, error, reload } = useFetch(request);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState(null);
  const [preview, setPreview] = useState(null);
  const [actionError, setActionError] = useState("");
  const items = data?.items ?? [];
  const showCourse = courses.length > 1;

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
      <ActionError message={actionError} />
      <DashboardPanel title="Đề thi" skeleton="table" flush loading={loading} error={error} empty={items.length === 0} emptyText="Chưa có đề thi nào.">
        <table className={`${TABLE} min-w-[900px]`}>
          <thead>
            <tr>
              <th className={TH}>Đề thi</th>
              {showCourse && <th className={TH}>Khóa học</th>}
              <th className={TH}>Số câu</th>
              <th className={TH}>Thời gian</th>
              <th className={TH}>Điểm đạt</th>
              <th className={TH}>Lượt tối đa</th>
              <th className={TH}>Hiện đáp án</th>
              <th className={TH}>Lượt làm</th>
              <th className={TH}>Trạng thái</th>
              <th className={TH} />
            </tr>
          </thead>
          <tbody className={TBODY}>
            {items.map((exam) => (
              <tr key={exam.id} className={TR}>
                <td className={TD}>{exam.examName}</td>
                {showCourse && <td className={TD}>{exam.courseName}</td>}
                <td className={TD}>{exam.questionCount}</td>
                <td className={TD}>{exam.durationMinutes} phút</td>
                <td className={TD}>{formatScore(exam.passingScore)}</td>
                <td className={TD}>{exam.maxAttempts}</td>
                <td className={TD}>
                  <ShowAnswersSwitch
                    exam={exam}
                    busy={busy}
                    onToggle={(item) =>
                      run(() =>
                        examApi.update(item.id, {
                          showAnswers: !item.showAnswers,
                        }),
                      )
                    }
                  />
                </td>
                <td className={TD}>{exam.attemptCount}</td>
                <td className={TD}>
                  <StatusBadge type="ExamStatus" value={exam.status} />
                </td>
                <td className={TD_ACTION}>
                  <ExamActions
                    exam={exam}
                    busy={busy}
                    isAdmin={isAdmin}
                    onPreview={setPreview}
                    onChangeStatus={(item, status) => run(() => examApi.changeStatus(item.id, status))}
                    onDelete={setTarget}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
      <ExamPreviewDialog exam={preview} onClose={() => setPreview(null)} />
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
