import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TeacherProfileHeader from './teacherProfile/TeacherProfileHeader';

// TODO: đổi lại cho khớp API của bạn
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function TeacherProfilePage() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadTeacher() {
      setLoading(true);
      setError('');
      try {
        // TODO: đổi endpoint cho đúng backend của bạn
        const res = await fetch(`${API_BASE}/api/teachers/${id}`);
        if (!res.ok) throw new Error('Không tải được thông tin giáo viên');
        const data = await res.json();
        if (!cancelled) setTeacher(data.data ?? data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Đã có lỗi xảy ra');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTeacher();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="p-6 text-slate-500">Đang tải...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!teacher) {
    return <p className="p-6 text-slate-500">Không tìm thấy giáo viên.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <TeacherProfileHeader teacher={teacher} />
    </div>
  );
}