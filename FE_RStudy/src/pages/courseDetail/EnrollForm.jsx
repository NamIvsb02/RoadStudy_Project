import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { couponApi } from "../../api/couponApi";
import { enrollmentApi } from "../../api/enrollmentApi";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { formatVND } from "../../utils/format";

export default function EnrollForm({ course }) {
  const { account } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const free = Number(course.price) === 0;
  const canEnroll = !account || account.role === ROLES.STUDENT;

  const handleCode = (event) => {
    setCode(event.target.value);
    setPreview(null);
    setError("");
  };

  const handleApply = async () => {
    setApplying(true);
    setError("");
    try {
      const res = await couponApi.validate({ code: code.trim(), courseId: course.id });
      setPreview(res.data);
    } catch (err) {
      setPreview(null);
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleEnroll = async () => {
    if (!account) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    setEnrolling(true);
    setError("");
    try {
      const res = await enrollmentApi.create({ courseId: course.id, ...(preview && { discountCode: preview.code }) });
      await queryClient.invalidateQueries({ queryKey: ["enrollment"] });
      navigate(generatePath(ROUTES.PAYMENT, { id: res.data.registration.id }));
    } catch (err) {
      setError(err.message);
      setEnrolling(false);
    }
  };

  if (!canEnroll) return <p className="text-sm text-muted">Chỉ học viên mới đăng ký được khóa học.</p>;

  return (
    <div className="flex flex-col gap-3">
      <div>
        {preview && <p className="text-sm text-muted line-through">{formatVND(preview.subtotal)}</p>}
        <p className="text-2xl font-bold text-primary">{free ? "Miễn phí" : formatVND(preview ? preview.totalAmount : course.price)}</p>
        {preview && (
          <p className="text-xs text-success">
            Đã giảm {formatVND(preview.discountAmountApplied)} với mã {preview.code}
          </p>
        )}
      </div>
      {!free && (
        <div className="flex gap-2">
          <input
            value={code}
            onChange={handleCode}
            placeholder="Mã giảm giá"
            aria-label="Mã giảm giá"
            className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-sm uppercase text-ink outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button variant="outline" className="h-10 px-4" disabled={!code.trim()} loading={applying} onClick={handleApply}>
            Áp dụng
          </Button>
        </div>
      )}
      <FormAlert message={error} />
      <Button loading={enrolling} onClick={handleEnroll}>
        Đăng ký khóa học
      </Button>
    </div>
  );
}
