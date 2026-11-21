import { useQuery } from "@tanstack/react-query";
import { recommendationApi } from "../../api/recommendationApi";
import CourseCard from "../../components/common/CourseCard";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";

export default function ForYouSection() {
  const { account } = useAuth();
  const enabled = account?.role === ROLES.STUDENT;
  const { data } = useQuery({
    queryKey: ["recommendation", account?.id],
    queryFn: async () => (await recommendationApi.getMine()).data.items,
    enabled,
    staleTime: 60000,
  });

  if (!enabled || !data || data.length === 0) return null;

  return (
    <section aria-labelledby="for-you-title" className="mt-8">
      <h2 id="for-you-title" className="mb-4 text-xl font-bold text-ink">
        Dành cho bạn
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.map(({ course, reason }) => (
          <div key={course.id} className="flex flex-col">
            <CourseCard course={course} />
            <p className="mt-1.5 px-1 text-xs text-muted">{reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
