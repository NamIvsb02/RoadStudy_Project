import Switch from "../../../components/ui/Switch";

export default function ShowAnswersSwitch({ exam, busy, onToggle }) {
  return <Switch checked={exam.showAnswers} disabled={busy} label={`Cho học viên xem đáp án đề ${exam.examName}`} onChange={() => onToggle(exam)} />;
}
