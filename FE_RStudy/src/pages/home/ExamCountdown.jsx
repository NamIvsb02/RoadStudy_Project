import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import RevealGroup from "../../components/common/RevealGroup";
import { UPCOMING_EXAMS } from "../../constants/exams";
import { formatDate } from "../../utils/format";
import { CONTAINER } from "./homeLayout";

const TONES = {
  primaryDark: { card: "bg-primary-dark", ink: "text-primary-dark" },
  primary: { card: "bg-primary", ink: "text-primary" },
  secondary: { card: "bg-secondary-strong", ink: "text-secondary-strong" },
};
const SECOND = 1000;
const pad = (value) => String(value).padStart(2, "0");

function getParts(remainingMs) {
  const seconds = Math.floor(remainingMs / SECOND);
  return [
    { label: "Ngày", value: String(Math.floor(seconds / 86400)) },
    { label: "Giờ", value: pad(Math.floor(seconds / 3600) % 24) },
    { label: "Phút", value: pad(Math.floor(seconds / 60) % 60) },
    { label: "Giây", value: pad(seconds % 60) },
  ];
}

function CountdownCard({ exam, now }) {
  const tone = TONES[exam.tone] ?? TONES.primary;
  const parts = getParts(new Date(exam.startsAt).getTime() - now);

  return (
    <article className={`flex h-full flex-col gap-3 rounded-xl p-4 text-white sm:flex-row sm:items-center ${tone.card}`}>
      <h3 className="text-lg leading-tight font-bold sm:w-20 sm:shrink-0 sm:text-center">{exam.name}</h3>
      <p className="sr-only">
        Thi ngày {formatDate(exam.startsAt)}, còn {parts[0].value} ngày
      </p>
      <div aria-hidden="true" className="grid flex-1 grid-cols-4 gap-2">
        {parts.map((part) => (
          <div key={part.label} className="text-center">
            <p className={`rounded-lg bg-white py-2 text-xl font-bold tabular-nums sm:text-2xl ${tone.ink}`}>{part.value}</p>
            <p className="mt-1 text-xs font-medium">{part.label}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function ExamCountdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), SECOND);
    return () => clearInterval(id);
  }, []);

  const exams = UPCOMING_EXAMS.filter((exam) => new Date(exam.startsAt).getTime() > now);
  if (exams.length === 0) return null;

  return (
    <section aria-labelledby="exam-countdown-title" className="bg-white py-10 lg:py-12">
      <div className={CONTAINER}>
        <h2 id="exam-countdown-title" className="mb-4 flex items-center gap-2 text-xl font-bold text-ink-strong">
          <Timer size={20} aria-hidden="true" className="text-primary" />
          Đếm ngược kỳ thi
        </h2>
        <RevealGroup className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] gap-4" itemClassName="min-w-0">
          {exams.map((exam) => (
            <CountdownCard key={exam.id} exam={exam} now={now} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
