import { teacherApi } from "../../api/teacherApi";
import StatCard from "../../components/common/StatCard";
import { useFetch } from "../../hooks/useFetch";
import MyCoursesPanel from "./dashboard/MyCoursesPanel";
import RecentAttemptsPanel from "./dashboard/RecentAttemptsPanel";

const fetchStats = () => teacherApi.getMyStats();

export default function TeacherDashboardPage() {
  const { data, loading, error } = useFetch(fetchStats);

  if (error) {
    return (
      <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
        {error}
      </p>
    );
  }

  const cards = [
    { label: "Khóa học đang mở", value: data?.openCourses },
    { label: "Đề thi đang mở", value: data?.openExams },
    { label: "Bài làm mới (7 ngày)", value: data?.attemptsLast7Days },
    { label: "Đề thi bản nháp", value: data?.draftExams },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} loading={loading} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <RecentAttemptsPanel items={data?.recentAttempts ?? []} loading={loading} />
        <MyCoursesPanel items={data?.courses ?? []} loading={loading} />
      </div>
    </div>
  );
}
