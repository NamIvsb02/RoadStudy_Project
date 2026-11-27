import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { courseApi } from "../api/courseApi";
import { teacherApi } from "../api/teacherApi";
import CourseCardSkeleton from "../components/common/CourseCardSkeleton";
import CourseGrid from "../components/common/CourseGrid";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import PageSkeleton from "../components/common/PageSkeleton";
import SectionHeader from "../components/common/SectionHeader";
import { useFetch } from "../hooks/useFetch";
import TeacherProfileHeader from "./teacherProfile/TeacherProfileHeader";

const COURSE_LIMIT = 6;

export default function TeacherProfilePage() {
  const { id } = useParams();
  const request = useCallback(() => teacherApi.getPublicById(id), [id]);
  const coursesRequest = useCallback(() => courseApi.getPublicList({ teacherId: id, limit: COURSE_LIMIT }), [id]);
  const { data: teacher, loading, error, reload } = useFetch(request);
  const courses = useFetch(coursesRequest);

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  let courseContent;
  if (courses.loading) courseContent = <CourseCardSkeleton count={3} />;
  else if (courses.error) courseContent = <ErrorState message={courses.error} onRetry={courses.reload} />;
  else if (courses.data.items.length === 0) courseContent = <EmptyState title="Giáo viên chưa có khóa học nào" />;
  else courseContent = <CourseGrid courses={courses.data.items} animateOnView />;

  return (
    <div className="space-y-8">
      <TeacherProfileHeader teacher={teacher} />
      <section>
        <SectionHeader title="Khóa học của giáo viên" />
        {courseContent}
      </section>
    </div>
  );
}
