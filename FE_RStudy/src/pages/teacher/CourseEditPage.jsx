import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import BackButton from "../../components/common/BackButton";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import CourseForm from "./course/CourseForm";
import { EDITABLE_STATUSES, toFormValues } from "./course/courseSchema";

export default function CourseEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useCallback(() => courseApi.getMyById(id), [id]);
  const { data, loading, error } = useFetch(request);

  const handleSubmit = async (body) => {
    await courseApi.update(id, body);
    navigate(ROUTES.TEACHER.COURSES, { replace: true });
  };

  let content;
  if (loading) content = <LoadingState />;
  else if (error) content = <FormAlert message={error} />;
  else if (!EDITABLE_STATUSES.includes(data.status)) content = <FormAlert message="Khóa học đang chờ duyệt hoặc đã kết thúc nên không thể sửa." />;
  else content = <CourseForm key={data.id} initialValues={toFormValues(data)} submitLabel="Lưu thay đổi" onSubmit={handleSubmit} onCancel={() => navigate(ROUTES.TEACHER.COURSES)} />;

  return (
    <div className="flex flex-col gap-4">
      <BackButton fallback={ROUTES.TEACHER.COURSES}>Quay lại danh sách khóa học</BackButton>
      {content}
    </div>
  );
}
