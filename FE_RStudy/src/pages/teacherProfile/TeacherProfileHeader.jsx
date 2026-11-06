import Avatar from '../../components/ui/Avatar';

export default function TeacherProfileHeader({ teacher }) {
  const { account, specialization, biography, teachingExperience } = teacher;

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm sm:flex-row">
      <Avatar src={account.avatarUrl} name={account.fullName} size="lg" />
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{account.fullName}</h1>
          <p className="text-primary">{specialization}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-500">Giới thiệu</h2>
          <p className="whitespace-pre-line text-slate-700">{biography}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-500">Kinh nghiệm giảng dạy</h2>
          <p className="whitespace-pre-line text-slate-700">{teachingExperience}</p>
        </div>
      </div>
    </div>
  );
}