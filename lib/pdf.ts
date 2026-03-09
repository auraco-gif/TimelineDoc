// ─────────────────────────────────────────────────────────────────────────────
// PDF export — clone-based, never touches live React DOM nodes
//
// For each page element (queried by [data-export-page="true"]):
//   1. Clone it into an off-screen export root attached to document.body
//   2. Strip preview-only styles (shadow, animation)
//   3. Wait for paint + images + fonts
//   4. Capture with html2canvas
//   5. Add to jsPDF with aspect-ratio-preserving placement
//
// CORS note: images use blob: URLs created by URL.createObjectURL() from local
// files — these are same-origin and never require CORS. useCORS: true is kept
// for future remote image support but is not needed for the current MVP.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportOptions {
  filename?: string;
  scale?: number;
  onProgress?: (current: number, total: number) => void;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function createExportOverlay(): HTMLDivElement {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "99999",
    background: "#f0f0ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "14px",
    color: "#737373",
  });
  overlay.textContent = "Generating PDF…";
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Off-screen container for cloned pages.
 * Must NOT use display:none or visibility:hidden — html2canvas needs it
 * to be laid out. Placed far off-screen at left: -10000px instead.
 */
function createExportRoot(): HTMLDivElement {
  const root = document.createElement("div");
  Object.assign(root.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: "816px",
    background: "#ffffff",
    pointerEvents: "none",
    zIndex: "1",
  });
  document.body.appendChild(root);
  return root;
}

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function waitForPaint(frames = 2): Promise<void> {
  for (let i = 0; i < frames; i++) {
    await waitForNextFrame();
  }
}

function waitForImages(container: HTMLElement): Promise<void> {
  const imgs = Array.from(container.querySelectorAll<HTMLImageElement>("img"));
  if (imgs.length === 0) return Promise.resolve();

  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          // Safety timeout — don't block export indefinitely
          setTimeout(done, 8000);
        })
    )
  ).then(() => undefined);
}

async function waitForFonts(): Promise<void> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }
}

interface PdfPlacement {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Letter page: 8.5 × 11 inches.
 * Fit the captured image while preserving its aspect ratio, centered on the page.
 * A letter-ratio canvas (816 × 1056) will fill the page exactly.
 * Taller or shorter pages get letterboxed.
 */
function getPdfPlacement(canvasWidth: number, canvasHeight: number): PdfPlacement {
  const PAGE_W = 8.5;
  const PAGE_H = 11;

  if (canvasWidth <= 0 || canvasHeight <= 0) {
    return { x: 0, y: 0, w: PAGE_W, h: PAGE_H };
  }

  const canvasRatio = canvasWidth / canvasHeight;
  const pageRatio = PAGE_W / PAGE_H;

  let w: number;
  let h: number;

  if (canvasRatio > pageRatio) {
    // Wider than page — fit to width
    w = PAGE_W;
    h = PAGE_W / canvasRatio;
  } else {
    // Taller than page — fit to height
    h = PAGE_H;
    w = PAGE_H * canvasRatio;
  }

  return {
    x: (PAGE_W - w) / 2,
    y: (PAGE_H - h) / 2,
    w,
    h,
  };
}

// ── main export ───────────────────────────────────────────────────────────────

export async function exportToPDF(
  pageElements: HTMLElement[],
  options: ExportOptions = {}
): Promise<void> {
  const { filename = "timeline-evidence.pdf", scale = 2, onProgress } = options;

  if (pageElements.length === 0) {
    console.warn("exportToPDF: no page elements provided");
    return;
  }

  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = jsPDFModule;

  // Ensure fonts are ready before capturing
  await waitForFonts();

  const overlay = createExportOverlay();
  const exportRoot = createExportRoot();

  // Give the overlay time to paint before heavy work begins
  await waitForPaint(2);

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });

  try {
    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) pdf.addPage("letter", "portrait");
      onProgress?.(i + 1, pageElements.length);

      const original = pageElements[i];

      // Deep clone — images keep their blob: src, no re-fetch needed
      const clone = original.cloneNode(true) as HTMLElement;

      // Strip preview-only decorations so they don't bleed into the PDF
      clone.style.boxShadow = "none";
      clone.style.animation = "none";
      clone.style.transition = "none";
      clone.classList.remove("shadow-page", "page-enter");

      // Enforce correct export dimensions (clone may inherit browser styles)
      clone.style.width = "816px";
      clone.style.minHeight = "1056px";
      clone.style.position = "relative";
      clone.style.background = "#ffffff";

      // Replace textarea values with plain divs so html2canvas captures the text
      // (html2canvas does not reliably render <textarea> content)
      clone.querySelectorAll<HTMLTextAreaElement>("textarea").forEach((ta) => {
        const replacement = document.createElement("div");
        replacement.style.cssText = ta.style.cssText;
        replacement.className = ta.className;
        Object.assign(replacement.style, {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        });
        replacement.textContent = ta.value || ta.placeholder;
        if (!ta.value && ta.placeholder) {
          replacement.style.color = "#d1d5db"; // placeholder color
        }
        ta.parentNode?.replaceChild(replacement, ta);
      });

      exportRoot.innerHTML = "";
      exportRoot.appendChild(clone);

      // Wait for layout + images to be ready
      await waitForPaint(2);
      await waitForImages(clone);

      const canvas = await html2canvas(clone, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 816,
        windowWidth: 816,
        logging: false,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        console.warn(`exportToPDF: page ${i + 1} produced a 0×0 canvas, skipping`);
        continue;
      }

      // PNG preserves sharpness without JPEG compression artifacts
      const imgData = canvas.toDataURL("image/png");
      const { x, y, w, h } = getPdfPlacement(canvas.width, canvas.height);
      pdf.addImage(imgData, "PNG", x, y, w, h);
    }

    pdf.save(filename);
  } finally {
    exportRoot.remove();
    overlay.remove();
  }
}
