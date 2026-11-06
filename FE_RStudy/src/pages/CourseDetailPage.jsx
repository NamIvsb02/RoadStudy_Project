import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import PageColumns from '../components/common/PageColumns';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import { useFetch } from '../hooks/useFetch';
import CommentSection from './courseDetail/CommentSection';
import CourseEnrollBox from './courseDetail/CourseEnrollBox';
import CourseHero from './courseDetail/CourseHero';
import ReviewSection from './courseDetail/ReviewSection';

export default function CourseDetailPage() {
  const { id } = useParams();
  const request = useCallback(() => courseApi.getPublicById(id), [id]);
  const { data: course, loading, error, reload } = useFetch(request);

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <PageColumns>
        <ErrorState message={error} onRetry={reload} />
      </PageColumns>
    );
  }

  return (
    <PageColumns right={<CourseEnrollBox course={course} />}>
      <CourseHero course={course} />
      <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-slate-800">Giới thiệu khóa học</h2>
        <p className="whitespace-pre-line text-slate-700">{course.description}</p>
      </section>
      <ReviewSection courseId={course.id} teacherId={course.teacher.id} />
      <CommentSection courseId={course.id} />
    </PageColumns>
  );
}