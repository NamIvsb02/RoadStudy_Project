import { useCallback, useState } from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import { submissionApi } from "../../api/submissionApi";
import DashboardPanel from "../../components/common/DashboardPanel";
import ResultBadge from "../../components/common/ResultBadge";
import Pagination from "../../components/ui/Pagination";
import { ROUTES } from "../../constants/routes";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import { formatDateTime } from "../../utils/format";
import { formatScore } from "../exam/examFormat";
import BackButton from "../../components/common/BackButton";

const LIMIT = 10;
const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function ExamSubmissionsPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const request = useCallback(() => submissionApi.listByExam(id, { ...(status && { status }), page, limit: LIMIT }), [id, status, page]);
  const { data, loading, error } = useFetch(request);
  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <BackButton fallback={ROUTES.TEACHER.EXAMS}>Quay lại danh sách đề thi</BackButton>
      <select
        aria-label="Lọc theo trạng thái"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);
        }}
        className="h-10 self-start rounded-lg border border-line bg-white px-3 text-sm text-ink"
      >
        <option value="">Tất cả trạng thái</option>
        {Object.entries(STATUS_MAPS.AttemptStatus).map(([value, { label }]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <DashboardPanel title="Bài làm của học viên" loading={loading} error={error} empty={items.length === 0} emptyText="Chưa có bài làm nào.">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr>
              <th className={th}>Học viên</th>
              <th className={th}>Bắt đầu</th>
              <th className={th}>Điểm</th>
              <th className={th}>Kết quả</th>
              <th className={th} />
            </tr>
          </thead>
          <tbody>
            {items.map((attempt) => (
              <tr key={attempt.id}>
                <td className={td}>
                  <p className="font-medium">{attempt.student.account.fullName}</p>
                  <p className="text-xs text-muted">{attempt.student.account.email}</p>
                </td>
                <td className={td}>{formatDateTime(attempt.startTime)}</td>
                <td className={td}>{formatScore(attempt.score)}</td>
                <td className={td}>
                  <ResultBadge passed={attempt.passed} status={attempt.status} />
                </td>
                <td className={td}>
                  <Link to={generatePath(ROUTES.TEACHER.ATTEMPT, { id: attempt.id })} className="text-xs font-semibold text-primary hover:underline">
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
    </div>
  );
}
