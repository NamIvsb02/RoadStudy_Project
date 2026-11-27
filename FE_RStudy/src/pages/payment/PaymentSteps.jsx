import { Check } from "lucide-react";

const STEPS = ["Đăng ký", "Chuyển khoản", "Chờ xác nhận", "Hoàn tất"];
const CURRENT = { AWAITING: 1, REJECTED: 1, REVIEWING: 2, PAID: 4 };

export default function PaymentSteps({ stage }) {
  const current = CURRENT[stage];
  if (current === undefined) return null;

  return (
    <ol aria-label="Các bước thanh toán" className="grid grid-cols-4 gap-1">
      {STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="flex flex-col items-center gap-1.5 text-center">
            <span
              className={`flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                done ? "border-primary bg-primary text-white" : active ? "border-primary bg-white text-primary" : "border-line-strong bg-white text-muted"
              }`}
            >
              {done ? <Check size={16} aria-hidden="true" /> : index + 1}
            </span>
            <span className={`text-xs ${done || active ? "font-semibold text-ink" : "text-muted"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
