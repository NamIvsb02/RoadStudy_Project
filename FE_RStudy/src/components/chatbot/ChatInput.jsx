import { Send } from "lucide-react";

const MAX = 500;

export default function ChatInput({ value, disabled, onChange, onSend }) {
  const handleKey = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-line bg-white p-3">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          rows={1}
          maxLength={MAX}
          disabled={disabled}
          placeholder="Nhập câu hỏi..."
          aria-label="Nhập tin nhắn"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKey}
          className="max-h-24 min-h-11 flex-1 resize-none rounded-lg border border-line px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-60"
        />
        <button
          type="button"
          aria-label="Gửi tin nhắn"
          disabled={disabled || !value.trim()}
          onClick={onSend}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-1.5 flex justify-between gap-2 text-[11px] text-muted">
        <span>AI có thể trả lời chưa chính xác, hãy kiểm tra lại trên trang khóa học.</span>
        <span className="shrink-0">
          {value.length}/{MAX}
        </span>
      </p>
    </div>
  );
}
