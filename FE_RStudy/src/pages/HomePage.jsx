import { categoryApi } from "../api/categoryApi";
import { courseApi } from "../api/courseApi";
import { teacherApi } from "../api/teacherApi";
import ScrollProgress from "../components/common/ScrollProgress";
import { useFetch } from "../hooks/useFetch";
import AiAdvisorSection from "./home/AiAdvisorSection";
import CategoryBento from "./home/CategoryBento";
import CategoryCourseSection from "./home/CategoryCourseSection";
import ForYouSection from "./home/ForYouSection";
import HomeCta from "./home/HomeCta";
import HomeHero from "./home/HomeHero";
import HomeStats from "./home/HomeStats";
import LearningJourney from "./home/LearningJourney";
import TeacherShowcase from "./home/TeacherShowcase";

const FEATURED_CATEGORIES = 3;
const loadLatestCourse = () => courseApi.getPublicList({ limit: 1 });
const loadCategories = () => categoryApi.getPublicList({ limit: 100 });
const loadTeachers = () => teacherApi.getPublicList({ limit: 8 });

export default function HomePage() {
  const latest = useFetch(loadLatestCourse);
  const categories = useFetch(loadCategories);
  const teachers = useFetch(loadTeachers);

  const featured = (categories.data?.items ?? []).filter((category) => category.courseCount > 0).slice(0, FEATURED_CATEGORIES);

  return (
    <>
      <ScrollProgress />
      <HomeHero latest={latest} />
      <HomeStats courses={latest} teachers={teachers} categories={categories} />
      <CategoryBento categories={categories} />
      <ForYouSection />
      <LearningJourney />
      <AiAdvisorSection />
      {featured.map((category, index) => (
        <CategoryCourseSection key={category.id} category={category} reversed={index % 2 === 1} />
      ))}
      <TeacherShowcase teachers={teachers} />
      <HomeCta />
    </>
  );
}
