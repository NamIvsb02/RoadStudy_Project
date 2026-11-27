import { courseApi } from "../api/courseApi";
import { teacherApi } from "../api/teacherApi";
import ScrollProgress from "../components/common/ScrollProgress";
import { useFetch } from "../hooks/useFetch";
import AiAdvisorSection from "./home/AiAdvisorSection";
import ExamCountdown from "./home/ExamCountdown";
import FaqSection from "./home/FaqSection";
import ForYouSection from "./home/ForYouSection";
import HomeCta from "./home/HomeCta";
import HomeHero from "./home/HomeHero";
import LearningJourney from "./home/LearningJourney";
import TeacherShowcase from "./home/TeacherShowcase";

const loadLatestCourse = () => courseApi.getPublicList({ limit: 1 });
const loadTeachers = () => teacherApi.getPublicList({ limit: 8 });

export default function HomePage() {
  const latest = useFetch(loadLatestCourse);
  const teachers = useFetch(loadTeachers);

  return (
    <>
      <ScrollProgress />
      <HomeHero latest={latest} />
      <ExamCountdown />
      <ForYouSection />
      <LearningJourney />
      <AiAdvisorSection />
      <TeacherShowcase teachers={teachers} />
      <FaqSection />
      <HomeCta />
    </>
  );
}
