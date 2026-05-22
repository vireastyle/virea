"use client";
import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Distance to slide from (px). Default 28 */
  y?: number;
}

export function FadeIn({ children, delay = 0, className, style, y = 28 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{
        duration: motionTokens.duration.emphasis,
        delay,
        ease: motionTokens.easing.decelerate,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
