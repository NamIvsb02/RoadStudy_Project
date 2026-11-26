import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { generatePath, Link } from "react-router-dom";
import heroImage from "../../assets/images/map-book-1736140098369.jpg";
import RoadPath from "../../components/common/RoadPath";
import SearchBox from "../../components/common/SearchBox";
import Skeleton from "../../components/ui/Skeleton";
import { fadeUp, heroLine, imageReveal, scaleReveal, STAGGER, staggerOf } from "../../constants/motion";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { formatVND } from "../../utils/format";
import { CONTAINER, LINK_PRIMARY, LINK_SECONDARY } from "./homeLayout";

const TITLE_LINES = ["Tìm đúng khóa học,", "bắt đầu hành trình", "học tập của bạn"];
const floatCard = "rounded-xl border border-line bg-white p-4 shadow-raised";

function LatestCourseCard({ latest }) {
  if (latest.loading) {
    return (
      <div role="status" className={`${floatCard} space-y-2`}>
        <span className="sr-only">Đang tải</span>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }
  const course = latest.data?.items?.[0];
  if (!course) return null;
  return (
    <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: course.id })} className={`${floatCard} block transition-colors duration-150 hover:border-primary-200`}>
      <p className="text-xs font-semibold tracking-wider text-accent-strong uppercase">Khóa học mới nhất</p>
      <p className="mt-1 line-clamp-2 font-semibold text-ink-strong">{course.courseName}</p>
      <p className="mt-1 text-sm font-bold text-primary">{formatVND(course.price)}</p>
    </Link>
  );
}

export default function HomeHero({ latest }) {
  const { account, loading: authLoading } = useAuth();
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  const parallax = isDesktop && !reduceMotion ? { y: cardY } : undefined;
  const isStudent = account?.role === ROLES.STUDENT;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="absolute inset-0 bg-glow" />
      <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <RoadPath variant="hero" className="absolute inset-x-0 bottom-0 h-40 w-full text-primary-200" />
      <div className={`${CONTAINER} relative grid items-center gap-10 py-12 lg:grid-cols-12 lg:py-20`}>
        <motion.div variants={staggerOf(STAGGER.loose)} initial="hidden" animate="visible" className="lg:col-span-7">
          <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold tracking-wider text-primary uppercase">
            Nền tảng học trực tuyến đa cấp học
          </motion.p>
          <h1 className="text-display font-bold text-ink-strong">
            {TITLE_LINES.map((line) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span variants={heroLine} className="block">
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base text-muted">
            Tìm khóa học đang mở, đăng ký và thanh toán chuyển khoản, vào lớp học trực tuyến và làm bài thi ngay trên RoadStudy.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-6 max-w-xl">
            <SearchBox className="[&_input]:h-12 [&_input]:text-base" />
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
            <Link to={ROUTES.COURSES} className={LINK_PRIMARY}>
              Khám phá khóa học
              <ArrowRight size={16} />
            </Link>
            {!authLoading && !account && (
              <Link to={ROUTES.REGISTER} className={LINK_SECONDARY}>
                Tạo tài khoản
              </Link>
            )}
            {isStudent && (
              <Link to={ROUTES.MY_COURSES} className={LINK_SECONDARY}>
                Khóa học của tôi
              </Link>
            )}
          </motion.div>
        </motion.div>
        <div className="relative lg:col-span-5">
          <motion.div variants={imageReveal} initial="hidden" animate="visible" className="overflow-hidden rounded-2xl border border-line shadow-raised">
            <img src={heroImage} alt="Sách và bản đồ minh họa hành trình học tập" className="aspect-[4/3] w-full object-cover" />
          </motion.div>
          <motion.div
            variants={staggerOf(STAGGER.base, 0.35)}
            initial="hidden"
            animate="visible"
            style={parallax}
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:absolute lg:-bottom-8 lg:-left-10 lg:mt-0 lg:w-[22rem] lg:grid-cols-1"
          >
            <motion.div variants={scaleReveal}>
              <LatestCourseCard latest={latest} />
            </motion.div>
            <motion.div variants={scaleReveal} className={`${floatCard} flex items-start gap-3`}>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                <Sparkles size={18} />
              </span>
              <p className="text-sm text-ink">
                <span className="block font-semibold text-ink-strong">Trợ lý AI gợi ý khóa học</span>
                Nêu nhu cầu của bạn, trợ lý chọn trong các khóa đang mở.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
