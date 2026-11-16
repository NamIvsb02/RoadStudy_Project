import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BackButton({ fallback, children = "Quay lại" }) {
  const navigate = useNavigate();
  const { key } = useLocation();

  const handleClick = () => navigate(key === "default" ? fallback : -1);

  return (
    <button type="button" onClick={handleClick} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
      <ArrowLeft size={16} />
      {children}
    </button>
  );
}
