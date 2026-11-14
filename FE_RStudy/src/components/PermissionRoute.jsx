import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../utils/permission";

export default function PermissionRoute({ permission }) {
  const { account } = useAuth();

  return hasPermission(account, permission) ? <Outlet /> : <Navigate to={ROUTES.FORBIDDEN} replace />;
}
