"use client";

import { useCallback, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DocumentCanvas } from "@/components/DocumentCanvas";
import { FeedbackTrigger } from "@/components/FeedbackTrigger";
import { ExportLeadModal } from "@/components/ExportLeadModal";
import { ExportSuccessModal } from "@/components/ExportSuccessModal";
import { SponsorButton } from "@/components/SponsorButton";
import { extractAllPhotos, revokePhotoUrls } from "@/lib/metadata";
import { buildDocument } from "@/lib/layout";
import { buildPDFBlob } from "@/lib/pdf";
import type { TimelineDocument } from "@/types/document";
import type { Photo } from "@/types/document";

type ProcessingState =
  | { status: "idle" }
  | { status: "extracting"; progress: number; total: number }
  | { status: "building" }
  | { status: "exporting"; progress: number; total: number };

function waitForPaint(frames = 2): Promise<void> {
  return new Promise((resolve) => {
    let count = 0;
    const tick = () => {
      if (++count >= frames) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

export default function Home() {
  const [doc, setDoc] = useState<TimelineDocument | null>(null);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>({ status: "idle" });

  // Export flow state
  const [exportLeadOpen, setExportLeadOpen] = useState(false);
  const [exportSuccessOpen, setExportSuccessOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const PDF_FILENAME = "timeline-evidence.pdf";

  // Hidden file input — triggered by navbar Upload button
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

        const merged = [...allPhotos, ...extracted];
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

  // Step 1: user clicks "Generate PDF" in ExportLeadModal
  const handleGenerate = useCallback(async (email: string, useCase: string) => {
    // Close lead modal immediately
    setExportLeadOpen(false);

    // Fire-and-forget lead submission — never blocks the download
    if (email || useCase) {
      console.log("[lead] submit start", { email, useCase });
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, use_case: useCase }),
      })
        .then((r) => r.json())
        .then((result) => console.log("[lead] submit response", result))
        .catch((err) => console.warn("[lead] submit fetch error", err));
    }

    // Wait for React to settle, then query the live page elements
    await waitForPaint(2);

    const pageElements = Array.from(
      window.document.querySelectorAll<HTMLElement>('[data-export-page="true"]')
    );

    if (pageElements.length === 0) {
      console.warn("PDF export: no [data-export-page] elements found.");
      return;
    }

    setProcessing({ status: "exporting", progress: 0, total: pageElements.length });

    try {
      const blob = await buildPDFBlob(pageElements, {
        scale: 2,
        onProgress: (current, total) => {
          setProcessing({ status: "exporting", progress: current, total });
        },
      });
      // Store blob and open success modal — download triggered by user click
      setPdfBlob(blob);
      setExportSuccessOpen(true);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setProcessing({ status: "idle" });
    }
  }, []);

  // Step 3: user closes success modal — clean up blob
  const handleSuccessClose = useCallback(() => {
    setExportSuccessOpen(false);
    setPdfBlob(null);
  }, []);

  const handleReset = useCallback(() => {
    revokePhotoUrls(allPhotos);
    setAllPhotos([]);
    setDoc(null);
  }, [allPhotos]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
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
        onExportClick={() => setExportLeadOpen(true)}
        hasDocument={!!doc && !isProcessing}
        isExporting={isExporting}
      />

      <ExportLeadModal
        open={exportLeadOpen}
        onClose={() => setExportLeadOpen(false)}
        onGenerate={handleGenerate}
      />

      <ExportSuccessModal
        open={exportSuccessOpen}
        blob={pdfBlob}
        filename={PDF_FILENAME}
        onClose={handleSuccessClose}
      />

      {/* Main content — occupies remaining height below navbar */}
      <main className="flex flex-col pt-14 h-full overflow-hidden">
        {/* Future: left panel slot */}
        {/* <LeftPanel /> */}

        <DocumentCanvas
          document={doc}
          isProcessing={isProcessing}
          isExporting={isExporting}
          processingLabel={processingLabel}
          processingProgress={
            processing.status === "extracting" || processing.status === "exporting"
              ? { current: processing.progress, total: processing.total }
              : undefined
          }
          onFilesSelected={handleFiles}
          onDocumentChange={setDoc}
        />

        {/* Future: right panel slot */}
        {/* <RightPanel /> */}
      </main>

      <SponsorButton />

      {/* Status bar */}
      {doc && !isProcessing && (
        <div className="h-7 border-t border-warm-200 bg-warm-25/80 backdrop-blur-sm flex items-center px-5 gap-4 shrink-0">
          <span className="text-[11px] text-warm-500 tabular-nums">
            {allPhotos.length} photo{allPhotos.length !== 1 ? "s" : ""}
          </span>
          <span className="text-warm-200">·</span>
          <span className="text-[11px] text-warm-500 tabular-nums">
            {doc.sections.length} date{doc.sections.length !== 1 ? "s" : ""}
          </span>
          <span className="text-warm-200">·</span>
          <span className="text-[11px] text-warm-500 tabular-nums">
            {doc.sections.reduce((sum, s) => sum + s.pages.length, 0)} page
            {doc.sections.reduce((sum, s) => sum + s.pages.length, 0) !== 1 ? "s" : ""}
          </span>
          <span className="flex-1" />
          <FeedbackTrigger className="text-[11px] text-warm-500" />
          <span className="text-warm-200">·</span>
          <button
            onClick={handleReset}
            className="text-[11px] text-warm-500 hover:text-red-500 transition-colors"
          >
            Clear document
          </button>
        </div>
      )}
    </div>
  );
}
