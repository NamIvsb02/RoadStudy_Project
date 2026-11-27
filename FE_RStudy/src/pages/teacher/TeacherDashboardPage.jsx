import { BookOpen, ClipboardCheck, FileText, PencilLine } from "lucide-react";
import { teacherApi } from "../../api/teacherApi";
import StatCard from "../../components/common/StatCard";
import { useFetch } from "../../hooks/useFetch";
import ActionError from "../manage/ActionError";
import MyCoursesPanel from "./dashboard/MyCoursesPanel";
import RecentAttemptsPanel from "./dashboard/RecentAttemptsPanel";

const fetchStats = () => teacherApi.getMyStats();

export default function TeacherDashboardPage() {
  const { data, loading, error } = useFetch(fetchStats);

  if (error) {
    return <ActionError message={error} />;
  }

  const cards = [
    { label: "Khóa học đang mở", value: data?.openCourses, icon: BookOpen },
    { label: "Đề thi đang mở", value: data?.openExams, icon: FileText },
    {
      label: "Bài làm mới (7 ngày)",
      value: data?.attemptsLast7Days,
      icon: ClipboardCheck,
    },
    { label: "Đề thi bản nháp", value: data?.draftExams, icon: PencilLine },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} loading={loading} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <RecentAttemptsPanel items={data?.recentAttempts ?? []} loading={loading} />
        <MyCoursesPanel items={data?.courses ?? []} loading={loading} />
      </div>
    </div>
  );
}
