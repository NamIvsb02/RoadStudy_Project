import { Outlet } from "react-router-dom";
import BottomNav from "./common/BottomNav";
import Footer from "./common/Footer";
import Header from "./common/Header";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-6 lg:py-12">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
