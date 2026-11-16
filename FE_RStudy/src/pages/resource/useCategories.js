import { categoryApi } from "../../api/categoryApi";
import { useFetch } from "../../hooks/useFetch";

const fetchCategories = () => categoryApi.getPublicList({ limit: 100 });

export function useCategories() {
  const { data } = useFetch(fetchCategories);
  return data?.items ?? [];
}
