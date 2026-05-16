import { motion } from "framer-motion";
import type { ReactNode } from "react";

// 🔥 全局统一动画（改这里所有页面一起变）
const pageVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
  transition: { duration: 0.25, ease: "easeOut" },
};

// 统一包装组件
function AnimatedPage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      {...pageVariants}
      className={`h-full w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;