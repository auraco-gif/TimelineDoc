"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

type SubmitState = "idle" | "sending" | "success" | "error";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const firstInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstInputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Trap focus inside panel
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
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
  }, [open, submitState]);

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setEmailError("");
    setSubmitState("idle");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() && !isValidEmail(email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    if (!message.trim()) return;

    setSubmitState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
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
        className="relative bg-white rounded-2xl shadow-page w-full max-w-md px-8 py-8 flex flex-col gap-6"
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

        {submitState === "success" ? (
          /* ── Success state ─────────────────────────────────────────────── */
          <div className="flex flex-col items-center gap-5 py-2 text-center">
            <div>
              <p className="text-sm font-semibold text-neutral-800 mb-1.5">
                Feedback sent
              </p>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Thanks for your message. We&apos;ve received your feedback and
                will use it to improve TimelineDoc.
              </p>
            </div>
            <Button variant="secondary" size="md" onClick={handleClose}>
              Back to app
            </Button>
          </div>
        ) : (
          /* ── Form state ────────────────────────────────────────────────── */
          <>
            <div>
              <h2
                id="feedback-title"
                className="text-base font-semibold text-neutral-900 mb-1"
              >
                Send feedback
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Found a bug, have a suggestion, or want to tell us how you used
                TimelineDoc? Send us a message.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fb-name"
                  className="text-xs font-medium text-neutral-600"
                >
                  Name{" "}
                  <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <input
                  id="fb-name"
                  ref={firstInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className={cn(
                    "w-full text-sm rounded-lg border border-neutral-200",
                    "bg-neutral-50/50 px-3 py-2.5 text-neutral-800",
                    "placeholder:text-neutral-300",
                    "focus:outline-none focus:border-neutral-400 focus:bg-white",
                    "transition-colors duration-150"
                  )}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fb-email"
                  className="text-xs font-medium text-neutral-600"
                >
                  Email{" "}
                  <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-describedby={emailError ? "fb-email-error" : undefined}
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
                  <p id="fb-email-error" className="text-xs text-red-500">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fb-message"
                  className="text-xs font-medium text-neutral-600"
                >
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="fb-message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you think…"
                  rows={4}
                  className={cn(
                    "w-full text-sm rounded-lg border border-neutral-200",
                    "bg-neutral-50/50 px-3 py-2.5 text-neutral-800",
                    "placeholder:text-neutral-300 resize-none",
                    "focus:outline-none focus:border-neutral-400 focus:bg-white",
                    "transition-colors duration-150"
                  )}
                />
              </div>

              {/* Server error */}
              {submitState === "error" && (
                <p className="text-xs text-red-500">
                  Something went wrong. Please try again.
                </p>
              )}

              {/* Actions */}
              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!message.trim() || submitState === "sending"}
                  loading={submitState === "sending"}
                >
                  {submitState === "sending" ? "Sending…" : "Send"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
