import { useMemo } from "react";
import { motion } from "framer-motion";
import { REVEAL_PRESETS, VIEWPORT } from "../../constants/motion";

export default function Reveal({ as = "div", variant = "fadeUp", delay = 0, className = "", children, ...props }) {
  const Tag = motion[as];
  const variants = useMemo(() => {
    const preset = REVEAL_PRESETS[variant];
    if (!delay) return preset;
    return { ...preset, visible: { ...preset.visible, transition: { ...preset.visible.transition, delay } } };
  }, [variant, delay]);

  return (
    <Tag variants={variants} initial="hidden" whileInView="visible" viewport={VIEWPORT} className={className} {...props}>
      {children}
    </Tag>
  );
}
