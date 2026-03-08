// ─────────────────────────────────────────────────────────────────────────────
// Core document model
// Designed for future expansion: collaboration, templates, cloud storage.
// MVP uses client-side state only.
// ─────────────────────────────────────────────────────────────────────────────

export interface Photo {
  id: string;
  file: File;
  url: string; // object URL from URL.createObjectURL
  date: Date;
  width: number;
  height: number;
}

// Content blocks — extensible for future block types (captions, maps, etc.)
export interface PhotoBlock {
  type: "photo";
  photos: Photo[]; // 1–4 photos per block
}

export interface TextBlock {
  type: "text";
  content: string;
}

export type ContentBlock = PhotoBlock | TextBlock;

// A single letter-size page rendered in the canvas
export interface DocumentPage {
  id: string;
  date: Date;
  dateLabel: string; // e.g. "April 12, 2023"
  sectionId: string; // parent section ID for description sharing
  photoBlock: PhotoBlock;
  textBlock: TextBlock;
  isFirstInSection: boolean; // shows date header only on first page of section
}

// A date group — all photos sharing the same calendar day
export interface DocumentSection {
  id: string;
  date: Date;
  dateLabel: string;
  photos: Photo[];
  pages: DocumentPage[];
  description: string; // shared across all pages in this section
}

// Top-level document — ready for future metadata, collaborators, templates
export interface TimelineDocument {
  id: string;
  title: string;
  sections: DocumentSection[];
  createdAt: Date;
  updatedAt: Date;
}
