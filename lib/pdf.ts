// ─────────────────────────────────────────────────────────────────────────────
// PDF export
// Captures each document page DOM node with html2canvas, adds to jsPDF.
// Letter size: 8.5 × 11 inches
//
// Root cause of "Unable to find element in cloned iframe":
//   html2canvas clones the document into a hidden iframe to measure layout.
//   Elements inside a scrolled container (overflow: auto/scroll) cannot be
//   located by html2canvas in that cloned context.
//
// Fix: for each page, clone the element onto document.body at a fixed
//   off-screen position before capturing, then remove the clone.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportOptions {
  filename?: string;
  scale?: number;
  onProgress?: (current: number, total: number) => void;
}

async function capturePageElement(
  el: HTMLElement,
  html2canvas: (el: HTMLElement, opts: object) => Promise<HTMLCanvasElement>,
  scale: number
): Promise<string> {
  const w = el.offsetWidth;
  const h = el.offsetHeight;

  // Clone onto body so html2canvas can find it outside the scroll container
  const clone = el.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: `${w}px`,
    height: `${h}px`,
    // Push behind everything visually; html2canvas still renders it
    zIndex: "-9999",
    pointerEvents: "none",
    margin: "0",
    padding: clone.style.padding || "",
  });
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    });
    return canvas.toDataURL("image/jpeg", 0.92);
  } finally {
    document.body.removeChild(clone);
  }
}

export async function exportToPDF(
  pageElements: HTMLElement[],
  options: ExportOptions = {}
): Promise<void> {
  const { filename = "timeline-evidence.pdf", scale = 2, onProgress } = options;

  if (pageElements.length === 0) {
    throw new Error("No pages to export.");
  }

  // Dynamic imports — keep bundle lean and avoid SSR issues
  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = jsPDFModule;

  // Letter: 8.5 × 11 inches
  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });

  for (let i = 0; i < pageElements.length; i++) {
    if (i > 0) pdf.addPage("letter", "portrait");
    onProgress?.(i + 1, pageElements.length);

    const imgData = await capturePageElement(pageElements[i], html2canvas as Parameters<typeof capturePageElement>[1], scale);
    pdf.addImage(imgData, "JPEG", 0, 0, 8.5, 11);
  }

  pdf.save(filename);
}
