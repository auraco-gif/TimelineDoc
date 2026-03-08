"use client";

import { useCallback, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DocumentCanvas } from "@/components/DocumentCanvas";
import { extractAllPhotos, revokePhotoUrls } from "@/lib/metadata";
import { buildDocument } from "@/lib/layout";
import { exportToPDF } from "@/lib/pdf";
import type { TimelineDocument } from "@/types/document";
import type { Photo } from "@/types/document";

type ProcessingState =
  | { status: "idle" }
  | { status: "extracting"; progress: number; total: number }
  | { status: "building" }
  | { status: "exporting"; progress: number; total: number };

export default function Home() {
  const [doc, setDoc] = useState<TimelineDocument | null>(null);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>({ status: "idle" });

  // Ordered list of DOM elements for each page — populated by DocumentCanvas
  const pageRefsRef = useRef<HTMLElement[]>([]);
  // Hidden file input for navbar upload button
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProcessing = processing.status !== "idle";
  const isExporting = processing.status === "exporting";

  const processingLabel = (() => {
    switch (processing.status) {
      case "extracting":
        return `Reading photo dates… (${processing.progress}/${processing.total})`;
      case "building":
        return "Generating document pages…";
      case "exporting":
        return `Exporting PDF… (${processing.progress}/${processing.total})`;
      default:
        return undefined;
    }
  })();

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setProcessing({ status: "extracting", progress: 0, total: files.length });

      try {
        // Extract metadata in batches to keep UI responsive for large uploads
        const BATCH = 20;
        const extracted: Photo[] = [];
        for (let i = 0; i < files.length; i += BATCH) {
          const batch = files.slice(i, i + BATCH);
          const photos = await extractAllPhotos(batch);
          extracted.push(...photos);
          setProcessing({
            status: "extracting",
            progress: Math.min(i + BATCH, files.length),
            total: files.length,
          });
        }

        setProcessing({ status: "building" });

        // Merge with any previously uploaded photos
        const merged = [...allPhotos, ...extracted];

        // Small delay so "building" label is visible
        await new Promise((r) => setTimeout(r, 50));

        const newDoc = buildDocument(merged);

        setAllPhotos(merged);
        setDoc(newDoc);
      } catch (err) {
        console.error("Failed to process photos:", err);
      } finally {
        setProcessing({ status: "idle" });
      }
    },
    [allPhotos]
  );

  const handleExport = useCallback(async () => {
    const refs = pageRefsRef.current;
    if (refs.length === 0) return;

    setProcessing({ status: "exporting", progress: 0, total: refs.length });

    try {
      await exportToPDF(refs, {
        filename: "timeline-evidence.pdf",
        scale: 2,
        onProgress: (current, total) => {
          setProcessing({ status: "exporting", progress: current, total });
        },
      });
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setProcessing({ status: "idle" });
    }
  }, []);

  const handleReset = useCallback(() => {
    revokePhotoUrls(allPhotos);
    setAllPhotos([]);
    setDoc(null);
    pageRefsRef.current = [];
  }, [allPhotos]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Fixed top navigation */}
      {/* Hidden global file input — triggered by navbar Upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) handleFiles(Array.from(files));
          e.target.value = "";
        }}
      />

      <Navbar
        onUploadClick={() => fileInputRef.current?.click()}
        onExportClick={handleExport}
        hasDocument={!!doc && !isProcessing}
        isExporting={isExporting}
      />

      {/* Main content — occupies remaining height below navbar */}
      <main className="flex flex-col pt-14 h-full overflow-hidden">
        {/* Future: left panel slot */}
        {/* <LeftPanel /> */}

        <DocumentCanvas
          document={doc}
          isProcessing={isProcessing}
          processingLabel={processingLabel}
          processingProgress={
            processing.status === "extracting" || processing.status === "exporting"
              ? { current: processing.progress, total: processing.total }
              : undefined
          }
          onFilesSelected={handleFiles}
          onDocumentChange={setDoc}
          pageRefsRef={pageRefsRef}
        />

        {/* Future: right panel slot */}
        {/* <RightPanel /> */}
      </main>

      {/* Status bar — shows photo count when document exists */}
      {doc && !isProcessing && (
        <div className="h-7 border-t border-neutral-200 bg-white/80 backdrop-blur-sm flex items-center px-5 gap-4 shrink-0">
          <span className="text-[11px] text-neutral-400 tabular-nums">
            {allPhotos.length} photo{allPhotos.length !== 1 ? "s" : ""}
          </span>
          <span className="text-neutral-200">·</span>
          <span className="text-[11px] text-neutral-400 tabular-nums">
            {doc.sections.length} date{doc.sections.length !== 1 ? "s" : ""}
          </span>
          <span className="text-neutral-200">·</span>
          <span className="text-[11px] text-neutral-400 tabular-nums">
            {doc.sections.reduce((sum, s) => sum + s.pages.length, 0)} page
            {doc.sections.reduce((sum, s) => sum + s.pages.length, 0) !== 1 ? "s" : ""}
          </span>
          <span className="flex-1" />
          <button
            onClick={handleReset}
            className="text-[11px] text-neutral-400 hover:text-red-500 transition-colors"
          >
            Clear document
          </button>
        </div>
      )}
    </div>
  );
}
