import { DocumentPage as DocumentPageType } from "@/types/document";
import { PhotoGrid } from "@/components/PhotoGrid";

interface DocumentPageProps {
  page: DocumentPageType;
  pageNumber: number;
  totalPages: number;
  onDescriptionChange: (sectionId: string, value: string) => void;
}

export function DocumentPage({
  page,
  pageNumber,
  totalPages,
  onDescriptionChange,
}: DocumentPageProps) {
  return (
    // True letter size: 816 × 1056 px (8.5" × 11" at 96 dpi)
    // data-export-page is queried by lib/pdf.ts via querySelectorAll
    // shadow-page and page-enter are preview-only; the exporter strips them from the clone
    <div
      data-export-page="true"
      className="document-page bg-white shadow-page page-enter"
      style={{
        width: 816,
        minHeight: 1056,
        padding: "68px 80px 60px",
        boxSizing: "border-box",
        position: "relative",
        fontFamily: "Inter, system-ui, sans-serif",
        flexShrink: 0,
      }}
    >
      {/* Date header */}
      <div className="mb-6 pb-5 border-b border-neutral-200">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
          {page.isFirstInSection ? "Date" : "Date (continued)"}
        </p>
        <h2 className="text-2xl font-semibold text-neutral-900 leading-tight">
          {page.dateLabel}
        </h2>
      </div>

      {/* Photo grid */}
      <div className="mb-7">
        <PhotoGrid photos={page.photoBlock.photos} />
      </div>

      {/* Description — only on first page of each section */}
      {page.isFirstInSection && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
            Description
          </p>
          <textarea
            value={page.textBlock.content}
            onChange={(e) => onDescriptionChange(page.sectionId, e.target.value)}
            placeholder="Add a short description of this day's events…"
            rows={3}
            className="w-full resize-none text-sm text-neutral-700 placeholder:text-neutral-300
                       leading-relaxed border border-neutral-100 rounded-lg px-3 py-2.5
                       bg-neutral-50/50 focus:outline-none focus:border-neutral-300
                       focus:bg-white transition-colors duration-150"
          />
        </div>
      )}

      {/* Page number */}
      <div
        style={{ position: "absolute", bottom: 28, right: 40 }}
        className="text-[10px] text-neutral-300 tabular-nums"
      >
        {pageNumber} / {totalPages}
      </div>
    </div>
  );
}
