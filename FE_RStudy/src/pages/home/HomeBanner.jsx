import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";
import { fadeIn } from "../../constants/motion";
// import { ROUTES } from "../../constants/routes";

const imageModules = import.meta.glob("../../assets/images/banners/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});
const IMAGES = Object.keys(imageModules)
  .sort()
  .map((path) => imageModules[path]);

const SLIDES = [
  { title: "RoadStudy - Học trực tuyến cùng giáo viên giỏi", text: "Nhiều khóa học đang mở đăng ký." },
  { title: "Gợi ý khóa học phù hợp với bạn", text: "Trợ lý AI giúp bạn chọn đúng khóa học." },
  { title: "Đăng ký dễ dàng, thanh toán nhanh chóng", text: "Bắt đầu học chỉ với vài bước đơn giản." },
];
const INTERVAL_MS = 5000;

const arrowClass = "absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary transition-colors hover:bg-white sm:inline-flex";

export default function HomeBanner() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (next) => setIndex((next + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, index]);

  // const slide = SLIDES[index];
  const image = IMAGES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Banner nổi bật"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-56 overflow-hidden rounded-xl bg-primary sm:h-72 lg:h-80"
    >
      <AnimatePresence>
        <motion.div key={index} variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="absolute inset-0">
          {image ? <img src={image} alt="" className="size-full object-contain" /> : <div className="size-full bg-gradient-to-r from-primary-dark to-primary-light" />}
          {/* <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6 text-white sm:px-16">
            <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">{slide.title}</h2>
            <p className="max-w-xl text-white/90">{slide.text}</p>
            <Link to={ROUTES.COURSES} className="mt-2 w-fit rounded-lg bg-white px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-white/90">
              Xem khóa học
            </Link>
          </div> */}
        </motion.div>
      </AnimatePresence>
      <button type="button" aria-label="Slide trước" onClick={() => goTo(index - 1)} className={`${arrowClass} left-3`}>
        <ChevronLeft size={20} />
      </button>
      <button type="button" aria-label="Slide sau" onClick={() => goTo(index + 1)} className={`${arrowClass} right-3`}>
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Chuyển tới slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-150 ${i === index ? "w-6 bg-white" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}
