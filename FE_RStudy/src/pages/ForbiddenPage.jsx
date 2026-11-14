import { Link } from "react-router-dom";
import { ROLE_HOME, ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";

export default function ForbiddenPage() {
  const { account } = useAuth();
  const home = account ? ROLE_HOME[account.role] : ROUTES.HOME;

  return (
    <div className="flex flex-col items-center rounded-xl border border-line bg-white px-6 py-16 text-center">
      <p className="text-5xl font-bold text-primary">403</p>
      <p className="mt-3 text-base font-semibold text-ink">Bạn không có quyền truy cập trang này</p>
      <Link to={home} className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
        Quay lại
      </Link>
    </div>
  );
}
