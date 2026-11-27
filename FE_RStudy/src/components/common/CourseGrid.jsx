import CourseCard from "./CourseCard";
import { COURSE_GRID_CLASS } from "./CourseCardSkeleton";
import RevealGroup from "./RevealGroup";

const ANIMATE_LIMIT = 20;

export default function CourseGrid({ courses, animate = true, animateOnView = false }) {
  if (!animate || courses.length >= ANIMATE_LIMIT) {
    return (
      <div className={COURSE_GRID_CLASS}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    );
  }

  return (
    <RevealGroup
      key={courses.map((course) => course.id).join(",")}
      trigger={animateOnView ? "view" : "mount"}
      className={COURSE_GRID_CLASS}
      itemClassName="h-full"
    >
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </RevealGroup>
  );
}
