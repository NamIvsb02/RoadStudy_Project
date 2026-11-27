import { useCallback, useState } from "react";
import { resourceApi } from "../../api/resourceApi";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/common/Pagination";
import { useFetch } from "../../hooks/useFetch";
import ResourceCard from "./ResourceCard";
import { useCategories } from "./useCategories";

const LIMIT = 12;
const fieldClass = "h-11 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30";

export default function ResourceBrowser({ reloadKey = 0, canDelete, onDelete }) {
  const categories = useCategories();
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({ q: "", categoryId: "" });
  const [page, setPage] = useState(1);

  const request = useCallback(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    return resourceApi.getList({ ...params, page, limit: LIMIT });
  }, [filters, page, reloadKey]);
  const { data, loading, error } = useFetch(request);
  const items = data?.items ?? [];

  const handleSearch = (event) => {
    event.preventDefault();
    setFilters((prev) => ({ ...prev, q: keyword.trim() }));
    setPage(1);
  };

  const handleCategory = (categoryId) => {
    setFilters((prev) => ({ ...prev, categoryId }));
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <form role="search" onSubmit={handleSearch} className="flex flex-col gap-2 rounded-xl border border-line bg-white p-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm tài liệu, nhấn Enter"
          aria-label="Tìm tài liệu"
          className={`${fieldClass} w-full sm:max-w-md sm:flex-1`}
        />
        <select
          value={filters.categoryId}
          onChange={(event) => handleCategory(event.target.value)}
          aria-label="Lọc theo danh mục"
          className={`${fieldClass} w-full sm:w-56`}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </form>
      <DashboardPanel title="Danh sách tài liệu" loading={loading} error={error} empty={items.length === 0} emptyText="Chưa có tài liệu nào.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} canDelete={canDelete?.(resource)} onDelete={onDelete} />
          ))}
        </div>
      </DashboardPanel>
      <Pagination pagination={data?.pagination} onChange={setPage} />
    </div>
  );
}
