import { motion } from 'framer-motion';
import Avatar from '../../components/ui/Avatar';
import { fadeUp } from '../../constants/motion';

export default function TeacherProfileHeader({ teacher }) {
  const { account, specialization, biography, teachingExperience } = teacher;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white p-6 text-center shadow-card sm:flex-row sm:items-start sm:p-8 sm:text-left"
    >
      <Avatar src={account.avatarUrl} name={account.fullName} size="xl" className="ring-4 ring-primary-100" />
      <div className="min-w-0 flex-1 space-y-4">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">Giáo viên</p>
          <h1 className="text-headline font-bold text-ink-strong">{account.fullName}</h1>
          <p className="mt-1 font-medium text-primary">{specialization}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-muted">Giới thiệu</h2>
          <p className="whitespace-pre-line text-ink">{biography}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-muted">Kinh nghiệm giảng dạy</h2>
          <p className="whitespace-pre-line text-ink">{teachingExperience}</p>
        </div>
      </div>
    </motion.div>
  );
}
