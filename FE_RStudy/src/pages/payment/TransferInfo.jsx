import { useState } from "react";
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
    <div className="flex items-center justify-between gap-3 border-b border-line py-2.5">
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className={`text-sm font-semibold break-all ${highlight ? "text-primary" : "text-ink"}`}>{value}</p>
      </div>
      <button type="button" onClick={handleCopy} className="shrink-0 text-xs font-semibold text-primary hover:underline">
        {copied ? "Đã sao chép" : "Sao chép"}
      </button>
    </div>
  );
}

export default function TransferInfo({ info }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="mb-3 text-base font-semibold text-ink">Thông tin chuyển khoản</h2>
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        {info.qrUrl ? (
          <img src={info.qrUrl} alt="Mã QR chuyển khoản" className="w-full max-w-[220px] rounded-lg border border-line" />
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
