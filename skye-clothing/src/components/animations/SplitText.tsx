"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  as: Tag = "h2",
}: SplitTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const words = text.split(" ");

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
