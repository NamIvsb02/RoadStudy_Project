import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import FormAlert from "../ui/FormAlert";
import { useOpenConversation, useSendMessage } from "../../hooks/useChatbot";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

const GREETING = "Chào bạn! Mình có thể gợi ý khóa học phù hợp với nhu cầu của bạn. Bạn đang muốn học gì?";
const SUGGESTIONS = ["Gợi ý khóa học miễn phí", "Khóa học cho người mới bắt đầu", "Khóa học sắp khai giảng"];
const headerButton = "rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-white/25";

export default function ChatPanel({ onClose }) {
  const sender = useSendMessage();
  const opener = useOpenConversation();
  const endRef = useRef(null);
  const [view, setView] = useState("chat");
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const draftIdRef = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, sender.isPending, view]);

  const send = async (raw) => {
    const content = raw.trim();
    if (!content || sender.isPending) return;
    draftIdRef.current += 1;

    const draft = {
      id: `draft-${draftIdRef.current}`,
      senderType: "STUDENT",
      content,
    };
    setError("");
    setText("");
    setMessages((prev) => [...prev, draft]);
    try {
      const result = await sender.mutateAsync({ ...(conversationId && { conversationId }), content });
      setConversationId(result.conversation.id);
      setMessages((prev) => [...prev.filter((item) => item.id !== draft.id), result.userMessage, { ...result.aiMessage, degraded: result.degraded }]);
    } catch (err) {
      setMessages((prev) => prev.filter((item) => item.id !== draft.id));
      setText(content);
      setError(err.message);
    }
  };

  const openConversation = async (id) => {
    setError("");
    try {
      const data = await opener.mutateAsync(id);
      setConversationId(data.id);
      setMessages(data.messages);
      setView("chat");
    } catch (err) {
      setError(err.message);
    }
  };

  const startNew = () => {
    setConversationId(null);
    setMessages([]);
    setText("");
    setError("");
    setView("chat");
  };

  return (
    <section aria-label="Trợ lý RoadStudy" className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card-hover">
      <header className="flex items-center justify-between gap-2 bg-primary px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Trợ lý RoadStudy</p>
          <p className="text-xs text-white/80">Tư vấn khóa học bằng AI</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" onClick={() => setView(view === "chat" ? "history" : "chat")} className={headerButton}>
            {view === "chat" ? "Lịch sử" : "Quay lại chat"}
          </button>
          <button type="button" onClick={startNew} className={headerButton}>
            Chat mới
          </button>
          <button type="button" aria-label="Đóng trợ lý" onClick={onClose} className="inline-flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-white/25">
            <X size={16} />
          </button>
        </div>
      </header>
      {view === "history" ? (
        <ChatHistory opening={opener.isPending} onOpen={openConversation} />
      ) : (
        <>
          <div role="log" aria-live="polite" className="flex flex-1 flex-col gap-2 overflow-y-auto bg-soft p-3">
            {messages.length === 0 && (
              <>
                <div className="max-w-[85%] self-start rounded-xl rounded-bl-sm bg-white px-3 py-2 text-sm text-ink shadow-card">{GREETING}</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => send(item)}
                      className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {sender.isPending && (
              <p className="flex items-center gap-2 text-xs text-muted">
                <Loader2 size={16} className="animate-spin" />
                Trợ lý đang trả lời...
              </p>
            )}
            <FormAlert message={error} />
            <div ref={endRef} />
          </div>
          <ChatInput value={text} disabled={sender.isPending} onChange={setText} onSend={() => send(text)} />
        </>
      )}
    </section>
  );
}
