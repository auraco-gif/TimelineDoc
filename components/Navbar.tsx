"use client";

import { Upload, FileDown, Share2, Users, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onUploadClick: () => void;
  onExportClick: () => void;
  hasDocument: boolean;
  isExporting: boolean;
}

export function Navbar({
  onUploadClick,
  onExportClick,
  hasDocument,
  isExporting,
}: NavbarProps) {
  return (
    <header className="h-14 border-b border-warm-200 bg-warm-25/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 flex items-center px-5">
      {/* Logo + primary actions (left group) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-warm-900 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3" />
            </svg>
          </div>
          <span className="font-semibold text-warm-900 tracking-tight text-sm">
            TimelineDoc
          </span>
        </div>

        <div className="h-5 w-px bg-warm-200" />

        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" onClick={onUploadClick}>
            <Upload className="h-3.5 w-3.5" />
            Upload Photos
          </Button>
          <Button
            variant="success"
            size="md"
            onClick={onExportClick}
            disabled={!hasDocument}
            loading={isExporting}
          >
            <FileDown className="h-3.5 w-3.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Secondary nav (right group) */}
      <div className="flex items-center gap-1">
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
