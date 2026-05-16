"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function Reveal(props: HTMLMotionProps<"div">) {
  const { children, ...rest } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Lift(props: HTMLMotionProps<"div">) {
  const { children, ...rest } = props;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
