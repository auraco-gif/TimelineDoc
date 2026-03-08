// ─────────────────────────────────────────────────────────────────────────────
// PDF export
// Captures each document page DOM node with html2canvas, adds to jsPDF.
// Letter size: 8.5 × 11 inches
//
// Two bugs fixed:
//
// Bug 1 — "Unable to find element in cloned iframe":
//   html2canvas clones the document into a hidden iframe to measure layout.
//   Elements inside a scrolled container (overflow: auto/scroll) cannot be
//   located in that cloned context. Fix: clone each page onto document.body.
//
// Bug 2 — Blank PDF pages:
//   Using z-index: -9999 caused the body's white background to paint over the
//   cloned element during html2canvas compositing → all-white output.
//   Fix: use a high positive z-index (99999) so the clone renders on top.
//   Also: wait for all <img> elements in the clone to finish loading before
//   capturing, since cloneNode() creates fresh HTMLImageElement instances that
//   need a tick to decode the blob URL even if already cached.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportOptions {
  filename?: string;
  scale?: number;
  onProgress?: (current: number, total: number) => void;
}

function waitForImages(container: HTMLElement): Promise<void> {
  const imgs = Array.from(container.querySelectorAll("img")) as HTMLImageElement[];
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
          // Safety timeout — don't block export forever
          setTimeout(done, 5000);
        })
    )
  ).then(() => undefined);
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
    // Must be a HIGH positive z-index.
    // Negative z-index causes the body white background to composite ON TOP
    // of the element inside html2canvas, producing blank white output.
    zIndex: "99999",
    pointerEvents: "none",
    margin: "0",
  });
  document.body.appendChild(clone);

  // Wait for cloned <img> elements to finish loading before capturing
  await waitForImages(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: w,
      height: h,
      // Use full window dimensions so html2canvas layout matches the real page
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
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

    const imgData = await capturePageElement(
      pageElements[i],
      html2canvas as Parameters<typeof capturePageElement>[1],
      scale
    );
    pdf.addImage(imgData, "JPEG", 0, 0, 8.5, 11);
  }

  pdf.save(filename);
}
