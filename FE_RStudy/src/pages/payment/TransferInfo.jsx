import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { formatVND } from "../../utils/format";

function InfoRow({ label, value, copyValue = value, highlight = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(copyValue));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-1.5">
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className={`text-sm font-semibold break-all ${highlight ? "text-primary" : "text-ink"}`}>{value}</p>
      </div>
      <button type="button" onClick={handleCopy} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary-light">
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? "Đã sao chép" : "Sao chép"}
      </button>
    </div>
  );
}

export default function TransferInfo({ info }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="mb-3 text-base font-semibold text-ink">Thông tin chuyển khoản</h2>
      <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
        {info.qrUrl ? (
          <img src={info.qrUrl} alt="Mã QR chuyển khoản" className="mx-auto w-full max-w-[220px] rounded-xl border border-line bg-white p-2 md:mx-0" />
        ) : (
          <p className="text-sm text-muted">Chưa có mã QR, vui lòng chuyển khoản thủ công theo thông tin bên cạnh.</p>
        )}
        <div>
          {info.bankId && <InfoRow label="Ngân hàng" value={info.bankId} />}
          {info.accountNo && <InfoRow label="Số tài khoản" value={info.accountNo} />}
          {info.accountName && <InfoRow label="Chủ tài khoản" value={info.accountName} />}
          <InfoRow label="Số tiền" value={formatVND(info.amount)} copyValue={Math.round(Number(info.amount))} />
          <InfoRow label="Nội dung chuyển khoản (nhập đúng)" value={info.transferContent} highlight />
        </div>
      </div>
    </section>
  );
}
