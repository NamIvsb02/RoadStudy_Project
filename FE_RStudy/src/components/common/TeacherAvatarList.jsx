import { generatePath, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Avatar from '../ui/Avatar';

export default function TeacherAvatarList({ teachers }) {
  return (
    <ul className="flex gap-4 overflow-x-auto pb-2">
      {teachers.map((teacher) => (
        <li key={teacher.id} className="w-32 shrink-0">
          <Link
            to={generatePath(ROUTES.TEACHER_PROFILE, { id: teacher.id })}
            className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Avatar src={teacher.account.avatarUrl} name={teacher.account.fullName} size="lg" />
            <span className="line-clamp-1 text-sm font-semibold text-slate-800">
              {teacher.account.fullName}
            </span>
            <span className="line-clamp-1 text-xs text-slate-500">{teacher.specialization}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}