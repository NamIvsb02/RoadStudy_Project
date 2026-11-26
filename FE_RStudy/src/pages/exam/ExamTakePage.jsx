import { useEffect, useRef, useState } from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import { submissionApi } from "../../api/submissionApi";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/common/LoadingState";
import { ROUTES } from "../../constants/routes";
import ExamRoom from "./take/ExamRoom";

export default function ExamTakePage() {
  const { id } = useParams();
  const [round, setRound] = useState(0);
  const [state, setState] = useState({ key: null, session: null, error: "" });
  const startedKey = useRef(null);
  const key = `${id}:${round}`;

  useEffect(() => {
    if (startedKey.current === key) return;
    startedKey.current = key;
    submissionApi
      .start(id)
      .then((res) => setState({ key, session: res.data, error: "" }))
      .catch((err) => setState({ key, session: null, error: err.message }));
  }, [id, key]);

  if (state.key !== key) return <LoadingState label="Đang chuẩn bị bài thi..." />;
  if (state.error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <FormAlert message={state.error} />
        <Link to={generatePath(ROUTES.EXAM_DETAIL, { id })} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">
          Quay lại đề thi
        </Link>
      </div>
    );
  }

  return <ExamRoom key={state.session.attempt.id} session={state.session} onRetry={() => setRound((value) => value + 1)} />;
}
