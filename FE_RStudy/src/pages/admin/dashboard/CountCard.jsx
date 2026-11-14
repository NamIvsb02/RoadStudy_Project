import StatCard from "../../../components/common/StatCard";
import { useFetch } from "../../../hooks/useFetch";

export default function CountCard({ label, request, to, actionLabel }) {
  const { data, loading, error } = useFetch(request);

  return <StatCard label={label} value={data?.pagination.total} loading={loading} error={error} to={to} actionLabel={actionLabel} />;
}
