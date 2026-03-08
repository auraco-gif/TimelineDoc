import { DocumentPage as DocumentPageType } from "@/types/document";
import { PhotoGrid } from "@/components/PhotoGrid";

interface DocumentPageProps {
  page: DocumentPageType;
  pageNumber: number;
  totalPages: number;
  onDescriptionChange: (sectionId: string, value: string) => void;
  refCallback: (el: HTMLDivElement | null) => void;
}

export function DocumentPage({
  page,
  pageNumber,
  totalPages,
  onDescriptionChange,
  refCallback,
}: DocumentPageProps) {
  return (
    // Letter proportions rendered at 680px wide for screen preview
    // Actual PDF export captures this DOM node at 2× scale → 1360px → 8.5in
    <div
      ref={refCallback}
      className="bg-white shadow-page page-enter"
      style={{
        width: 680,
        minHeight: 880,
        padding: "56px 64px 48px",
        boxSizing: "border-box",
        position: "relative",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Date header — first page of section */}
      <div className="mb-6 pb-4 border-b border-neutral-200">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
          {page.isFirstInSection ? "Date" : "Date (continued)"}
        </p>
        <h2 className="text-xl font-semibold text-neutral-900 leading-tight">
          {page.dateLabel}
        </h2>
      </div>

      {/* Photo grid */}
      <div className="mb-6">
        <PhotoGrid photos={page.photoBlock.photos} />
      </div>

      {/* Description — only on first page of each section */}
      {page.isFirstInSection && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
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
        style={{ position: "absolute", bottom: 24, right: 32 }}
        className="text-[10px] text-neutral-300 tabular-nums"
      >
        {pageNumber} / {totalPages}
      </div>
    </div>
  );
}
