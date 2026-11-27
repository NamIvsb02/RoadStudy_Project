import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { recommendationApi } from "../../api/recommendationApi";
import CourseCard from "../../components/common/CourseCard";
import Reveal from "../../components/common/Reveal";
import SectionHeader from "../../components/common/SectionHeader";
import { fadeUp, STAGGER, staggerOf, VIEWPORT } from "../../constants/motion";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { CONTAINER } from "./homeLayout";

export default function ForYouSection() {
  const { account } = useAuth();
  const enabled = account?.role === ROLES.STUDENT;
  const { data } = useQuery({
    queryKey: ["recommendation", account?.id],
    queryFn: async () => (await recommendationApi.getMine()).data.items,
    enabled,
    staleTime: 60000,
  });

  if (!enabled || !data || data.length === 0) return null;

  return (
    <section aria-label="Dành cho bạn" className="bg-white py-12 lg:py-16">
      <Reveal variant="revealRight" className={CONTAINER}>
        <SectionHeader eyebrow="Gợi ý" title="Dành cho bạn" description="Các khóa học đang mở phù hợp với bạn." />
        <motion.ul
          variants={staggerOf(STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0"
        >
          {data.map(({ course, reason }) => (
            <motion.li key={course.id} variants={fadeUp} className="flex w-72 shrink-0 snap-start flex-col lg:w-auto">
              <CourseCard course={course} />
              <p className="mt-2 px-1 text-xs text-muted">{reason}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Reveal>
    </section>
  );
}
