// ─────────────────────────────────────────────────────────────────────────────
// PDF export — WYSIWYG clone-based capture
//
// Design principle:
//   The export clone must reproduce the exact same coordinate space as the
//   browser preview. We achieve this by:
//   1. Measuring the live page element's true rendered rect via getBoundingClientRect
//   2. Freezing that exact rect onto the clone (no reflow allowed)
//   3. Replacing <img> with background-image divs so object-fit:cover works
//      (html2canvas v1.4 does not implement CSS object-fit)
//   4. Passing the exact measured width/height into html2canvas options
//
// CORS note: images are blob: URLs (same-origin) — useCORS:true is kept for
// forward compatibility only, it has no effect on local files.
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
 * Off-screen container that does NOT impose its own width on the clone.
 * Must not use display:none or visibility:hidden — html2canvas needs layout.
 * Placed at left:-10000px so it's invisible but fully laid out.
 */
function createExportRoot(): HTMLDivElement {
  const root = document.createElement("div");
  Object.assign(root.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    pointerEvents: "none",
    background: "transparent",
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
  // Also covers background-image divs that replaced <img> elements
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
          setTimeout(done, 8000); // safety timeout
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

// Canonical letter-size fallback for this project (8.5" × 11" @ 96 dpi)
const LETTER_W = 816;
const LETTER_H = 1056;

/**
 * Try multiple methods to read a page element's rendered dimensions.
 * Never throws — returns canonical letter size as final fallback.
 *
 * Used on the ORIGINAL live element before cloning. The element may be
 * detached (0×0 getBCR) if React unmounted it, e.g. when isProcessing=true
 * hid the pages — the fallback ensures the clone still gets valid dimensions.
 */
function getPreferredPageSize(el: HTMLElement): { width: number; height: number; source: string } {
  const rect = el.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    return { width: Math.round(rect.width), height: Math.round(rect.height), source: "getBoundingClientRect" };
  }

  const computed = window.getComputedStyle(el);
  const cw = parseFloat(computed.width ?? "0");
  const ch = parseFloat(computed.height ?? "0");
  if (cw > 0 && ch > 0) {
    return { width: Math.round(cw), height: Math.round(ch), source: "computedStyle" };
  }

  if (el.offsetWidth > 0 && el.offsetHeight > 0) {
    return { width: el.offsetWidth, height: el.offsetHeight, source: "offsetSize" };
  }

  return { width: LETTER_W, height: LETTER_H, source: "canonicalFallback" };
}

/**
 * Measure a clone that IS mounted in the export root.
 * Same fallback chain — but the clone has explicit style dimensions set,
 * so getBoundingClientRect should always return valid values here.
 */
function getMeasuredExportSize(el: HTMLElement): { width: number; height: number; source: string } {
  const rect = el.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    return { width: Math.round(rect.width), height: Math.round(rect.height), source: "getBoundingClientRect" };
  }

  const computed = window.getComputedStyle(el);
  const cw = parseFloat(computed.width ?? "0");
  const ch = parseFloat(computed.height ?? "0");
  if (cw > 0 && ch > 0) {
    return { width: Math.round(cw), height: Math.round(ch), source: "computedStyle" };
  }

  if (el.offsetWidth > 0 && el.offsetHeight > 0) {
    return { width: el.offsetWidth, height: el.offsetHeight, source: "offsetSize" };
  }

  return { width: LETTER_W, height: LETTER_H, source: "canonicalFallback" };
}

/**
 * Preserve aspect ratio and center on a letter page (8.5 × 11 in).
 * A 816×1056 capture (letter ratio) fills the page exactly at 0,0.
 */
function getPdfPlacement(canvasWidth: number, canvasHeight: number): PdfPlacement {
  const PAGE_W = 8.5;
  const PAGE_H = 11;

  if (canvasWidth <= 0 || canvasHeight <= 0) {
    return { x: 0, y: 0, w: PAGE_W, h: PAGE_H };
  }

  const canvasRatio = canvasWidth / canvasHeight;
  const pageRatio = PAGE_W / PAGE_H;

  let w: number, h: number;
  if (canvasRatio > pageRatio) {
    w = PAGE_W;
    h = PAGE_W / canvasRatio;
  } else {
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

/**
 * Replace every <img> inside container with a background-image <div>.
 *
 * html2canvas v1.4 does not implement CSS object-fit. Instead of stretching
 * the image to fill its box, it draws the full natural image. Replacing with
 * background-image + background-size:cover gives the correct crop in the
 * capture output.
 *
 * The replacement div inherits the parent's full width/height so the slot
 * frame dimensions remain unchanged.
 */
function replaceImgsWithBackgroundDivs(container: HTMLElement): void {
  container.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    const parent = img.parentElement;
    if (!parent) return;
    const src = img.getAttribute("src") ?? img.src;
    if (!src) return;

    const div = document.createElement("div");
    Object.assign(div.style, {
      display: "block",
      width: "100%",
      height: "100%",
      backgroundImage: `url('${src}')`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
    });
    parent.replaceChild(div, img);
  });
}

