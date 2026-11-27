import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { messageIn } from "../../constants/motion";
import ChatCourseCard from "./ChatCourseCard";

export default function MessageBubble({ message, animate = true }) {
  const mine = message.senderType === "STUDENT";
  const tone = mine
    ? "self-end rounded-br-sm bg-primary text-white"
    : `self-start rounded-bl-sm text-ink shadow-card ${message.degraded ? "border border-warning bg-warning/10" : "bg-white"}`;

  return (
    <motion.div variants={messageIn} initial={animate ? "hidden" : false} animate="visible" className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${tone}`}>
      {message.degraded && (
        <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-warning-strong">
          <TriangleAlert size={14} aria-hidden="true" />
          Trả lời dự phòng, trợ lý AI đang gặp sự cố
        </p>
      )}
      <p className="whitespace-pre-line">{message.content}</p>
      {(message.recommendations ?? []).map((item) => (
        <ChatCourseCard key={item.courseId} recommendation={item} />
      ))}
    </motion.div>
  );
}
