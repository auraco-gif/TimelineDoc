// ─────────────────────────────────────────────────────────────────────────────
// PDF export
// Stable DOM -> PDF export for letter-size timeline pages
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportOptions {
  filename?: string;
  scale?: number;
  onProgress?: (current: number, total: number) => void;
}

interface PageSnapshot {
  el: HTMLElement;
  parent: Node;
  nextSibling: Node | null;
  savedStyle: Record<string, string>;
}

const LETTER_WIDTH_IN = 8.5;
const LETTER_HEIGHT_IN = 11;

// 96 CSS px per inch is the standard browser CSS reference pixel.
const CSS_PX_PER_IN = 96;
const LETTER_WIDTH_PX = Math.round(LETTER_WIDTH_IN * CSS_PX_PER_IN);   // 816
const LETTER_HEIGHT_PX = Math.round(LETTER_HEIGHT_IN * CSS_PX_PER_IN); // 1056

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

function snapshotPages(pageElements: HTMLElement[]): PageSnapshot[] {
  const out: PageSnapshot[] = [];

  for (const el of pageElements) {
    const parent = el.parentNode;
    if (!parent) continue;

    out.push({
      el,
      parent,
      nextSibling: el.nextSibling,
      savedStyle: {
        position: el.style.position,
        top: el.style.top,
        left: el.style.left,
        zIndex: el.style.zIndex,
        width: el.style.width,
        height: el.style.height,
        minWidth: el.style.minWidth,
        minHeight: el.style.minHeight,
        maxWidth: el.style.maxWidth,
        maxHeight: el.style.maxHeight,
        margin: el.style.margin,
        transform: el.style.transform,
        display: el.style.display,
        visibility: el.style.visibility,
        overflow: el.style.overflow,
        boxSizing: el.style.boxSizing,
      },
    });
  }

  return out;
}

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function waitForPaint(frames: number = 2): Promise<void> {
  for (let i = 0; i < frames; i++) {
    await waitForNextFrame();
  }
}

async function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));

  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const done = () => {
          img.removeEventListener("load", done);
          img.removeEventListener("error", done);
          resolve();
        };

        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    })
  );
}

async function waitForFonts(): Promise<void> {
  const anyDoc = document as Document & {
    fonts?: {
      ready: Promise<unknown>;
    };
  };

  if (anyDoc.fonts?.ready) {
    await anyDoc.fonts.ready;
  }
}

function getRenderableSize(el: HTMLElement): { width: number; height: number } {
  const rect = el.getBoundingClientRect();

  const candidatesW = [
    Math.round(rect.width),
    el.offsetWidth,
    el.clientWidth,
    el.scrollWidth,
  ].filter((n) => Number.isFinite(n) && n > 0);

  const candidatesH = [
    Math.round(rect.height),
    el.offsetHeight,
    el.clientHeight,
    el.scrollHeight,
  ].filter((n) => Number.isFinite(n) && n > 0);

  return {
    width: candidatesW[0] ?? 0,
    height: candidatesH[0] ?? 0,
  };
}

async function capturePageElement(
  snapshot: PageSnapshot,
  html2canvas: (el: HTMLElement, opts: object) => Promise<HTMLCanvasElement>,
  scale: number
): Promise<HTMLCanvasElement> {
  const { el, parent, nextSibling, savedStyle } = snapshot;

  // Move first, then force a stable printable layout.
  document.body.appendChild(el);

  Object.assign(el.style, {
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "99998",
    width: `${LETTER_WIDTH_PX}px`,
    height: `${LETTER_HEIGHT_PX}px`,
    minWidth: `${LETTER_WIDTH_PX}px`,
    minHeight: `${LETTER_HEIGHT_PX}px`,
    maxWidth: `${LETTER_WIDTH_PX}px`,
    maxHeight: `${LETTER_HEIGHT_PX}px`,
    margin: "0",
    transform: "none",
    display: "block",
    visibility: "visible",
    overflow: "hidden",
    boxSizing: "border-box",
    background: "#ffffff",
  });

  try {
    // Let browser finish layout after the node is moved and resized.
    await waitForPaint(2);
    await waitForImages(el);
    await waitForFonts();
    await waitForPaint(1);

    let { width, height } = getRenderableSize(el);

    // Final fallback: for letter export, use explicit page size.
    if (width <= 0) width = LETTER_WIDTH_PX;
    if (height <= 0) height = LETTER_HEIGHT_PX;

    if (width <= 0 || height <= 0) {
      throw new Error(`Page has invalid size after layout: ${width} x ${height}`);
    }

    const canvas = await html2canvas(el, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      scrollX: 0,
      scrollY: 0,
    });

    if (!canvas.width || !canvas.height) {
      throw new Error("html2canvas returned an empty canvas.");
    }

    return canvas;
  } finally {
    if (nextSibling && parent.contains(nextSibling)) {
      parent.insertBefore(el, nextSibling);
    } else {
      parent.appendChild(el);
    }

    el.style.position = savedStyle.position ?? "";
    el.style.top = savedStyle.top ?? "";
    el.style.left = savedStyle.left ?? "";
    el.style.zIndex = savedStyle.zIndex ?? "";
    el.style.width = savedStyle.width ?? "";
    el.style.height = savedStyle.height ?? "";
    el.style.minWidth = savedStyle.minWidth ?? "";
    el.style.minHeight = savedStyle.minHeight ?? "";
    el.style.maxWidth = savedStyle.maxWidth ?? "";
    el.style.maxHeight = savedStyle.maxHeight ?? "";
    el.style.margin = savedStyle.margin ?? "";
    el.style.transform = savedStyle.transform ?? "";
    el.style.display = savedStyle.display ?? "";
    el.style.visibility = savedStyle.visibility ?? "";
    el.style.overflow = savedStyle.overflow ?? "";
    el.style.boxSizing = savedStyle.boxSizing ?? "";
  }
}

export async function exportToPDF(
  pageElements: HTMLElement[],
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = "timeline-evidence.pdf",
    scale = 2,
    onProgress,
  } = options;

  if (pageElements.length === 0) {
    throw new Error("No pages to export.");
  }

  const snapshots = snapshotPages(pageElements);

  if (snapshots.length === 0) {
    throw new Error(
      "No page elements found in the document. Try scrolling to the top and export again."
    );
  }

  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const html2canvas = html2canvasModule.default;
  const { jsPDF } = jsPDFModule;

  const overlay = createExportOverlay();

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter",
  });

  try {
    for (let i = 0; i < snapshots.length; i++) {
      if (i > 0) {
        pdf.addPage("letter", "portrait");
      }

      onProgress?.(i + 1, snapshots.length);

      const canvas = await capturePageElement(
        snapshots[i],
        html2canvas,
        scale
      );

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, LETTER_WIDTH_IN, LETTER_HEIGHT_IN);
    }

    pdf.save(filename);
  } finally {
    overlay.remove();
  }
}