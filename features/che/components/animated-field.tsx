"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/shared/motion/presets";

type AnimatedFieldProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedField({ children, className = "" }: AnimatedFieldProps) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
