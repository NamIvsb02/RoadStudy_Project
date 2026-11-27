import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { History, MessageSquarePlus, MessagesSquare, Sparkles, X } from "lucide-react";
import FormAlert from "../ui/FormAlert";
import { typingDot } from "../../constants/motion";
import { useOpenConversation, useSendMessage } from "../../hooks/useChatbot";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

const GREETING = "Chào bạn! Mình có thể gợi ý khóa học phù hợp với nhu cầu của bạn. Bạn đang muốn học gì?";
const SUGGESTIONS = ["Gợi ý khóa học miễn phí", "Khóa học cho người mới bắt đầu", "Khóa học sắp khai giảng"];
const headerButton =
  "inline-flex size-11 items-center justify-center rounded-lg transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function TypingIndicator({ reduceMotion }) {
  return (
    <div role="status" className="flex items-center gap-2 self-start rounded-xl rounded-bl-sm bg-white px-3 py-2 text-xs text-muted shadow-card">
      {reduceMotion ? (
        <span aria-hidden="true">Trợ lý đang trả lời...</span>
      ) : (
        <span aria-hidden="true" className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <motion.span key={index} className="size-1.5 rounded-full bg-muted" {...typingDot(index)} />
          ))}
        </span>
      )}
      <span className="sr-only">Trợ lý đang trả lời...</span>
    </div>
  );
}

export default function ChatPanel({ onClose }) {
  const sender = useSendMessage();
  const opener = useOpenConversation();
  const endRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState("chat");
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [settledCount, setSettledCount] = useState(0);
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
      setMessages((prev) => [...prev.filter((item) => item.id !== draft.id), { ...result.userMessage, clientKey: draft.id }, { ...result.aiMessage, degraded: result.degraded }]);
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
      setSettledCount(data.messages.length);
      setView("chat");
    } catch (err) {
      setError(err.message);
    }
  };

  const startNew = () => {
    setConversationId(null);
    setMessages([]);
    setSettledCount(0);
    setText("");
    setError("");
    setView("chat");
  };

  return (
    <section aria-label="Trợ lý RoadStudy" className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-raised">
      <header className="flex items-center justify-between gap-2 bg-linear-to-br from-primary to-primary-dark py-2 pr-2 pl-4 text-white">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Trợ lý RoadStudy</p>
            <p className="truncate text-xs text-white/80">Tư vấn khóa học bằng AI</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            aria-label={view === "chat" ? "Lịch sử trò chuyện" : "Quay lại chat"}
            title={view === "chat" ? "Lịch sử trò chuyện" : "Quay lại chat"}
            onClick={() => {
              setSettledCount(messages.length);
              setView(view === "chat" ? "history" : "chat");
            }}
            className={headerButton}
          >
            {view === "chat" ? <History size={20} aria-hidden="true" /> : <MessagesSquare size={20} aria-hidden="true" />}
          </button>
          <button type="button" aria-label="Chat mới" title="Chat mới" onClick={startNew} className={headerButton}>
            <MessageSquarePlus size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Đóng trợ lý" title="Đóng trợ lý" onClick={onClose} className={headerButton}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </header>
      {view === "history" ? (
        <ChatHistory opening={opener.isPending} onOpen={openConversation} />
      ) : (
        <>
          <div role="log" aria-live="polite" className="flex flex-1 flex-col gap-2 overflow-y-auto bg-page p-3">
            {messages.length === 0 && (
              <>
                <div className="max-w-[85%] self-start rounded-xl rounded-bl-sm bg-white px-3 py-2 text-sm text-ink shadow-card">{GREETING}</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => send(item)}
                      className="min-h-11 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
            {messages.map((message, index) => (
              <MessageBubble key={message.clientKey ?? message.id} message={message} animate={index >= settledCount} />
            ))}
            {sender.isPending && <TypingIndicator reduceMotion={reduceMotion} />}
            <FormAlert message={error} />
            <div ref={endRef} />
          </div>
          <ChatInput value={text} disabled={sender.isPending} onChange={setText} onSend={() => send(text)} />
        </>
      )}
    </section>
  );
}
