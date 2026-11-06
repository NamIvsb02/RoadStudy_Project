import { Outlet } from "react-router-dom";
import BottomNav from "./common/BottomNav";
import Footer from "./common/Footer";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <Header />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 px-4 py-6 lg:px-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
