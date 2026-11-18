import { Outlet } from "react-router-dom";
import Header from "./common/Header";

export default function ExamLayout() {
  return (
    <div className="min-h-screen bg-page">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
