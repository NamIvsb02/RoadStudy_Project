import { Suspense } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { pageEnter } from "../constants/motion";
import BottomNav from "./common/BottomNav";
import Footer from "./common/Footer";
import Header from "./common/Header";
import PageSkeleton from "./common/PageSkeleton";
import ScrollToTop from "./common/ScrollToTop";
import Sidebar from "./common/Sidebar";
import ChatWidget from "./chatbot/ChatWidget";

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = Boolean(useMatch(ROUTES.HOME));

  const page = (
    <Suspense fallback={<PageSkeleton />}>
      <motion.div key={pathname} variants={pageEnter} initial="hidden" animate="visible">
        <Outlet />
      </motion.div>
    </Suspense>
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip pb-16 lg:pb-0">
      <ScrollToTop />
      <Header />
      {isHome ? (
        <main className="min-w-0 flex-1">{page}</main>
      ) : (
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 px-4 py-6 lg:px-6">
          <Sidebar />
          <main className="min-w-0 flex-1">{page}</main>
        </div>
      )}
      <Footer />
      <BottomNav />
      <ChatWidget />
    </div>
  );
}
