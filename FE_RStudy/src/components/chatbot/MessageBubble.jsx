import ChatCourseCard from "./ChatCourseCard";

export default function MessageBubble({ message }) {
  const mine = message.senderType === "STUDENT";
  const tone = mine ? "self-end rounded-br-sm bg-primary text-white" : `self-start rounded-bl-sm bg-white text-ink shadow-card ${message.degraded ? "border border-warning" : ""}`;

  return (
    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${tone}`}>
      <p className="whitespace-pre-line">{message.content}</p>
      {(message.recommendations ?? []).map((item) => (
        <ChatCourseCard key={item.courseId} recommendation={item} />
      ))}
    </div>
  );
}
