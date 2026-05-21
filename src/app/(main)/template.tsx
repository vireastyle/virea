"use client";

import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

export default function MainTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: motionTokens.duration.emphasis,
        ease: motionTokens.easing.decelerate,
      }}
    >
      {children}
    </motion.div>
  );
}
