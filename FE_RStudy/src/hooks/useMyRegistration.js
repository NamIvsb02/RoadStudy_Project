import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "../api/enrollmentApi";
import { ROLES } from "../constants/roles";
import { useAuth } from "./useAuth";

const ACTIVE = ["DA_THANH_TOAN", "CHO_THANH_TOAN"];

export function useMyRegistration(courseId) {
  const { account } = useAuth();
  const enabled = account?.role === ROLES.STUDENT;
  const query = useQuery({
    queryKey: ["enrollment", account?.id, "mine"],
    queryFn: async () => (await enrollmentApi.getMine({ limit: 100 })).data.items,
    enabled,
  });
  const registration = (query.data ?? []).find((item) => item.course.id === courseId && ACTIVE.includes(item.status)) ?? null;

  return { registration, loading: enabled && query.isPending };
}
