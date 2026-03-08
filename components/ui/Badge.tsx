import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "muted" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        variant === "default" && "bg-neutral-900 text-white",
        variant === "muted" && "bg-neutral-100 text-neutral-500",
        variant === "outline" && "border border-neutral-200 text-neutral-600",
        className
      )}
      {...props}
    />
  );
}
