import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        "--mouse-x": `${mousePosition.x}px`,
        "--mouse-y": `${mousePosition.y}px`,
      } as React.CSSProperties}
      className={cn(
        "group relative w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200",
        containerClassName
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)`,
        }}
      />
      <motion.div
        animate={{
          x: mousePosition.x / 8,
          y: mousePosition.y / 8,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
        }}
        className={cn("relative z-10", className)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

