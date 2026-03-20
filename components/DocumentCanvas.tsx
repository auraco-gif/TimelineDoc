"use client";

import { TimelineDocument } from "@/types/document";
import { getAllPages, updateSectionDescription } from "@/lib/layout";
import { DocumentPage } from "@/components/DocumentPage";
import { UploadZone } from "@/components/UploadZone";
import { Spinner } from "@/components/ui/Spinner";
import { FeedbackTrigger } from "@/components/FeedbackTrigger";

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
    <div className="flex-1 bg-warm-50 overflow-auto">
      <div className="flex flex-col items-center py-12 px-6 gap-8 min-h-full">

        {/* Processing state */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-4 py-20 w-full max-w-sm">
            <Spinner size="lg" />
            <p className="text-sm text-warm-600">
              {processingLabel ?? "Processing photos…"}
            </p>
            {processingProgress && processingProgress.total > 0 && (
              <div className="w-full bg-warm-200 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-terracotta-500 h-1 rounded-full transition-all duration-300"
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
          <div className="flex flex-col items-center gap-8 py-16 w-full max-w-lg">

            {/* Hero */}
            <div className="text-center space-y-2.5">
              <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">
                <span className="text-terracotta-500">TimelineDoc</span>
                {" "}–{" "}
                Create Relationship Timeline for Immigration Evidence
              </h1>
              <p className="text-sm text-warm-600 max-w-[400px] mx-auto leading-relaxed">
                Upload photos, organize relationship evidence, and generate a
                clean timeline PDF for I-130, spouse visa, and immigration
                applications.
              </p>
            </div>

            {/* Upload zone */}
            <UploadZone onFiles={onFilesSelected} isProcessing={false} />

            {/* Privacy line */}
            <p className="text-[11px] text-warm-500 leading-relaxed text-center max-w-[320px]">
              Private by default — your photos are used only to generate your
              PDF and are not publicly shared.
            </p>

            {/* SEO content */}
            <div className="w-full max-w-[480px] border-t border-warm-200 pt-8 space-y-3 text-center">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-warm-400">
                How to organize relationship evidence for immigration
              </h2>
              <p className="text-xs text-warm-500 leading-relaxed">
                Organizing relationship evidence for immigration applications
                like I-130 or spouse visas can be time-consuming. Many
                applicants need to present photos, travel records, and
                milestones in a clear and structured format.
              </p>
              <p className="text-xs text-warm-500 leading-relaxed">
                TimelineDoc automatically sorts your photos by date and
                generates a clean timeline PDF that makes your evidence easy
                to review.
              </p>
            </div>

            {/* Footer */}
            <footer className="flex items-center gap-4 text-[11px] text-warm-500 pt-2">
              <FeedbackTrigger className="text-[11px] text-warm-500" />
              <span className="text-warm-200">·</span>
              <a
                href="mailto:auraco.helpdesk@gmail.com"
                className="hover:text-warm-900 transition-colors underline underline-offset-2"
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
              className="text-xs text-warm-500 hover:text-warm-900 transition-colors underline underline-offset-2"
            >
              + Add more photos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
