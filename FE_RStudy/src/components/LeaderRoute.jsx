import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { isLeader } from "../utils/permission";

export default function LeaderRoute() {
  const { account } = useAuth();

  return isLeader(account) ? <Outlet /> : <Navigate to={ROUTES.FORBIDDEN} replace />;
}
