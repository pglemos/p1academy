"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export function Reveal(props: HTMLMotionProps<"div">) {
  const { children, ...rest } = props;
  const reduceMotion = useReducedMotion();
  // Failsafe: if the in-view trigger never fires (slow JS, observer miss,
  // bfcache restore), force the content visible shortly after mount so a
  // section can never get stuck invisible.
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceVisible(true), 900);
    return () => clearTimeout(timer);
  }, []);

  if (reduceMotion) {
    return <motion.div {...rest}>{children}</motion.div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={forceVisible ? { opacity: 1, y: 0 } : undefined}
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
