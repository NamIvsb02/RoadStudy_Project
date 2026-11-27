export const DURATION = { micro: 0.16, component: 0.28, reveal: 0.55, hero: 0.8 };
export const STAGGER = { tight: 0.06, base: 0.08, loose: 0.12 };
export const EASE = { out: [0.25, 1, 0.5, 1], inOut: [0.65, 0, 0.35, 1] };
export const VIEWPORT = { once: true, amount: 0.2 };

const out = EASE.out;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.micro, ease: out } },
  exit: { opacity: 0, transition: { duration: DURATION.micro, ease: out } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.component, ease: out } },
  exit: { opacity: 0, y: 12, transition: { duration: DURATION.micro, ease: out } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.tight } },
};

export const dropdown = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.micro, ease: out } },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.micro, ease: out } },
};

export const slideInLeft = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { duration: DURATION.component, ease: out } },
  exit: { x: "-100%", transition: { duration: DURATION.component, ease: out } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.component, ease: out } },
  exit: { opacity: 0, x: 24, transition: { duration: DURATION.micro, ease: out } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.component, ease: out } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: DURATION.micro, ease: out } },
};

export const stepSlide = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.component, ease: out } },
  exit: { opacity: 0, x: -16, transition: { duration: DURATION.micro, ease: out } },
};

const reveal = { duration: DURATION.reveal, ease: out };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: reveal },
};

export const revealLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: reveal },
};

export const revealRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: reveal },
};

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: reveal },
};

export const imageReveal = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: out } },
};

export const heroLine = {
  hidden: { y: "105%" },
  visible: { y: 0, transition: { duration: DURATION.hero, ease: out } },
};

export const staggerOf = (delay = STAGGER.base, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay, delayChildren } },
});

export const listItem = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.component, ease: out } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: DURATION.micro, ease: out } },
};

export const pageEnter = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: out } },
};

export const chatPanel = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 16,
    pointerEvents: "none",
    transition: { duration: DURATION.micro, ease: out },
    transitionEnd: { visibility: "hidden" },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    pointerEvents: "auto",
    visibility: "visible",
    transition: { duration: DURATION.component, ease: out },
  },
};

export const messageIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: out } },
};

export const pathDraw = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1, transition: { duration: 1.2, ease: EASE.inOut } },
};

export const typingDot = (index) => ({
  animate: { opacity: [0.3, 1, 0.3] },
  transition: { duration: 1, repeat: Infinity, ease: EASE.inOut, delay: index * 0.15 },
});

export const accordion = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: DURATION.component, ease: out } },
  exit: { height: 0, opacity: 0, transition: { duration: DURATION.micro, ease: out } },
};

export const tabIndicator ={ type: "tween", duration: DURATION.component, ease: out };

export const REVEAL_PRESETS = { fadeUp, revealLeft, revealRight, scaleReveal, imageReveal };
