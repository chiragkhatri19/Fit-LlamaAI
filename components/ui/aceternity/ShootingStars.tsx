import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

export const ShootingStars = ({ className }: { className?: string }) => {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 1.5 + Math.random() * 2.5,
    size: 1 + Math.random() * 2,
  }));

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 4}px rgba(59, 130, 246, 0.8)`,
          }}
          animate={{
            x: [0, Math.random() * 400 - 200],
            y: [0, Math.random() * 400 - 200],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: 4 + Math.random() * 3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

