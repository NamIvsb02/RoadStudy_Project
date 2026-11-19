import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { enrollmentApi } from "../../api/enrollmentApi";
import BackButton from "../../components/common/BackButton";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import PaymentActions from "./PaymentActions";
import PaymentSummary from "./PaymentSummary";
import ProofSection from "./ProofSection";
import TransferInfo from "./TransferInfo";
import { NOTICES, TONES, getStage } from "./paymentState";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentPage() {
  const { id } = useParams();
  const request = useCallback(() => enrollmentApi.getById(id), [id]);
  const { data, loading, error, reload } = useFetch(request);
  const [version, setVersion] = useState(0);
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["enrollment"] });
    reload();
  };

  if (loading) return <LoadingState />;
  if (error) return <FormAlert message={error} />;

  const stage = getStage(data);
  const notice = stage === "REJECTED" ? { tone: "danger", text: `Thanh toán bị từ chối. Lý do: ${data.invoice.rejectionReason ?? "không rõ"}. Bạn có thể gửi lại minh chứng.` } : NOTICES[stage];
  const awaiting = ["AWAITING", "REVIEWING", "REJECTED"].includes(stage);

  const handleUploaded = () => {
    setVersion((value) => value + 1);
    refresh();
  };

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <BackButton fallback={ROUTES.MY_COURSES}>Quay lại khóa học của tôi</BackButton>
      <h1 className="text-xl font-semibold text-ink">Thanh toán khóa học</h1>
      <PaymentSummary registration={data} />
      <p role="status" className={`rounded-lg px-4 py-3 text-sm ${TONES[notice.tone]}`}>
        {notice.text}
      </p>
      {stage === "PAID" && (
        <div className="flex gap-4 text-sm font-semibold">
          <Link to={ROUTES.EXAMS} className="text-primary hover:underline">
            Đi tới bài thi
          </Link>
          <Link to={ROUTES.MY_COURSES} className="text-primary hover:underline">
            Khóa học của tôi
          </Link>
        </div>
      )}
      {awaiting && data.paymentInfo && <TransferInfo info={data.paymentInfo} />}
      {awaiting && <ProofSection invoice={data.invoice} version={version} onUploaded={handleUploaded} />}
      <PaymentActions registration={data} stage={stage} onChanged={refresh} />
    </div>
  );
}
