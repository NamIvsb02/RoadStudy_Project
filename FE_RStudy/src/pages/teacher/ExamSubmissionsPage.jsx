import { useCallback, useState } from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import { submissionApi } from "../../api/submissionApi";
import DashboardPanel from "../../components/common/DashboardPanel";
import ResultBadge from "../../components/common/ResultBadge";
import Pagination from "../../components/common/Pagination";
import { ROUTES } from "../../constants/routes";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import { formatDateTime } from "../../utils/format";
import { formatScore } from "../exam/examFormat";
import BackButton from "../../components/common/BackButton";
import { ACTION_LINK, TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../manage/tableStyles";

const LIMIT = 10;

export default function ExamSubmissionsPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const request = useCallback(
    () =>
      submissionApi.listByExam(id, {
        ...(status && { status }),
        page,
        limit: LIMIT,
      }),
    [id, status, page],
  );
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
        className="h-11 self-start rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        <option value="">Tất cả trạng thái</option>
        {Object.entries(STATUS_MAPS.AttemptStatus).map(([value, { label }]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <DashboardPanel title="Bài làm của học viên" skeleton="table" flush loading={loading} error={error} empty={items.length === 0} emptyText="Chưa có bài làm nào.">
        <table className={`${TABLE} min-w-[640px]`}>
          <thead>
            <tr>
              <th className={TH}>Học viên</th>
              <th className={TH}>Bắt đầu</th>
              <th className={TH}>Điểm</th>
              <th className={TH}>Kết quả</th>
              <th className={TH} />
            </tr>
          </thead>
          <tbody className={TBODY}>
            {items.map((attempt) => (
              <tr key={attempt.id} className={TR}>
                <td className={TD}>
                  <p className="font-medium">{attempt.student.account.fullName}</p>
                  <p className="text-xs text-muted">{attempt.student.account.email}</p>
                </td>
                <td className={TD}>{formatDateTime(attempt.startTime)}</td>
                <td className={TD}>{formatScore(attempt.score)}</td>
                <td className={TD}>
                  <ResultBadge passed={attempt.passed} status={attempt.status} />
                </td>
                <td className={TD_ACTION}>
                  <Link
                    to={generatePath(ROUTES.TEACHER.ATTEMPT, {
                      id: attempt.id,
                    })}
                    className={ACTION_LINK}
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
      <Pagination pagination={data?.pagination} onChange={setPage} />
    </div>
  );
}
