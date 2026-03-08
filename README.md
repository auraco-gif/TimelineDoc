# TimelineDoc

A client-side web application that converts a batch of photos into a clean, timeline-based PDF document — designed for visa and immigration evidence packages.

Upload 50–200 photos, let the app sort them by date automatically, preview the generated pages in a document canvas, and export a letter-size PDF ready for printing or submission.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [PDF Export](#pdf-export)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Features

- **Auto date extraction** — reads EXIF `DateTimeOriginal` from each photo; falls back to `file.lastModified` if EXIF is unavailable
- **Chronological sorting** — all photos sorted by date ascending
- **Automatic page layout** — photos grouped by calendar date, split into pages of up to 4 photos (2×2 grid)
- **Document preview** — Google Docs-style canvas with white letter-size page cards stacked vertically
- **Editable descriptions** — a short text area per date section for event notes
- **PDF export** — letter-size PDF (8.5 × 11 in) with date headers, photo grids, and descriptions
- **Incremental upload** — add more photos to an existing document at any time
- **100% client-side** — no server, no database, no login; all processing happens in the browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Custom shadcn-style components |
| EXIF Parsing | [exifr](https://github.com/MikeKovarik/exifr) |
| PDF Generation | [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF) |
| Date Utilities | [date-fns](https://date-fns.org/) |
| Icons | [lucide-react](https://lucide.dev/) |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Evidence

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
Evidence/
├── app/
│   ├── layout.tsx          # Root HTML shell, global font, metadata
│   ├── page.tsx            # Main screen — state management, upload & export flow
│   └── globals.css         # Tailwind base, custom scrollbar, page animations
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx      # Primary / secondary / ghost / outline variants
│   │   ├── Badge.tsx       # Pill badge with default / muted / outline variants
│   │   └── Spinner.tsx     # Animated loading spinner
│   │
│   ├── Navbar.tsx          # Fixed top bar — Upload Photos, Export PDF, disabled future buttons
│   ├── UploadZone.tsx      # Drag-and-drop + file picker (JPG, PNG, HEIC)
│   ├── DocumentCanvas.tsx  # Gray scrollable canvas, stacks DocumentPage cards
│   ├── DocumentPage.tsx    # Single letter-size page card (680×880 px on screen)
│   └── PhotoGrid.tsx       # 2×2 CSS grid with object-cover image cells
│
├── lib/
│   ├── metadata.ts         # EXIF extraction via exifr, image dimension loading
│   ├── layout.ts           # Sort → group by date → paginate → build Document model
│   ├── pdf.ts              # html2canvas + jsPDF export, clone-to-body capture strategy
│   └── utils.ts            # cn() Tailwind class merge helper
│
└── types/
    └── document.ts         # Core data model: Photo, DocumentPage, DocumentSection, TimelineDocument
```

---

## Architecture

### Data Model (`types/document.ts`)

The document model is designed to support future features like templates, collaboration, and cloud storage without breaking changes.

```
TimelineDocument
└── sections: DocumentSection[]       (one per calendar date)
    ├── date, dateLabel, description
    └── pages: DocumentPage[]         (one per 4-photo chunk)
        ├── date, dateLabel, sectionId
        ├── isFirstInSection          (controls header and description display)
        ├── photoBlock: { photos[] }  (1–4 photos)
        └── textBlock:  { content }   (shared description text)
```

### Data Flow

```
File[] (upload)
  → lib/metadata.ts   extract EXIF date, dimensions, object URL → Photo[]
  → lib/layout.ts     sort by date, group by day, chunk to pages → TimelineDocument
  → React state       document stored in useState
  → DocumentCanvas    renders DocumentPage × N from document.sections[].pages[]
  → lib/pdf.ts        on export: clone each page to body, html2canvas, jsPDF → .pdf
```

### Processing Pipeline

Photos are processed in **batches of 20** to keep the UI responsive for large uploads (50–200 photos). A progress bar tracks extraction progress.

---

## How It Works

### 1. Photo Upload

- User drags photos onto the canvas or clicks "Upload Photos" in the navbar
- Supported: JPG, JPEG, PNG (HEIC optional)
- Multiple uploads are **merged** into the existing document (no data loss)

### 2. Metadata Extraction

For each file, `lib/metadata.ts`:
1. Creates a `blob:` object URL via `URL.createObjectURL(file)`
2. Calls `exifr.parse(file)` to read `DateTimeOriginal`, `CreateDate`, or `DateTime`
3. Falls back to `file.lastModified` if no EXIF date is found
4. Loads image dimensions via `HTMLImageElement.naturalWidth/naturalHeight`

### 3. Layout Generation

`lib/layout.ts`:
1. Sorts all photos chronologically
2. Groups by `YYYY-MM-DD` key using `date-fns`
3. For each group, chunks photos into arrays of ≤ 4
4. Each chunk becomes one `DocumentPage`
5. Sections with > 4 photos get multiple pages with the same date header

**Example:** 9 photos on April 12 → 3 pages (4 + 4 + 1)

### 4. Document Preview

`DocumentCanvas` renders pages as white cards (680 px wide, ~880 px tall) stacked vertically on a gray (`#f0f0ef`) background. Each `DocumentPage` shows:

- **Date header** — `MMMM d, yyyy` format (e.g. "April 12, 2023"); "continued" for split pages
- **Photo grid** — 2×2 CSS grid; single photo spans full width; empty cells are neutral gray
- **Description textarea** — editable per date section; appears on the first page only
- **Page number** — bottom-right corner

### 5. Description Editing

Typing in any description textarea updates `TextBlock.content` via `updateSectionDescription()` in `lib/layout.ts`. All pages in the same section share the same description value.

---

## PDF Export

**Why clone-to-body?**

`html2canvas` clones the document into a hidden `<iframe>` to measure layout. Elements inside a scrolled `<div>` (our canvas with `overflow-y: auto`) cannot be located in that cloned context, causing the _"Unable to find element in cloned iframe"_ error.

**Solution:** before capturing each page, `lib/pdf.ts` clones the element onto `document.body` at `z-index: -9999`, runs `html2canvas` on the clone, then removes it. This guarantees `html2canvas` can always find the element.

**Output spec:**
- Format: Letter (8.5 × 11 in)
- Capture scale: 2× (retina quality)
- Image format: JPEG at 92% quality
- File name: `timeline-evidence.pdf`

---

## Roadmap

This MVP is intentionally minimal. The architecture is designed to support:

| Feature | Notes |
|---|---|
| **Left sidebar** — section navigator | Slot already reserved in `app/page.tsx` |
| **Right panel** — page settings | Slot already reserved in `app/page.tsx` |
| **Templates** | Swap layout rules in `lib/layout.ts` |
| **Drag-to-reorder photos** | Add to `DocumentPage` / `PhotoGrid` |
| **Manual date editing** | Update `Photo.date` in state |
| **Cover page** | Add a special `DocumentSection` type |
| **Multi-user collaboration** | Add user roles to `TimelineDocument` |
| **Consultant / client workflow** | Add `ownerId`, `collaborators[]` to document model |
| **Cloud storage** | Replace client state with API layer |
| **Share links** | Add shareable document IDs |
| **Saved drafts** | Serialize `TimelineDocument` to localStorage or a backend |
| **HEIC support** | Add heic2any conversion before EXIF parsing |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push and open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     new feature
fix:      bug fix
refactor: code change without new feature or bug fix
style:    formatting, whitespace
docs:     documentation only
chore:    build, config, dependencies
```

---

## License

MIT
