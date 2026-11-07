import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { teacherApi } from "../api/teacherApi";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { useFetch } from "../hooks/useFetch";
import TeacherProfileHeader from "./teacherProfile/TeacherProfileHeader";

export default function TeacherProfilePage() {
  const { id } = useParams();
  const request = useCallback(() => teacherApi.getPublicById(id), [id]);
  const { data: teacher, loading, error, reload } = useFetch(request);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <TeacherProfileHeader teacher={teacher} />
    </div>
  );
}
