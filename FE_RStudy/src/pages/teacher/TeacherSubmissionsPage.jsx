import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import { submissionApi } from "../../api/submissionApi";
import CourseSelect from "../../components/common/CourseSelect";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/ui/Pagination";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import SubmissionTable from "./submission/SubmissionTable";

const LIMIT = 10;
const fetchMyCourses = () => courseApi.getMine({ limit: 100 });

export default function TeacherSubmissionsPage() {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const courses = useFetch(fetchMyCourses);
  const list = useMemo(() => courses.data?.items ?? [], [courses.data]);
  const courseId = list.some((course) => course.id === params.get("courseId")) ? params.get("courseId") : "";

  const request = useCallback(() => submissionApi.listManage({ ...(courseId && { courseId }), ...(status && { status }), page, limit: LIMIT }), [courseId, status, page]);
  const { data, loading, error } = useFetch(request);
  const items = data?.items ?? [];

  const handleCourse = (value) => {
    setParams(value ? { courseId: value } : {}, { replace: true });
    setPage(1);
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <CourseSelect courses={list} value={courseId} onChange={handleCourse} />
        <select aria-label="Lọc theo trạng thái" value={status} onChange={handleStatus} className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink">
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_MAPS.AttemptStatus).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <DashboardPanel title="Bài làm của học viên" loading={loading} error={error} empty={items.length === 0} emptyText="Chưa có bài làm nào.">
        <SubmissionTable items={items} showCourse={!courseId} />
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
    </div>
  );
}
