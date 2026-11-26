import LoadingState from "../../components/common/LoadingState";
import { useMyRegistration } from "../../hooks/useMyRegistration";
import EnrollForm from "./EnrollForm";
import EnrolledNotice from "./EnrolledNotice";

export default function EnrollPanel({ course }) {
  const { registration, loading } = useMyRegistration(course.id);

  if (loading) return <LoadingState label="Đang kiểm tra đăng ký..." />;
  if (registration) return <EnrolledNotice registration={registration} course={course} />;
  return <EnrollForm course={course} />;
}
