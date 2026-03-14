"use client";

import { useEffect, useRef } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SUPPORT_LINKS, SUPPORT_TIERS } from "@/lib/config";
import { triggerPDFDownload } from "@/lib/pdf";

interface ExportSuccessModalProps {
  open: boolean;
  blob: Blob | null;
  filename: string;
  onClose: () => void;
}

export function ExportSuccessModal({
  open,
  blob,
  filename,
  onClose,
}: ExportSuccessModalProps) {
  const downloadBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => downloadBtnRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleDownload = () => {
    if (!blob) return;
    triggerPDFDownload(blob, filename);
  };

  if (!open || !blob) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-success-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-page w-full max-w-sm overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "absolute top-5 right-5 p-0.5 rounded-md z-10",
            "text-neutral-400 hover:text-neutral-700 transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          )}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top section — ready state */}
        <div className="px-8 pt-8 pb-6">
          <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center mb-4">
            <Download className="h-3.5 w-3.5 text-white" />
          </div>
          <h2
            id="export-success-title"
            className="text-base font-semibold text-neutral-900 mb-1"
          >
            Your timeline PDF is ready
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            TimelineDoc is free during MVP. If it saved you time, consider
            supporting the project.
          </p>
          <Button
            ref={downloadBtnRef}
            variant="primary"
            size="md"
            className="w-full mt-5"
            onClick={handleDownload}
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-100 mx-0" />

        {/* Support section */}
        <div className="px-8 py-6 flex flex-col gap-3">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Support the project
          </p>

          <div className="flex gap-2">
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
                    "flex-1 text-center text-xs font-medium py-2 px-1 rounded-lg border",
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

          {/* Footer links */}
          <div className="flex items-center justify-between pt-1">
            {SUPPORT_LINKS.feedback ? (
              <a
                href={SUPPORT_LINKS.feedback}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
              >
                Leave feedback
              </a>
            ) : (
              <span />
            )}
            <button
              onClick={onClose}
              className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
