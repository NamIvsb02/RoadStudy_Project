import { useId } from "react";
import { motion } from "framer-motion";
import { pathDraw, VIEWPORT } from "../../constants/motion";

const SHAPES = {
  hero: { viewBox: "0 0 800 400", d: "M0 340 C 180 340, 200 120, 400 160 S 640 320, 800 60" },
  wide: { viewBox: "0 0 1000 400", d: "M0 200 C 200 40, 300 360, 500 200 S 750 40, 1000 200" },
  vertical: { viewBox: "0 0 200 800", d: "M100 0 C 20 140, 180 260, 100 400 S 20 660, 100 800" },
};

export default function RoadPath({ variant = "hero", hideOnMobile = true, className = "text-primary-200" }) {
  const maskId = useId();
  const { viewBox, d } = SHAPES[variant];

  return (
    <motion.svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio="none"
      fill="none"
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={`pointer-events-none ${hideOnMobile ? "hidden md:block" : ""} ${className}`}
    >
      <mask id={maskId} maskUnits="userSpaceOnUse">
        <motion.path d={d} stroke="white" strokeWidth="12" strokeLinecap="round" variants={pathDraw} />
      </mask>
      <path d={d} mask={`url(#${maskId})`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 12" />
    </motion.svg>
  );
}
