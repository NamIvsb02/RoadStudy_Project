import { PERMISSIONS } from "../../constants/permissions";
import { useAuth } from "../../hooks/useAuth";
import { hasPermission } from "../../utils/permission";
import CountCard from "./dashboard/CountCard";
import PaymentsTable from "./dashboard/PaymentsTable";
import TeachersTable from "./dashboard/TeachersTable";
import { PENDING_CARDS, TOTAL_CARDS } from "./dashboard/dashboardConfig";

export default function AdminDashboardPage() {
  const { account } = useAuth();
  const can = (permission) => hasPermission(account, permission);
  const pending = PENDING_CARDS.filter((card) => can(card.permission));

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 text-base font-semibold text-ink">Việc cần xử lý</h2>
        {pending.length === 0 ? (
          <p className="rounded-xl border border-line bg-white p-5 text-sm text-muted">Bạn chưa được cấp quyền xử lý chức năng nào.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {pending.map(({ key, ...card }) => (
              <CountCard key={key} {...card} />
            ))}
          </div>
        )}
      </section>

      {can(PERMISSIONS.QUAN_LY_TAI_KHOAN) && (
        <section className="grid gap-4 sm:grid-cols-3">
          {TOTAL_CARDS.map(({ key, ...card }) => (
            <CountCard key={key} {...card} />
          ))}
        </section>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        {can(PERMISSIONS.QUAN_LY_THANH_TOAN) && <PaymentsTable />}
        {can(PERMISSIONS.DUYET_GIAO_VIEN) && <TeachersTable />}
      </div>
    </div>
  );
}
