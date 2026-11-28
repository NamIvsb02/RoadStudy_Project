import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "../constants/motion";
import ChangePasswordForm from "./profile/ChangePasswordForm";
import ProfileForm from "./profile/ProfileForm";
import ProfileInfo from "./profile/ProfileInfo";
import ProfileSidebar from "./profile/ProfileSidebar";

export default function ProfilePage() {
  const [view, setView] = useState("info");
  const showInfo = () => setView("info");

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
      <h1 className="sr-only">Trang cá nhân</h1>
      <ProfileSidebar activeView={view === "edit" ? "info" : view} onSelect={setView} />
      <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={view} variants={fadeIn} initial="hidden" animate="visible" exit="exit">
            {view === "info" && <ProfileInfo onEdit={() => setView("edit")} onChangePassword={() => setView("password")} />}
            {view === "edit" && <ProfileForm onCancel={showInfo} onSaved={showInfo} />}
            {view === "password" && <ChangePasswordForm onCancel={showInfo} />}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
