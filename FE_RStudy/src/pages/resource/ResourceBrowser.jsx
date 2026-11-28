import { useCallback, useState } from "react";
import { Search } from "lucide-react";
import { resourceApi } from "../../api/resourceApi";
import DashboardPanel from "../../components/common/DashboardPanel";
import FilterPanel from "../../components/common/FilterPanel";
import FilterRadioList from "../../components/common/FilterRadioList";
import FilterSection from "../../components/common/FilterSection";
import PageColumns from "../../components/common/PageColumns";
import Pagination from "../../components/common/Pagination";
import { useCategories } from "../../hooks/useCategories";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useFetch } from "../../hooks/useFetch";
import ResourceCard from "./ResourceCard";

const LIMIT = 12;
const inputClass =
  "h-11 w-full rounded-lg border border-line bg-white pr-3 pl-9 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted hover:border-line-strong focus:border-primary focus:ring-2 focus:ring-primary-light/40";

export default function ResourceBrowser({ header, reloadKey = 0, canDelete, onDelete }) {
  const categories = useCategories();
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(keyword.trim(), 400);

  // Đổi từ khóa hoặc danh mục thì về trang 1 (đặt lại ngay trong render khi giá trị lọc thay đổi)
  const [lastFilter, setLastFilter] = useState(`${q}|${categoryId}`);
  if (lastFilter !== `${q}|${categoryId}`) {
    setLastFilter(`${q}|${categoryId}`);
    setPage(1);
  }

  const request = useCallback(() => {
    const params = Object.fromEntries(Object.entries({ q, categoryId }).filter(([, value]) => value));
    return resourceApi.getList({ ...params, page, limit: LIMIT });
    // reloadKey: trang cha tăng giá trị này để tải lại sau khi thêm hoặc xóa tài liệu
  }, [q, categoryId, page, reloadKey]);
  const { data, loading, error } = useFetch(request);
  const items = data?.items ?? [];

  const reset = () => {
    setKeyword("");
    setCategoryId("");
  };

  const categoryOptions = [{ value: "", label: "Tất cả" }, ...categories.map((c) => ({ value: c.id, label: c.categoryName }))];

  return (
    <PageColumns
      left={
        <FilterPanel onReset={reset} canReset={Boolean(keyword || categoryId)}>
          <FilterSection title="Tìm kiếm">
            <div className="relative">
              <Search size={16} aria-hidden="true" className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
              <input type="search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tên tài liệu" aria-label="Tìm tài liệu" className={inputClass} />
            </div>
          </FilterSection>
          <FilterSection title="Danh mục">
            <FilterRadioList name="resource-category" options={categoryOptions} value={categoryId} onChange={setCategoryId} scroll />
          </FilterSection>
        </FilterPanel>
      }
    >
      <div className="flex flex-col gap-4">
        {header}
        <DashboardPanel title="Danh sách tài liệu" loading={loading} error={error} empty={items.length === 0} emptyText="Chưa có tài liệu nào.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} canDelete={canDelete?.(resource)} onDelete={onDelete} />
            ))}
          </div>
        </DashboardPanel>
        <Pagination pagination={data?.pagination} onChange={setPage} />
      </div>
    </PageColumns>
  );
}
