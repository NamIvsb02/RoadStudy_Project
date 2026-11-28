import { useNavigate } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import BackButton from "../../components/common/BackButton";
import { ROUTES } from "../../constants/routes";
import CourseForm from "../../components/common/CourseForm";
import { EMPTY_COURSE } from "../../components/common/courseSchema";

export default function CourseNewPage() {
  const navigate = useNavigate();

  const handleSubmit = async (body) => {
    await courseApi.create(body);
    navigate(ROUTES.TEACHER.COURSES, { replace: true });
  };

  return (
    <div className="flex flex-col gap-4">
      <BackButton fallback={ROUTES.TEACHER.COURSES}>Quay lại danh sách khóa học</BackButton>
      <CourseForm initialValues={EMPTY_COURSE} submitLabel="Tạo khóa học" onSubmit={handleSubmit} onCancel={() => navigate(ROUTES.TEACHER.COURSES)} />
    </div>
  );
}
