import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { formatDate, formatVND } from "../../utils/format";

export default function CourseEnrollBox({ course }) {
  const { account } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const canEnroll = !account || account.role === ROLES.STUDENT;

  const handleEnroll = () => {
    if (!account) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    // TODO: nối API đăng ký khóa học (module enrollment chưa có)
  };

  return (
    <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold text-primary">{formatVND(course.price)}</p>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Khai giảng</dt>
          <dd className="font-medium text-slate-800">{formatDate(course.startDate)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Kết thúc</dt>
          <dd className="font-medium text-slate-800">{formatDate(course.endDate)}</dd>
        </div>
      </dl>
      {canEnroll && (
        <Button className="w-full" onClick={handleEnroll}>
          Đăng ký khóa học
        </Button>
      )}
    </div>
  );
}
