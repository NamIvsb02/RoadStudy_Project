import { Construction } from "lucide-react";

export default function ComingSoonPage({ title = "Chức năng" }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-white px-6 py-16 text-center">
      <Construction size={32} className="text-muted" />
      <p className="mt-3 text-base font-semibold text-ink">{title} đang được phát triển</p>
      <p className="mt-1 text-sm text-muted">Trang này sẽ sớm có mặt.</p>
    </div>
  );
}
