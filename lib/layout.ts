// ─────────────────────────────────────────────────────────────────────────────
// Layout engine
// Groups photos by calendar date, chunks into pages of ≤4, builds Document.
// Kept separate from UI so layout logic can be reused or server-rendered later.
// ─────────────────────────────────────────────────────────────────────────────

import { format } from "date-fns";
import {
  Photo,
  DocumentPage,
  DocumentSection,
  TimelineDocument,
} from "@/types/document";

const PHOTOS_PER_PAGE = 4;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function calendarKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function formatDateLabel(date: Date): string {
  return format(date, "MMMM d, yyyy");
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function buildSection(
  photos: Photo[],
  description: string = ""
): DocumentSection {
  const sorted = [...photos].sort((a, b) => a.date.getTime() - b.date.getTime());
  const date = sorted[0].date;
  const dateLabel = formatDateLabel(date);
  const sectionId = generateId();

  const photoChunks = chunkArray(sorted, PHOTOS_PER_PAGE);
  const pages: DocumentPage[] = photoChunks.map((chunk, idx) => ({
    id: generateId(),
    date,
    dateLabel,
    sectionId,
    photoBlock: { type: "photo", photos: chunk },
    textBlock: { type: "text", content: description },
    isFirstInSection: idx === 0,
  }));

  return {
    id: sectionId,
    date,
    dateLabel,
    photos: sorted,
    pages,
    description,
  };
}

export function buildDocument(photos: Photo[]): TimelineDocument {
  // Sort all photos chronologically
  const sorted = [...photos].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group by calendar day
  const groups = new Map<string, Photo[]>();
  for (const photo of sorted) {
    const key = calendarKey(photo.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(photo);
  }

  // Build sections in chronological order
  const sections: DocumentSection[] = [];
  groups.forEach((groupPhotos) => {
    sections.push(buildSection(groupPhotos));
  });

  const now = new Date();
  return {
    id: generateId(),
    title: "Timeline Evidence",
    sections,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateSectionDescription(
  doc: TimelineDocument,
  sectionId: string,
  description: string
): TimelineDocument {
  const sections = doc.sections.map((section) => {
    if (section.id !== sectionId) return section;
    const updatedPages = section.pages.map((page) => ({
      ...page,
      textBlock: { ...page.textBlock, content: description },
    }));
    return { ...section, description, pages: updatedPages };
  });
  return { ...doc, sections, updatedAt: new Date() };
}

export function getAllPages(doc: TimelineDocument): DocumentPage[] {
  return doc.sections.flatMap((s) => s.pages);
}
