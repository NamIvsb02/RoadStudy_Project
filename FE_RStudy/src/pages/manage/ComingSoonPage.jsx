import { Construction } from "lucide-react";

export default function ComingSoonPage({ title = "Chức năng" }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-white px-6 py-16 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary">
        <Construction size={24} aria-hidden="true" />
      </span>
      <p className="mt-3 text-base font-semibold text-ink">{title} đang được phát triển</p>
      <p className="mt-1 text-sm text-muted">Trang này sẽ sớm có mặt.</p>
    </div>
  );
}
