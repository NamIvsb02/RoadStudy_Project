import { useCallback, useState } from "react";
import { accountApi } from "../../api/accountApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/ui/Pagination";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { isLeader } from "../../utils/permission";
import AccountsFilterBar from "./accounts/AccountsFilterBar";
import AccountsTable from "./accounts/AccountsTable";

const LIMIT = 10;
const TOGGLEABLE = ["HOAT_DONG", "BI_KHOA"];
const toParams = (filters) => Object.fromEntries(Object.entries(filters).filter(([, value]) => value));

export default function AccountsPage() {
  const { account } = useAuth();
  const [filters, setFilters] = useState({ role: "", status: "", search: "" });
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = useCallback(() => accountApi.getList({ ...toParams(filters), page, limit: LIMIT }), [filters, page]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];
  const locking = target?.status !== "BI_KHOA";

  const handleFilter = (next) => {
    setFilters(next);
    setPage(1);
  };

  const canToggle = (item) => item.id !== account.id && TOGGLEABLE.includes(item.status) && (item.role !== ROLES.ADMINISTRATOR || isLeader(account));

  const handleConfirm = async () => {
    setActing(true);
    setActionError("");
    try {
      await accountApi.changeStatus(target.id, locking ? "BI_KHOA" : "HOAT_DONG");
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActing(false);
      setTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <AccountsFilterBar filters={filters} onChange={handleFilter} />
      {actionError && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {actionError}
        </p>
      )}
      <DashboardPanel title="Danh sách tài khoản" loading={loading} error={error} empty={items.length === 0} emptyText="Không có tài khoản nào phù hợp.">
        <AccountsTable items={items} canToggle={canToggle} onToggle={setTarget} />
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
      <ConfirmDialog
        open={Boolean(target)}
        title={locking ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
        message={target ? `${target.fullName} (${target.email})` : ""}
        confirmLabel={locking ? "Khóa" : "Mở khóa"}
        danger={locking}
        loading={acting}
        onConfirm={handleConfirm}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
