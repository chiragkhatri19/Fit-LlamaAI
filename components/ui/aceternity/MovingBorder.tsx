import React from "react";
import { cn } from "../../../lib/utils";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "moving-border";
  }
>(({ className, variant = "default", children, ...props }, ref) => {
  if (variant === "moving-border") {
    return (
      <button
        className={cn(
          "relative inline-flex h-12 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950",
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#0ea5e9_50%,#3b82f6_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-white dark:bg-slate-950 px-6 sm:px-8 py-3 min-h-[44px] text-sm font-semibold text-slate-900 dark:text-slate-100 backdrop-blur-xl">
          {children}
        </span>
      </button>
    );
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 sm:px-8 py-3 min-h-[44px] text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

