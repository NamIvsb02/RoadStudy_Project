import { motion } from 'framer-motion';
import { fadeIn } from '../../constants/motion';

export default function FieldError({ message }) {
  if (!message) return null;
  return (
    <motion.p
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mt-1 text-sm text-red-600"
    >
      {message}
    </motion.p>
  );
}