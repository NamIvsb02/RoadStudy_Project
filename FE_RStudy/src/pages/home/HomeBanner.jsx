import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const SLIDES = [
  { title: 'RoadStudy - Học trực tuyến cùng giáo viên giỏi', text: 'Hàng trăm khóa học đang mở đăng ký.', tone: 'bg-primary' },
  { title: 'Gợi ý khóa học phù hợp với bạn', text: 'Trợ lý AI giúp bạn chọn đúng khóa học.', tone: 'bg-sky-700' },
  { title: 'Đăng ký dễ dàng, thanh toán nhanh chóng', text: 'Bắt đầu học chỉ với vài bước đơn giản.', tone: 'bg-teal-700' },
];
const INTERVAL_MS = 5000;

export default function HomeBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="relative h-56 overflow-hidden rounded-xl sm:h-72">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`absolute inset-0 flex flex-col justify-center gap-3 px-8 text-white ${slide.tone}`}
        >
          <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">{slide.title}</h2>
          <p className="max-w-xl text-white/90">{slide.text}</p>
          <Link
            to={ROUTES.COURSES}
            className="mt-2 w-fit rounded-lg bg-white px-5 py-2 text-sm font-medium text-primary transition-colors duration-150 hover:bg-soft"
          >
            Xem khóa học
          </Link>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-colors duration-150 ${i === index ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}