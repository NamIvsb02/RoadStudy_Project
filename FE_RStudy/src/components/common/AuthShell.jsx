import { motion } from "framer-motion";
import { QrCode, Sparkles, Target } from "lucide-react";
import { fadeUp, staggerOf } from "../../constants/motion";
import RoadPath from "./RoadPath";

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Gợi ý khóa học bằng AI",
    text: "Nêu môn học, cấp học và ngân sách, trợ lý chọn khóa phù hợp trong danh sách khóa đang mở.",
  },
  {
    icon: QrCode,
    title: "Thanh toán QR có xác nhận",
    text: "Chuyển khoản theo mã QR, gửi ảnh minh chứng và theo dõi quản trị viên xác nhận ngay trong tài khoản.",
  },
  {
    icon: Target,
    title: "Không gian học tập trung",
    text: "Khóa đã đăng ký, buổi học và bài thi nằm cùng một nơi, không phải tìm ở nhiều chỗ.",
  },
];

export default function AuthShell({ welcome, subtitle, title, children }) {
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-line bg-white shadow-card lg:grid-cols-[5fr_6fr]">
      <aside className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:flex lg:flex-col lg:justify-center">
        <RoadPath variant="vertical" hideOnMobile={false} className="absolute inset-0 size-full text-white/25" />
        <div className="relative">
          <h2 className="text-headline font-bold">{welcome}</h2>
          {subtitle && <p className="mt-3 max-w-sm text-white/80">{subtitle}</p>}
          <motion.ul variants={staggerOf()} initial="hidden" animate="visible" className="mt-10 space-y-6">
            {BENEFITS.map(({ icon: Icon, title: benefitTitle, text }) => (
              <motion.li key={benefitTitle} variants={fadeUp} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{benefitTitle}</span>
                  <span className="mt-1 block text-sm text-white/80">{text}</span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </aside>
      <section className="p-6 sm:p-10">
        <h1 className="text-headline font-bold text-primary-dark">{title}</h1>
        {subtitle && <p className="mt-2 mb-6 text-sm text-muted lg:hidden">{subtitle}</p>}
        <div className={subtitle ? "lg:mt-6" : "mt-6"}>{children}</div>
      </section>
    </div>
  );
}
