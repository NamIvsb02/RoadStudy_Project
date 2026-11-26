import { Suspense } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { pageEnter } from "../constants/motion";
import BottomNav from "./common/BottomNav";
import Footer from "./common/Footer";
import Header from "./common/Header";
import PageSkeleton from "./common/PageSkeleton";
import ScrollToTop from "./common/ScrollToTop";

export default function AuthLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <ScrollToTop />
      <Header />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-6 lg:py-12">
        <Suspense fallback={<PageSkeleton />}>
          <motion.div key={pathname} variants={pageEnter} initial="hidden" animate="visible">
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
