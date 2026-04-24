import { motion } from "framer-motion";

export default function Skeleton({ width = "100%", height = "20px", className = "" }) {
  return (
    <motion.div
      className={`skeleton ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
