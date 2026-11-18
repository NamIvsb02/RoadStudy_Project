import { useState } from "react";
import { adminApi } from "../../api/adminApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import AdminList from "./permissions/AdminList";
import CreateAdminDialog from "./permissions/CreateAdminDialog";
import PermissionEditor from "./permissions/PermissionEditor";

const fetchAdmins = () => adminApi.getAdministrators({ limit: 100 });
const fetchFunctions = () => adminApi.getSystemFunctions();

export default function PermissionsPage() {
  const { account } = useAuth();
  const admins = useFetch(fetchAdmins);
  const functions = useFetch(fetchFunctions);
  const [selectedId, setSelectedId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

  const items = admins.data?.items ?? [];
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const activeFunctions = (functions.data ?? []).filter((item) => item.status === "HOAT_DONG");
  const canToggle = selected && !selected.isLeader && selected.accountId !== account.id;
  const locking = selected?.status !== "BI_KHOA";

  const handleCreated = (created) => {
    setSelectedId(created.id);
    setCreating(false);
    admins.reload();
  };

  const handleToggle = async () => {
    setActing(true);
    setActionError("");
    try {
      await adminApi.setStatus(selected.id, locking ? "BI_KHOA" : "HOAT_DONG");
      admins.reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActing(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>Thêm quản trị viên</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <DashboardPanel title="Quản trị viên" loading={admins.loading} error={admins.error} empty={items.length === 0} emptyText="Chưa có quản trị viên nào.">
          <AdminList items={items} selectedId={selected?.id} onSelect={setSelectedId} />
        </DashboardPanel>
        <DashboardPanel title="Phân quyền" loading={admins.loading || functions.loading} error={functions.error} empty={!selected} emptyText="Chọn một quản trị viên.">
          {selected && (
            <>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{selected.fullName}</p>
                  <p className="text-sm text-muted">{selected.email}</p>
                  <StatusBadge type="AccountStatus" value={selected.status} className="mt-2" />
                </div>
                {canToggle && (
                  <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-soft ${locking ? "border-danger/40 text-danger" : "border-line text-ink"}`}
                  >
                    {locking ? "Khóa admin" : "Mở khóa admin"}
                  </button>
                )}
              </div>
              {actionError && (
                <p role="alert" className="mb-3 rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
                  {actionError}
                </p>
              )}
              <PermissionEditor
                key={`${selected.id}-${selected.permissions
                  .map((item) => item.id)
                  .sort()
                  .join()}`}
                admin={selected}
                functions={activeFunctions}
                onSaved={admins.reload}
              />
            </>
          )}
        </DashboardPanel>
      </div>
      <CreateAdminDialog open={creating} onClose={() => setCreating(false)} onCreated={handleCreated} />
      <ConfirmDialog
        open={confirming}
        title={locking ? "Khóa quản trị viên?" : "Mở khóa quản trị viên?"}
        message={selected ? `${selected.fullName} (${selected.email})` : ""}
        confirmLabel={locking ? "Khóa" : "Mở khóa"}
        danger={locking}
        loading={acting}
        onConfirm={handleToggle}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
