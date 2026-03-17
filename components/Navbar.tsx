"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Upload, FileDown, Share2, Users, LayoutTemplate, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onUploadClick: () => void;
  onExportClick: () => void;
  hasDocument: boolean;
  isExporting: boolean;
}

const EXAMPLE_LINKS = [
  { label: "Relationship Evidence Example", href: "/example/relationship-evidence" },
];

export function Navbar({
  onUploadClick,
  onExportClick,
  hasDocument,
  isExporting,
}: NavbarProps) {
  const [examplesOpen, setExamplesOpen] = useState(false);
  const examplesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (examplesRef.current && !examplesRef.current.contains(e.target as Node)) {
        setExamplesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="h-[76px] border-b border-warm-200 bg-warm-25/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 flex items-center px-5">
      {/* Logo + primary actions (left group) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          {/* Soft terracotta logo mark */}
          <div className="w-6 h-6 rounded bg-terracotta-100 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="#C67B5C" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#C67B5C" opacity="0.6" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="#C67B5C" opacity="0.6" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="#C67B5C" opacity="0.3" />
            </svg>
          </div>
          <span className="font-semibold text-warm-900 tracking-tight text-sm">
            TimelineDoc
          </span>
        </div>

        <div className="h-5 w-px bg-warm-200" />

        <div className="flex items-center gap-2">
          {/* Upload — always active */}
          <Button
            variant="primary"
            size="md"
            onClick={onUploadClick}
            className="h-14 px-5 rounded-2xl leading-tight gap-3"
          >
            <Upload className="h-3.5 w-3.5 shrink-0" />
            Upload Photos
          </Button>

          {/* Export — same shape; distinct muted tone when inactive */}
          <Button
            variant="success"
            size="md"
            onClick={onExportClick}
            disabled={!hasDocument}
            loading={isExporting}
            className="h-14 px-5 rounded-2xl leading-tight gap-3 disabled:bg-[#DFC5B8] disabled:opacity-100 disabled:text-white/90"
          >
            <FileDown className="h-3.5 w-3.5 shrink-0" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Secondary nav (right group) */}
      <div className="flex items-center gap-1">
        {/* Examples dropdown */}
        <div
          ref={examplesRef}
          className="relative"
          onMouseEnter={() => setExamplesOpen(true)}
          onMouseLeave={() => setExamplesOpen(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExamplesOpen((v) => !v)}
            className="text-warm-500 gap-1"
          >
            Examples
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-150 ${examplesOpen ? "rotate-180" : ""}`}
            />
          </Button>

          {examplesOpen && (
            <div className="absolute right-0 top-full mt-1 w-60 bg-[#FFFDFC] border border-warm-200 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1.5 z-50">
              {EXAMPLE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setExamplesOpen(false)}
                  className="block px-4 py-2.5 text-sm text-warm-700 hover:text-warm-900 hover:bg-warm-100 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled
          title="Coming soon"
          className="text-warm-500"
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
          Templates
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled
          title="Coming soon"
          className="text-warm-500"
        >
          <Users className="h-3.5 w-3.5" />
          Collaborators
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled
          title="Coming soon"
          className="text-warm-500"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </header>
  );
}
