"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function Reveal(props: HTMLMotionProps<"div">) {
  const { children, ...rest } = props;

  return (
    <motion.div
      // Content must remain visible during hydration and when the observer is
      // delayed or unavailable. Motion is progressive enhancement here.
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
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
