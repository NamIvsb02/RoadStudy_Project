import { motion } from 'framer-motion';
import { CircleAlert } from 'lucide-react';
import { fadeIn } from '../../constants/motion';

export default function FieldError({ message }) {
  if (!message) return null;
  return (
    <motion.p
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mt-1 flex items-start gap-1 text-sm text-danger-strong"
    >
      <CircleAlert size={14} className="mt-1 shrink-0" aria-hidden="true" />
      {message}
    </motion.p>
  );
}
