import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
  ];

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
      style={{
        maskImage: "radial-gradient(ellipse at center, transparent 20%, black)",
        WebkitMaskImage: "radial-gradient(ellipse at center, transparent 20%, black)",
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="gradient"
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
          >
            <stop stopColor="rgba(59, 130, 246, 0.3)" stopOpacity="0" />
            <stop stopColor="rgba(59, 130, 246, 0.5)" stopOpacity="0.5" />
            <stop stopColor="rgba(14, 165, 233, 0.3)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke="url(#gradient)"
            strokeOpacity="0.4"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: index * 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

