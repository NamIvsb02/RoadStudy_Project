import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import RoadPath from "../../components/common/RoadPath";
import { scaleReveal, VIEWPORT } from "../../constants/motion";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { CONTAINER, LINK_ON_DARK } from "./homeLayout";

export default function HomeCta() {
  const { account, loading } = useAuth();
  if (loading || (account && account.role !== ROLES.STUDENT)) return null;

  const isStudent = Boolean(account);
  const cta = isStudent ? { to: ROUTES.COURSES, label: "Xem khóa học" } : { to: ROUTES.REGISTER, label: "Tạo tài khoản miễn phí" };

  return (
    <section aria-label="Bắt đầu học" className="bg-page py-12 lg:py-16">
      <div className={CONTAINER}>
        <motion.div variants={scaleReveal} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="relative overflow-hidden rounded-2xl bg-brand-gradient px-6 py-12 text-center text-white shadow-raised sm:px-12">
          <RoadPath variant="wide" className="absolute inset-0 size-full text-white/25" />
          <div className="relative">
            <h2 className="text-headline font-bold">{isStudent ? "Tiếp tục hành trình học của bạn" : "Bắt đầu hành trình học cùng RoadStudy"}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-primary-100 sm:text-base">
              {isStudent ? "Chọn thêm khóa học mới hoặc quay lại các khóa bạn đã đăng ký." : "Tạo tài khoản để đăng ký khóa học, theo dõi lớp học và làm bài thi."}
            </p>
            <Link to={cta.to} className={`${LINK_ON_DARK} mt-6`}>
              {cta.label}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
