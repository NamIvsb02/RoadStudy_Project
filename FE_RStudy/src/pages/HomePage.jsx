import { teacherApi } from '../api/teacherApi';
import { categoryApi } from '../api/categoryApi';
import PageColumns from '../components/common/PageColumns';
import SectionHeader from '../components/common/SectionHeader';
import TeacherAvatarList from '../components/common/TeacherAvatarList';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import { useFetch } from '../hooks/useFetch';
import CategoryCourseSection from './home/CategoryCourseSection';
import CategorySidebar from './home/CategorySidebar';
import HomeBanner from './home/HomeBanner';

const FEATURED_CATEGORIES = 3;
const loadCategories = () => categoryApi.getPublicList({ limit: 100 });
const loadTeachers = () => teacherApi.getPublicList({ limit: 8 });

export default function HomePage() {
  const categories = useFetch(loadCategories);
  const teachers = useFetch(loadTeachers);

  const categoryItems = categories.data?.items ?? [];
  const featured = categoryItems.filter((c) => c.courseCount > 0).slice(0, FEATURED_CATEGORIES);

  let sidebar;
  if (categories.loading) sidebar = <LoadingState />;
  else if (categories.error) sidebar = <ErrorState message={categories.error} onRetry={categories.reload} />;
  else sidebar = <CategorySidebar categories={categoryItems} />;

  let teacherContent;
  if (teachers.loading) teacherContent = <LoadingState />;
  else if (teachers.error) teacherContent = <ErrorState message={teachers.error} onRetry={teachers.reload} />;
  else if (teachers.data.items.length === 0) teacherContent = <EmptyState message="Chưa có giáo viên" />;
  else teacherContent = <TeacherAvatarList teachers={teachers.data.items} />;

  return (
    <PageColumns left={sidebar}>
      <HomeBanner />
      <section className="mt-8">
        <SectionHeader title="Giáo viên tiêu biểu" />
        {teacherContent}
      </section>
      {featured.map((category) => (
        <CategoryCourseSection key={category.id} category={category} />
      ))}
    </PageColumns>
  );
}