/**
 * Replace <textarea> elements with static <div>s so html2canvas captures the
 * typed text. The replacement preserves class names and inline styles so
 * typography and spacing match the preview.
 */
function replaceTextareasWithDivs(container: HTMLElement): void {
  container.querySelectorAll<HTMLTextAreaElement>("textarea").forEach((ta) => {
    const replacement = document.createElement("div");
    replacement.style.cssText = ta.style.cssText;
    replacement.className = ta.className;
    Object.assign(replacement.style, {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      overflow: "hidden",
      boxSizing: "border-box",
    });
    if (ta.value) {
      replacement.textContent = ta.value;
    } else {
      replacement.textContent = ta.placeholder;
      replacement.style.color = "#d1d5db"; // neutral-300 placeholder
    }
    ta.parentNode?.replaceChild(replacement, ta);
  });
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

  await waitForFonts();

  const overlay = createExportOverlay();
  const exportRoot = createExportRoot();

  // Let overlay paint before heavy work
  await waitForPaint(2);

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });

  try {
    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) pdf.addPage("letter", "portrait");
      onProgress?.(i + 1, pageElements.length);

      const original = pageElements[i];

      // ── 1. Read preferred size from the live element ───────────────────────
      // The original may be detached (0×0 getBCR) if React unmounted pages
      // while isProcessing=true. getPreferredPageSize never throws — it falls
      // back through computed style, offset, and finally canonical 816×1056.
      const originalRect = original.getBoundingClientRect();
      const preferred = getPreferredPageSize(original);

      // ── 2. Clone — original is never moved or mutated ─────────────────────
      const clone = original.cloneNode(true) as HTMLElement;

      // Strip preview-only decorations (shadow, animation, transition)
      clone.style.boxShadow = "none";
      clone.style.animation = "none";
      clone.style.transition = "none";
      clone.classList.remove("shadow-page", "page-enter");

      // ── 3. Freeze clone to preferred dimensions ────────────────────────────
      Object.assign(clone.style, {
        width: `${preferred.width}px`,
        height: `${preferred.height}px`,
        minHeight: `${preferred.height}px`,
        maxHeight: `${preferred.height}px`,
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        background: "#ffffff",
        margin: "0",
        flex: "none",
      });

      // ── 4. Mutate clone for html2canvas compatibility ──────────────────────
      replaceImgsWithBackgroundDivs(clone);
      replaceTextareasWithDivs(clone);

      // ── 5. Mount clone and wait for stable layout ──────────────────────────
      exportRoot.innerHTML = "";
      exportRoot.appendChild(clone);

      await waitForPaint(2);
      await waitForImages(clone);
      await waitForFonts();

      // ── 6. Measure the MOUNTED clone (authoritative dimensions) ────────────
      // The clone is now in the DOM with explicit styles; its rect is reliable.
      const measured = getMeasuredExportSize(clone);
      const exportWidth = measured.width;
      const exportHeight = measured.height;

      console.debug("[pdf] page", i + 1, {
        originalRect: { width: originalRect.width, height: originalRect.height },
        preferredSource: preferred.source,
        preferred: { width: preferred.width, height: preferred.height },
        measuredSource: measured.source,
        cloneMeasured: { width: exportWidth, height: exportHeight },
      });

      // ── 7. Capture ────────────────────────────────────────────────────────
      const canvas = await html2canvas(clone, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: exportWidth,
        height: exportHeight,
        windowWidth: exportWidth,
        windowHeight: exportHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        console.warn(`exportToPDF: page ${i + 1} produced a 0×0 canvas — skipping`);
        continue;
      }

      // ── 8. Place image on PDF page, preserving aspect ratio ───────────────
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
