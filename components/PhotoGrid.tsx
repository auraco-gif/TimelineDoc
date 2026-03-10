import { Photo } from "@/types/document";

// ─────────────────────────────────────────────────────────────────────────────
// Slot dimensions derived from page geometry so cells have explicit px heights.
//
// Page:          816px wide
// H-padding:     80px left + 80px right = 160px total
// Content width: 816 - 160 = 656px
// Grid gap:      gap-1.5 = 6px (Tailwind 1.5 × 4px)
// Cell width:    (656 - 6) / 2 = 325px
// Cell height:   325 × 3/4 = 244px  (4:3 aspect ratio)
// Single height: 656 × 3/4 = 492px
//
// Explicit pixel heights are required because html2canvas v1.4 does not
// implement the CSS `aspect-ratio` property — Tailwind's aspect-[4/3] would
// produce 0-height cells in the export clone. Using fixed px avoids that.
// ─────────────────────────────────────────────────────────────────────────────
const CELL_W = 325;
const CELL_H = 244;
const SINGLE_H = 492;

// Slot frame style — position:relative + overflow:hidden so the img can fill
// the box and be cropped correctly in both browser and html2canvas.
const slotStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 6,
  backgroundColor: "#f5f5f5",
  width: CELL_W,
  height: CELL_H,
  flexShrink: 0,
};

// Image style — all properties explicit so html2canvas gets an unambiguous
// instruction. The img-to-background replacement in pdf.ts handles the
// object-fit cover workaround for the export clone.
const imgStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center center",
};

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const slots = Array.from({ length: 4 }, (_, i) => photos[i] ?? null);
  const single = photos.length === 1;

  if (single) {
    return (
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 6,
          backgroundColor: "#f5f5f5",
          width: "100%",
          height: SINGLE_H,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[0].url} alt="" style={imgStyle} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(2, ${CELL_W}px)`,
        gap: 6,
      }}
    >
      {slots.map((photo, idx) => (
        <div key={photo?.id ?? `empty-${idx}`} style={slotStyle}>
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.url} alt="" style={imgStyle} />
          )}
        </div>
      ))}
    </div>
  );
}
