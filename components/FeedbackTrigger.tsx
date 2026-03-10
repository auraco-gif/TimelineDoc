"use client";

import { useState } from "react";
import { FeedbackModal } from "@/components/FeedbackModal";
import { cn } from "@/lib/utils";

interface FeedbackTriggerProps {
  className?: string;
}

/**
 * Self-contained feedback trigger.
 * Owns the modal open/close state — no prop-drilling required.
 * Drop anywhere; works in any component tree.
 */
export function FeedbackTrigger({ className }: FeedbackTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          console.log("[FeedbackTrigger] clicked — opening modal");
          setOpen(true);
        }}
        className={cn(
          "hover:text-neutral-600 transition-colors underline underline-offset-2",
          className
        )}
      >
        Send feedback
      </button>

      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
