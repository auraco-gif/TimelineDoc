"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUPPORT_LINKS, SUPPORT_TIERS } from "@/lib/config";

export function SponsorButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating pill button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Sponsor TimelineDoc"
        className={cn(
          "fixed bottom-6 right-6 z-40",
          "px-4 py-2 rounded-full text-sm font-semibold text-white",
          "bg-terracotta-500 hover:bg-terracotta-600",
          "shadow-md hover:shadow-lg active:scale-95",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracotta-500"
        )}
      >
        Sponsor
      </button>

      {/* Sponsor modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sponsor-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-page w-full max-w-xs px-8 py-8 flex flex-col gap-5">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className={cn(
                "absolute top-5 right-5 p-0.5 rounded-md",
                "text-neutral-400 hover:text-neutral-700 transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              )}
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <p
                id="sponsor-modal-title"
                className="text-base font-semibold text-neutral-900 mb-1"
              >
                Sponsor TimelineDoc
              </p>
              <p className="text-sm text-neutral-500 leading-relaxed">
                TimelineDoc is free during MVP. If it helped you, any support
                is appreciated.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {SUPPORT_TIERS.map((tier) => {
                const href = SUPPORT_LINKS[tier.hrefKey];
                return (
                  <a
                    key={tier.label}
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!href) e.preventDefault();
                    }}
                    className={cn(
                      "text-center text-sm font-medium py-2.5 px-4 rounded-lg border",
                      "border-[#FFB800]/40 text-[#7A5500]",
                      "hover:bg-[#FFB800]/10 transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800]",
                      !href && "opacity-40 pointer-events-none"
                    )}
                    style={{ backgroundColor: "rgba(255,184,0,0.05)" }}
                  >
                    {tier.label}
                  </a>
                );
              })}
            </div>

            {SUPPORT_LINKS.feedback && (
              <a
                href={SUPPORT_LINKS.feedback}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
              >
                Leave feedback instead
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
