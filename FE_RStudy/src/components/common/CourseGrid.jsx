import { motion } from 'framer-motion';
import { slideUp, stagger } from '../../constants/motion';
import CourseCard from './CourseCard';

const ANIMATE_LIMIT = 20;
const GRID = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';

export default function CourseGrid({ courses }) {
  if (courses.length >= ANIMATE_LIMIT) {
    return (
      <div className={GRID}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      key={courses.map((course) => course.id).join(',')}
      variants={stagger}
      initial="hidden"
      animate="visible"
      className={GRID}
    >
      {courses.map((course) => (
        <motion.div key={course.id} variants={slideUp}>
          <CourseCard course={course} />
        </motion.div>
      ))}
    </motion.div>
  );
}