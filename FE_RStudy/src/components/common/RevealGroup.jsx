import { Children } from "react";
import { motion } from "framer-motion";
import { REVEAL_PRESETS, STAGGER, staggerOf, VIEWPORT } from "../../constants/motion";

export default function RevealGroup({
  as = "div",
  variant = "fadeUp",
  stagger = STAGGER.base,
  delayChildren = 0,
  trigger = "view",
  className = "",
  itemClassName = "",
  children,
  ...props
}) {
  const Tag = motion[as];
  const viewProps = trigger === "view" ? { whileInView: "visible", viewport: VIEWPORT } : { animate: "visible" };

  return (
    <Tag variants={staggerOf(stagger, delayChildren)} initial="hidden" className={className} {...viewProps} {...props}>
      {Children.map(children, (child) =>
        child == null || child === false ? null : (
          <motion.div variants={REVEAL_PRESETS[variant]} className={itemClassName}>
            {child}
          </motion.div>
        ),
      )}
    </Tag>
  );
}
