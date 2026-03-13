"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const USE_CASE_OPTIONS = [
  { value: "immigration", label: "Immigration / Visa application" },
  { value: "relationship", label: "Relationship or marriage evidence" },
  { value: "legal", label: "Legal or official documentation" },
  { value: "personal", label: "Personal timeline / memories" },
  { value: "other", label: "Other" },
];

interface ExportLeadModalProps {
  open: boolean;
  onClose: () => void;
  onDownload: (email: string, useCase: string) => void;
}

export function ExportLeadModal({ open, onClose, onDownload }: ExportLeadModalProps) {
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("");
  const [emailError, setEmailError] = useState("");

  const firstInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstInputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (window.document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (window.document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    panel.addEventListener("keydown", trap);
    return () => panel.removeEventListener("keydown", trap);
  }, [open]);

  const reset = () => {
    setEmail("");
    setUseCase("");
    setEmailError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDownload = () => {
    const emailTrimmed = email.trim();
    if (emailTrimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    onDownload(emailTrimmed, useCase);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-lead-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative bg-white rounded-2xl shadow-page w-full max-w-sm px-8 py-8 flex flex-col gap-6"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className={cn(
            "absolute top-5 right-5 p-0.5 rounded-md",
            "text-neutral-400 hover:text-neutral-700 transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          )}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div>
          <h2
            id="export-lead-title"
            className="text-base font-semibold text-neutral-900 mb-1"
          >
            Export your PDF
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Optionally leave your email to get product updates and future
            improvements.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="export-email"
              className="text-xs font-medium text-neutral-600"
            >
              Email{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              id="export-email"
              ref={firstInputRef}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              aria-describedby={emailError ? "export-email-error" : undefined}
              className={cn(
                "w-full text-sm rounded-lg border",
                "bg-neutral-50/50 px-3 py-2.5 text-neutral-800",
                "placeholder:text-neutral-300",
                "focus:outline-none focus:bg-white transition-colors duration-150",
                emailError
                  ? "border-red-300 focus:border-red-400"
                  : "border-neutral-200 focus:border-neutral-400"
              )}
            />
            {emailError && (
              <p id="export-email-error" className="text-xs text-red-500">
                {emailError}
              </p>
            )}
          </div>

          {/* Use case */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="export-use-case"
              className="text-xs font-medium text-neutral-600"
            >
              What are you using this for?{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <select
              id="export-use-case"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className={cn(
                "w-full text-sm rounded-lg border border-neutral-200",
                "bg-neutral-50/50 px-3 py-2.5",
                "focus:outline-none focus:border-neutral-400 focus:bg-white",
                "transition-colors duration-150 cursor-pointer",
                useCase ? "text-neutral-800" : "text-neutral-300"
              )}
            >
              <option value="" disabled>
                Select a use case…
              </option>
              {USE_CASE_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="text-neutral-800"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Helper */}
          <p className="text-xs text-neutral-400 leading-relaxed -mt-1">
            Your PDF will still download even if you skip this step.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleDownload}>
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
