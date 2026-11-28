import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo_text-blue.png";
import { dropdown, fadeIn, tabIndicator } from "../../constants/motion";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import MainNav from "./MainNav";
import SearchBox from "./SearchBox";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";

const iconButton = "inline-flex size-11 items-center justify-center rounded-full bg-surface text-primary transition-colors duration-150 hover:bg-line";

export default function Header() {
  const { account } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 8));

  return (
    <header className={`sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-150 ease-out-soft ${scrolled ? "border-transparent bg-white/90 shadow-card backdrop-blur" : "border-line bg-white"}`}>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 lg:px-6">
        <Link to={ROUTES.HOME} className="shrink-0" aria-label="RoadStudy">
          <img src={logo} alt="RoadStudy" className="h-11 w-auto" />
        </Link>
        {/* Khung giữ chỗ cố định w-56 để bố cục header không xô lệch; thanh tìm kiếm nằm đè lên và dài ra khi đang nhập. */}
        <div className="relative hidden h-10 w-56 shrink-0 lg:block">
          <motion.div layout transition={tabIndicator} className={`absolute inset-y-0 left-0 z-20 ${searchActive ? "w-[min(40rem,calc(100vw-24rem))]" : "w-full"}`}>
            <SearchBox className="w-full" inputClassName={searchActive ? "bg-white hover:bg-white" : ""} onActiveChange={setSearchActive} />
          </motion.div>
        </div>
        <MainNav className={`transition-opacity duration-150 ease-out-soft ${searchActive ? "pointer-events-none opacity-0" : ""}`} />
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button type="button" aria-label="Tìm kiếm" onClick={() => setSearchOpen((value) => !value)} className={`${iconButton} lg:hidden`}>
            <Search size={20} />
          </button>
          {account ? (
            <>
              <NotificationBell buttonClassName="bg-surface text-primary hover:bg-line" />
              <UserMenu />
            </>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link to={ROUTES.REGISTER} className="text-sm font-medium text-primary transition-colors duration-150 hover:text-primary-dark">
                Đăng ký
              </Link>
              <Link to={ROUTES.LOGIN} className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Lớp phủ gồm hai phần cùng màu: một phần trong header (để thanh tìm kiếm nổi trên nó) và một phần phủ trang qua portal. */}
      <AnimatePresence>
        {searchActive && <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" aria-hidden="true" className="absolute inset-x-0 top-0 -bottom-px z-10 hidden bg-black/40 lg:block" />}
      </AnimatePresence>
      {createPortal(
        <AnimatePresence>
          {searchActive && <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" aria-hidden="true" className="fixed inset-0 z-30 hidden bg-black/40 lg:block" />}
        </AnimatePresence>,
        document.body,
      )}
      <AnimatePresence>
        {searchOpen && (
          <motion.div variants={dropdown} initial="hidden" animate="visible" exit="exit" className="border-t border-line p-3 lg:hidden">
            <SearchBox autoFocus onSubmitted={() => setSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
