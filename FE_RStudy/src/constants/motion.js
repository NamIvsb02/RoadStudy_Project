const ease = "easeOut";

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

export const dropdown = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease } },
};

export const slideInLeft = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { duration: 0.25, ease } },
  exit: { x: "-100%", transition: { duration: 0.2, ease } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease } },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2, ease } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15, ease } },
};

export const stepSlide = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.2, ease } },
};
