import { useCallback, useState } from "react";
import { teacherApi } from "../../../api/teacherApi";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DashboardPanel from "../../../components/common/DashboardPanel";
import Pagination from "../../../components/ui/Pagination";
import { STATUS_MAPS } from "../../../constants/statuses";
import { useFetch } from "../../../hooks/useFetch";
import TeacherApprovalCard from "./TeacherApprovalCard";

const LIMIT = 10;
const TABS = ["CHO_DUYET", "DA_DUYET", "TU_CHOI"];

export default function TeacherApprovalPage() {
  const [tab, setTab] = useState("CHO_DUYET");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(null);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = useCallback(() => teacherApi.getAdminList({ approvalStatus: tab, page, limit: LIMIT }), [tab, page]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];
  const approving = action?.approvalStatus === "DA_DUYET";

  const handleTab = (value) => {
    setTab(value);
    setPage(1);
  };

  const handleConfirm = async () => {
    setActing(true);
    setActionError("");
    try {
      await teacherApi.setApproval(action.teacher.id, action.approvalStatus);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActing(false);
      setAction(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="flex gap-2">
        {TABS.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => handleTab(value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === value ? "bg-primary text-white" : "bg-white text-ink hover:bg-soft"}`}
          >
            {STATUS_MAPS.ApprovalStatus[value].label}
          </button>
        ))}
      </div>
      {actionError && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {actionError}
        </p>
      )}
      <DashboardPanel title="Hồ sơ giáo viên" loading={loading} error={error} empty={items.length === 0} emptyText="Không có hồ sơ nào trong mục này.">
        <div className="flex flex-col gap-3">
          {items.map((teacher) => (
            <TeacherApprovalCard
              key={teacher.id}
              teacher={teacher}
              onApprove={() => setAction({ teacher, approvalStatus: "DA_DUYET" })}
              onReject={() => setAction({ teacher, approvalStatus: "TU_CHOI" })}
            />
          ))}
        </div>
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
      <ConfirmDialog
        open={Boolean(action)}
        title={approving ? "Duyệt giáo viên?" : "Từ chối giáo viên?"}
        message={action ? `${action.teacher.account.fullName} (${action.teacher.account.email})` : ""}
        confirmLabel={approving ? "Duyệt" : "Từ chối"}
        danger={!approving}
        loading={acting}
        onConfirm={handleConfirm}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
