"use client";

import { TimelineDocument } from "@/types/document";
import { getAllPages, updateSectionDescription } from "@/lib/layout";
import { DocumentPage } from "@/components/DocumentPage";
import { UploadZone } from "@/components/UploadZone";
import { Spinner } from "@/components/ui/Spinner";

interface DocumentCanvasProps {
  document: TimelineDocument | null;
  isProcessing: boolean;
  // When true, pages must remain mounted so pdf.ts can query and capture them.
  // The pdf.ts overlay covers the screen, so the user never sees the pages during export.
  isExporting: boolean;
  processingLabel?: string;
  processingProgress?: { current: number; total: number };
  onFilesSelected: (files: File[]) => void;
  onDocumentChange: (doc: TimelineDocument) => void;
  onFeedbackClick: () => void;
  // pageRefsRef intentionally removed — PDF export uses querySelectorAll('[data-export-page]')
}

export function DocumentCanvas({
  document,
  isProcessing,
  isExporting,
  processingLabel,
  processingProgress,
  onFilesSelected,
  onDocumentChange,
  onFeedbackClick,
}: DocumentCanvasProps) {
  const handleDescriptionChange = (sectionId: string, value: string) => {
    if (!document) return;
    onDocumentChange(updateSectionDescription(document, sectionId, value));
  };

  const handleAddMore = () => {
    const input = window.document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) onFilesSelected(Array.from(files));
    };
    input.click();
  };

  const pages = document ? getAllPages(document) : [];
  const totalPages = pages.length;

  return (
    // overflow-auto supports both vertical scroll and horizontal scroll on narrow screens
    <div className="flex-1 bg-[#f0f0ef] overflow-auto">
      <div className="flex flex-col items-center py-12 px-6 gap-8 min-h-full">

        {/* Processing state */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-4 py-20 w-full max-w-sm">
            <Spinner size="lg" />
            <p className="text-sm text-neutral-500">
              {processingLabel ?? "Processing photos…"}
            </p>
            {processingProgress && processingProgress.total > 0 && (
              <div className="w-full bg-neutral-200 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-neutral-700 h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (processingProgress.current / processingProgress.total) * 100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isProcessing && !document && (
          <div className="flex flex-col items-center gap-9 py-14 w-full max-w-lg">

            {/* Hero */}
            <div className="text-center space-y-2.5">
              <h1 className="text-2xl font-semibold text-neutral-800 tracking-tight">
                Turn your photos into a clean timeline PDF
              </h1>
              <p className="text-sm text-neutral-400 max-w-[340px] mx-auto leading-relaxed">
                Upload photos, auto-sort them by date, and generate a printable
                PDF for visa, immigration, or relationship evidence.
              </p>
            </div>

            {/* Upload zone */}
            <UploadZone onFiles={onFilesSelected} isProcessing={false} />

            {/* Privacy line */}
            <p className="text-[11px] text-neutral-400 leading-relaxed text-center max-w-[320px]">
              Private by default — your photos are used only to generate your
              PDF and are not publicly shared.
            </p>

            {/* Technical hints */}
            <div className="flex items-center gap-4 text-[11px] text-neutral-300">
              <span>JPG · PNG</span>
              <span>·</span>
              <span>EXIF date extraction</span>
              <span>·</span>
              <span>50–200 photos</span>
              <span>·</span>
              <span>Letter size PDF</span>
            </div>

            {/* Use cases */}
            <div className="flex flex-col items-center gap-3 w-full">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-300">
                Perfect for
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Immigration evidence",
                  "Visa application documents",
                  "Relationship / marriage timeline",
                  "Personal records",
                ].map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium text-neutral-500 bg-white border border-neutral-200"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer className="flex items-center gap-4 text-[11px] text-neutral-400 pt-2">
              <button
                onClick={onFeedbackClick}
                className="hover:text-neutral-600 transition-colors underline underline-offset-2"
              >
                Send feedback
              </button>
              <span className="text-neutral-200">·</span>
              <a
                href="mailto:auraco.helpdesk@gmail.com"
                className="hover:text-neutral-600 transition-colors underline underline-offset-2"
              >
                Contact
              </a>
            </footer>

          </div>
        )}

        {/* Document pages — each has data-export-page="true" for PDF export.
            Pages must stay mounted during export (isExporting) even though
            isProcessing is also true then — pdf.ts needs them in the DOM. */}
        {(!isProcessing || isExporting) &&
          document &&
          pages.map((page, idx) => (
            <DocumentPage
              key={page.id}
              page={page}
              pageNumber={idx + 1}
              totalPages={totalPages}
              onDescriptionChange={handleDescriptionChange}
            />
          ))}

        {/* Add more photos */}
        {(!isProcessing || isExporting) && document && (
          <div className="pb-6">
            <button
              onClick={handleAddMore}
              className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors underline underline-offset-2"
            >
              + Add more photos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
