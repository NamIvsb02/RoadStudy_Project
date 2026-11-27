import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import ErrorState from '../components/common/ErrorState';
import PageSkeleton from '../components/common/PageSkeleton';
import Reveal from '../components/common/Reveal';
import ScrollProgress from '../components/common/ScrollProgress';
import { useFetch } from '../hooks/useFetch';
import CommentSection from './courseDetail/CommentSection';
import CourseEnrollBox from './courseDetail/CourseEnrollBox';
import CourseHero from './courseDetail/CourseHero';
import ReviewSection from './courseDetail/ReviewSection';

export default function CourseDetailPage() {
  const { id } = useParams();
  const request = useCallback(() => courseApi.getPublicById(id), [id]);
  const { data: course, loading, error, reload } = useFetch(request);

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <ScrollProgress />
      <CourseHero course={course} />
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:order-last lg:w-80 lg:self-start">
          <CourseEnrollBox course={course} />
        </aside>
        <div className="min-w-0 flex-1 space-y-6">
          <Reveal as="section" className="rounded-xl border border-line bg-white p-5 shadow-card">
            <h2 className="mb-3 text-lg font-bold text-ink-strong">Giới thiệu khóa học</h2>
            <p className="whitespace-pre-line text-ink">{course.description}</p>
          </Reveal>
          <Reveal viewport={{ once: true, amount: "some" }}>
            <ReviewSection courseId={course.id} teacherId={course.teacher.id} />
          </Reveal>
          <Reveal viewport={{ once: true, amount: "some" }}>
            <CommentSection courseId={course.id} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
