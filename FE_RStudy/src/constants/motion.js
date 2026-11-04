const ease = 'easeOut';

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease } },
  exit: { opacity: 0, transition: { duration: 0.15, ease } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.2, ease } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
