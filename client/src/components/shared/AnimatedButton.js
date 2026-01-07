import { motion } from "framer-motion";

export default function AnimatedButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}