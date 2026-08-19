import { motion } from "framer-motion";
import { fadeInUp } from "./motionUtils.js";
import useReducedMotion from "../../hooks/useReducedMotion.js";

// Small scroll-reveal wrapper used across sections. Uses viewport-based
// whileInView so it works without any manual IntersectionObserver wiring,
// and collapses to an instant appearance when reduced motion is requested.
export default function Reveal({ children, className, delay = 0 }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      custom={delay}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
