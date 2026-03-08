// ─────────────────────────────────────────────────────────────────────────────
// Photo metadata extraction
// Uses exifr for EXIF DateTimeOriginal, falls back to file.lastModified.
// ─────────────────────────────────────────────────────────────────────────────

import { Photo } from "@/types/document";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

async function extractDate(file: File): Promise<Date> {
  try {
    // Dynamically import exifr to avoid SSR issues
    const exifr = await import("exifr");
    const tags = await exifr.default.parse(file, ["DateTimeOriginal", "CreateDate", "DateTime"]);
    if (tags?.DateTimeOriginal instanceof Date) return tags.DateTimeOriginal;
    if (tags?.CreateDate instanceof Date) return tags.CreateDate;
    if (tags?.DateTime instanceof Date) return tags.DateTime;
  } catch {
    // EXIF unavailable — fall through to lastModified
  }
  return new Date(file.lastModified);
}

export async function extractPhotoMetadata(file: File): Promise<Photo> {
  const url = URL.createObjectURL(file);
  const [date, dimensions] = await Promise.all([
    extractDate(file),
    loadImageDimensions(url),
  ]);

  return {
    id: generateId(),
    file,
    url,
    date,
    width: dimensions.width,
    height: dimensions.height,
  };
}

export async function extractAllPhotos(files: File[]): Promise<Photo[]> {
  return Promise.all(files.map(extractPhotoMetadata));
}

export function revokePhotoUrls(photos: Photo[]): void {
  photos.forEach((p) => URL.revokeObjectURL(p.url));
}
