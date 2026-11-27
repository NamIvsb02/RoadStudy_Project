import { useCallback, useState } from "react";
import { categoryApi } from "../../api/categoryApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import Button from "../../components/ui/Button";
import Pagination from "../../components/common/Pagination";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import CategoryDialog from "./category/CategoryDialog";
import CategoryTable from "./category/CategoryTable";
import ActionError from "../manage/ActionError";
import StatusTabs from "../manage/StatusTabs";
import SearchField from "../manage/SearchField";

const LIMIT = 10;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.CategoryStatus).map(([value, { label }]) => [value, label])];

export default function AdminCategoriesPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = useCallback(
    () =>
      categoryApi.getAdminList({
        ...(status && { status }),
        ...(search && { q: search }),
        page,
        limit: LIMIT,
      }),
    [status, search, page],
  );
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];
  const isDelete = confirm?.type === "delete";
  const hiding = confirm?.category.status === "HOAT_DONG";

  const handleTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleSave = async (body) => {
    if (dialog.category) await categoryApi.update(dialog.category.id, body);
    else await categoryApi.create(body);
    setDialog(null);
    reload();
  };

  const handleConfirm = async () => {
    const { type, category } = confirm;
    setConfirm(null);
    setBusy(true);
    setActionError("");
    try {
      if (type === "delete") await categoryApi.remove(category.id);
      else await categoryApi.changeStatus(category.id, category.status === "HOAT_DONG" ? "AN" : "HOAT_DONG");
      if (type === "delete" && items.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  let title = "";
  let message = "";
  if (confirm) {
    title = isDelete ? "Xóa danh mục?" : hiding ? "Ẩn danh mục?" : "Hiển thị lại danh mục?";
    message = isDelete
      ? `${confirm.category.categoryName}. Chỉ xóa được khi chưa có khóa học hoặc tài liệu nào.`
      : hiding
        ? `${confirm.category.categoryName}. Các khóa học thuộc danh mục này cũng sẽ không hiển thị công khai.`
        : confirm.category.categoryName;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <StatusTabs tabs={TABS} value={status} onChange={handleTab} />
        <SearchField placeholder="Tìm theo tên danh mục, nhấn Enter" label="Tìm danh mục" onSearch={handleSearch} />
      </div>
      <ActionError message={actionError} />
      <DashboardPanel
        title="Danh mục khóa học"
        actions={<Button onClick={() => setDialog({ category: null })}>Tạo danh mục</Button>}
        skeleton="table"
        flush
        loading={loading}
        error={error}
        empty={items.length === 0}
        emptyText="Chưa có danh mục nào."
      >
        <CategoryTable
          items={items}
          busy={busy}
          onEdit={(category) => setDialog({ category })}
          onToggle={(category) => setConfirm({ type: "toggle", category })}
          onDelete={(category) => setConfirm({ type: "delete", category })}
        />
      </DashboardPanel>
      <Pagination pagination={data?.pagination} onChange={setPage} />
      <CategoryDialog dialog={dialog} onSubmit={handleSave} onClose={() => setDialog(null)} />
      <ConfirmDialog
        open={Boolean(confirm)}
        title={title}
        message={message}
        confirmLabel={isDelete ? "Xóa" : hiding ? "Ẩn" : "Hiển thị"}
        danger={isDelete || hiding}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
