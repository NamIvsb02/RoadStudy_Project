import { useProofImage } from "../../hooks/useProofImage";
import LoadingState from "../ui/LoadingState";

export default function ProofImage({ invoiceId, reloadKey = 0 }) {
  const { url, error, loading } = useProofImage(invoiceId, reloadKey);

  if (loading) return <LoadingState label="Đang tải minh chứng..." />;
  if (error) return <p className="text-sm text-danger">{error}</p>;

  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img src={url} alt="Ảnh minh chứng thanh toán" className="max-h-96 w-full rounded-lg border border-line object-contain" />
    </a>
  );
}
