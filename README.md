# TimelineDoc — Turn Photos into a Timeline PDF

**Turn your photos into a clean, chronological timeline PDF — perfect for immigration, visa, and relationship evidence.**

👉 [timelinedoc.app](https://www.timelinedoc.app) · [Resources & Guides](https://www.timelinedoc.app/resources)

---

## What is TimelineDoc?

TimelineDoc is a free browser-based tool that helps you organize photos into a structured, printable timeline PDF.

It is designed for anyone who needs to compile **relationship evidence for immigration applications**, including:

- I-130 petitions (petition for alien relative)
- Spouse visa and partner visa applications
- Marriage-based green card documentation

Instead of manually dragging photos into Word or Google Docs, TimelineDoc reads the date from each photo, sorts them automatically, and generates a clean, formatted PDF in seconds — entirely in your browser.

---

## Key Features

- **Auto date extraction** — reads EXIF metadata from photos; falls back to file date
- **Chronological sorting** — photos sorted by date automatically
- **Clean page layout** — grouped by event date in a readable, 2×2 photo grid
- **Editable descriptions** — add short notes for each event or date
- **One-click PDF export** — letter-size, print-ready PDF
- **100% client-side** — no upload, no account, no data stored on a server
- **Privacy-first** — your photos never leave your device

---

## Use Cases

TimelineDoc is commonly used for:

- **I-130 relationship evidence** — organize photos and events for USCIS petitions
- **Spouse visa applications** — create a clear relationship history document
- **Partner or fiancé visa documentation** — show a genuine, ongoing relationship
- **Personal relationship timelines** — for attorneys, notaries, or personal records

---

## Why TimelineDoc?

Organizing relationship evidence is surprisingly time-consuming.

Most people end up manually resizing photos in Word, fighting with formatting, and losing track of chronological order. A disorganized document can slow down an already stressful process.

TimelineDoc reduces this to a few clicks: upload your photos, review the timeline, export the PDF.

---

## Resources

We provide free guides and examples to help you prepare your evidence:

- [How to Organize Relationship Evidence](https://www.timelinedoc.app/resources/how-to-organize-relationship-evidence)
- [Relationship Evidence Example](https://www.timelinedoc.app/resources/relationship-evidence-example)
- [What Counts as Relationship Evidence?](https://www.timelinedoc.app/resources/what-counts-as-relationship-evidence)

Browse all guides: [timelinedoc.app/resources](https://www.timelinedoc.app/resources)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| EXIF Parsing | [exifr](https://github.com/MikeKovarik/exifr) |
| PDF Generation | [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF) |
| Icons | [lucide-react](https://lucide.dev/) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values (Google Apps Script URL for lead and feedback collection).

---

## Disclaimer

TimelineDoc is not a law firm and does not provide legal advice. This tool is for document organization only. Applicants should consult official sources or a qualified immigration attorney for guidance on their case.

---

## License

MIT
