import { motion } from "framer-motion";
import { Bot, CircleCheck } from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { messageIn, STAGGER, staggerOf, VIEWPORT } from "../../constants/motion";
import { CONTAINER } from "./homeLayout";

const POINTS = [
  "Chỉ gợi ý các khóa học đang mở có thật trên hệ thống.",
  "Mỗi gợi ý kèm lý do để bạn tự cân nhắc.",
  "Không tự đăng ký hay thanh toán thay bạn.",
];

const bubble = "max-w-[85%] rounded-xl px-4 py-2.5 text-sm";

export default function AiAdvisorSection() {
  return (
    <section aria-label="Trợ lý AI" className="relative overflow-hidden bg-primary-950 py-12 text-white lg:py-20">
      <div aria-hidden="true" className="absolute inset-0 bg-brand-gradient opacity-20" />
      <div className={`${CONTAINER} relative grid items-center gap-10 lg:grid-cols-12 lg:gap-16`}>
        <Reveal variant="revealLeft" className="lg:col-span-5">
          <p className="mb-2 text-xs font-semibold tracking-wider text-primary-200 uppercase">Trợ lý AI</p>
          <h2 className="text-headline font-bold">AI là cố vấn, quyết định thuộc về bạn</h2>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-primary-100">
                <CircleCheck size={20} className="mt-0.5 shrink-0 text-sky" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal variant="revealRight" className="lg:col-span-7">
          <div className="mx-auto max-w-lg rounded-2xl border border-white/15 bg-white/10 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Bot size={18} />
                Trợ lý RoadStudy
              </span>
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-strong">Ví dụ</span>
            </div>
            <motion.div variants={staggerOf(STAGGER.loose, 0.2)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="space-y-3">
              <motion.p variants={messageIn} className={`${bubble} ml-auto bg-white text-ink`}>
                Mình muốn tìm một khóa học phù hợp với nhu cầu và ngân sách của mình.
              </motion.p>
              <motion.p variants={messageIn} className={`${bubble} bg-primary-dark text-white`}>
                Bạn cho mình biết môn học, cấp học và mức học phí mong muốn nhé.
              </motion.p>
              <motion.p variants={messageIn} className={`${bubble} bg-primary-dark text-white`}>
                Mình sẽ chọn trong các khóa đang mở và nêu lý do cho từng gợi ý.
              </motion.p>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
