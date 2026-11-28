import { useRef, useState } from "react";
import { invoiceApi } from "../../api/invoiceApi";
import ProofImage from "../../components/common/ProofImage";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import { useGlobalLoading } from "../../hooks/useGlobalLoading";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function ProofSection({ invoice, version, onUploaded }) {
  const inputRef = useRef(null);
  const loading = useGlobalLoading();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFile = (event) => {
    const picked = event.target.files[0] ?? null;
    setFile(null);
    setError("");
    if (!picked) return;
    if (!ALLOWED.includes(picked.type)) setError("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP");
    else if (picked.size > MAX_SIZE) setError("Ảnh tối đa 5MB");
    else setFile(picked);
  };

  const handleUpload = async () => {
    setUploading(true);
    setError("");
    try {
      await loading.run(() => invoiceApi.uploadProof(invoice.id, file), "Đang xử lý thanh toán...");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="mb-3 text-base font-semibold text-ink">Ảnh minh chứng</h2>
      {invoice.hasPaymentProof && (
        <div className="mb-4">
          <p className="mb-2 text-sm text-muted">Minh chứng đã gửi:</p>
          <ProofImage invoiceId={invoice.id} reloadKey={version} />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        aria-label="Chọn ảnh minh chứng"
        className="block w-full rounded-xl border border-dashed border-line-strong bg-page p-3 text-sm text-ink file:mr-3 file:h-11 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:text-sm file:font-semibold file:text-primary"
      />
      <p className="mt-1 text-xs text-muted">JPG, PNG hoặc WEBP, tối đa 5MB.</p>
      <div className="mt-3">
        <FormAlert message={error} />
      </div>
      <Button className="mt-3" disabled={!file} loading={uploading} onClick={handleUpload}>
        {invoice.hasPaymentProof ? "Gửi lại minh chứng" : "Gửi minh chứng"}
      </Button>
    </section>
  );
}
