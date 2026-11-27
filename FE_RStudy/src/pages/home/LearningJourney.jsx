import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import Reveal from "../../components/common/Reveal";
import SectionHeader from "../../components/common/SectionHeader";
import { revealLeft, VIEWPORT } from "../../constants/motion";
import { CONTAINER } from "./homeLayout";

const STEPS = [
  { title: "Tìm khóa học phù hợp", text: "Tìm kiếm theo từ khóa, lọc theo danh mục và học phí, hoặc nhờ trợ lý AI gợi ý trong các khóa đang mở." },
  { title: "Đăng ký và thanh toán", text: "Chuyển khoản theo mã QR, gửi ảnh minh chứng. Quản trị viên xác nhận và bạn nhận thông báo ngay." },
  { title: "Vào học", text: "Mở link lớp học trực tuyến, thư mục tài liệu và xem lịch học do giáo viên cập nhật." },
  { title: "Làm bài thi và đánh giá", text: "Làm bài thi trắc nghiệm của khóa, xem kết quả và để lại đánh giá cho giáo viên." },
];

export default function LearningJourney() {
  const stepsRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ["start 70%", "end 60%"] });

  return (
    <section aria-label="Hành trình học trên RoadStudy" className="bg-fade-page py-12 lg:py-20">
      <div className={`${CONTAINER} grid gap-8 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <SectionHeader eyebrow="Hành trình học" title="Bốn bước từ tìm khóa đến hoàn thành" description="Mọi bước đều nằm trong một nơi, bằng tiếng Việt." />
            </Reveal>
          </div>
        </div>
        <ol ref={stepsRef} className="relative space-y-10 lg:col-span-7">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-5 w-0.5 -translate-x-1/2 bg-line" />
          <motion.span aria-hidden="true" style={{ scaleY: scrollYProgress }} className="absolute top-2 bottom-2 left-5 w-0.5 origin-top -translate-x-1/2 bg-primary" />
          {STEPS.map((step, index) => (
            <motion.li key={step.title} variants={revealLeft} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="relative flex gap-5">
              <span className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white text-sm font-bold text-primary">{index + 1}</span>
              <div className="pb-2">
                <h3 className="text-lg font-semibold text-ink-strong">{step.title}</h3>
                <p className="mt-1 max-w-lg text-sm text-muted">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
