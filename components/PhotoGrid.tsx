import { Photo } from "@/types/document";

interface PhotoGridProps {
  photos: Photo[];
}

// Always render a 2×2 grid (4 slots), filling available photos and leaving
// empty slots visually neutral. Each cell uses object-cover to fill the space.
export function PhotoGrid({ photos }: PhotoGridProps) {
  const slots = Array.from({ length: 4 }, (_, i) => photos[i] ?? null);

  const single = photos.length === 1;

  if (single) {
    // Single photo: fill the full grid width at proportional height
    return (
      <div className="w-full aspect-[4/3] rounded overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[0].url}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1.5 w-full">
      {slots.map((photo, idx) => (
        <div
          key={photo?.id ?? `empty-${idx}`}
          className="aspect-[4/3] rounded overflow-hidden bg-neutral-100"
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
