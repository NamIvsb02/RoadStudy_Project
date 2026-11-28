import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import BackButton from "../../components/common/BackButton";
import ListSkeleton from "../../components/common/ListSkeleton";
import FormAlert from "../../components/ui/FormAlert";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import CourseForm from "../../components/common/CourseForm";
import { toFormValues } from "../../components/common/courseSchema";
import { canAdminEdit } from "./course/courseActions";

export default function AdminCourseEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useCallback(() => courseApi.getAdminById(id), [id]);
  const { data, loading, error } = useFetch(request);
  const backToList = () => navigate(ROUTES.ADMIN.COURSES);

  const handleSubmit = async (body) => {
    await courseApi.update(id, body);
    navigate(ROUTES.ADMIN.COURSES, { replace: true });
  };

  let content;
  if (loading) content = <ListSkeleton />;
  else if (error) content = <FormAlert message={error} />;
  else if (!canAdminEdit(data)) content = <FormAlert message="Khóa học đã kết thúc nên không thể sửa." />;
  else {
    content = (
      <>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>
            Giáo viên phụ trách: <span className="font-medium text-ink">{data.teacher?.account?.fullName ?? "–"}</span>
          </span>
          <StatusBadge type="CourseStatus" value={data.status} />
        </div>
        <p className="text-sm text-muted">Giáo viên phụ trách sẽ nhận thông báo khi bạn lưu thay đổi.</p>
        <CourseForm key={data.id} initialValues={toFormValues(data)} submitLabel="Lưu thay đổi" onSubmit={handleSubmit} onCancel={backToList} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BackButton fallback={ROUTES.ADMIN.COURSES}>Quay lại danh sách khóa học</BackButton>
      {content}
    </div>
  );
}
