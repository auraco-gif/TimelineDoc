// ─────────────────────────────────────────────────────────────────────────────
// PDF export — captures ORIGINAL page DOM nodes (no cloning)
//
// html2canvas clones the document into a hidden iframe. Elements inside
// a scrolled container (overflow: auto) can fail to resolve in that clone.
//
// Strategy:
//   1. Add a full-screen overlay to hide visual changes from the user
//   2. Temporarily set ALL ancestor overflow containers to "visible"
//      so html2canvas's iframe clone can lay out and find each element
//   3. Capture the original element — images are already decoded, no
//      blob-URL re-loading issues
//   4. Restore original overflow styles and remove overlay
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportOptions {
  filename?: string;
  scale?: number;
  onProgress?: (current: number, total: number) => void;
}

function getScrollAncestors(el: HTMLElement): HTMLElement[] {
  const ancestors: HTMLElement[] = [];
  let current = el.parentElement;
  while (current && current !== document.body) {
    const style = getComputedStyle(current);
    if (
      style.overflow !== "visible" ||
      style.overflowX !== "visible" ||
      style.overflowY !== "visible"
    ) {
      ancestors.push(current);
    }
    current = current.parentElement;
  }
  return ancestors;
}

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

export async function exportToPDF(
  pageElements: HTMLElement[],
  options: ExportOptions = {}
): Promise<void> {
  const { filename = "timeline-evidence.pdf", scale = 2, onProgress } = options;

  if (pageElements.length === 0) {
    throw new Error("No pages to export.");
  }

  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = jsPDFModule;

  // Full-screen overlay hides the layout changes during capture
  const overlay = createExportOverlay();

  // Small pause so the overlay paints before we start heavy work
  await new Promise((r) => setTimeout(r, 50));

  // Collect all scroll ancestors that need overflow: visible
  const scrollAncestors = new Set<HTMLElement>();
  for (const el of pageElements) {
    for (const ancestor of getScrollAncestors(el)) {
      scrollAncestors.add(ancestor);
    }
  }

  // Save original styles and override to visible
  const saved = new Map<HTMLElement, { overflow: string; overflowX: string; overflowY: string }>();
  for (const ancestor of scrollAncestors) {
    saved.set(ancestor, {
      overflow: ancestor.style.overflow,
      overflowX: ancestor.style.overflowX,
      overflowY: ancestor.style.overflowY,
    });
    ancestor.style.overflow = "visible";
    ancestor.style.overflowX = "visible";
    ancestor.style.overflowY = "visible";
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });

  try {
    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) pdf.addPage("letter", "portrait");
      onProgress?.(i + 1, pageElements.length);

      const el = pageElements[i];
      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: el.offsetWidth,
        height: el.offsetHeight,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      pdf.addImage(imgData, "JPEG", 0, 0, 8.5, 11);
    }

    pdf.save(filename);
  } finally {
    // Restore original overflow styles
    for (const [ancestor, styles] of saved) {
      ancestor.style.overflow = styles.overflow;
      ancestor.style.overflowX = styles.overflowX;
      ancestor.style.overflowY = styles.overflowY;
    }

    // Remove overlay
    overlay.remove();
  }
}
