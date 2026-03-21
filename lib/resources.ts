// ─────────────────────────────────────────────────────────────────────────────
// Resource data — single source of truth.
//
// To add a new article:
//   1. Add an entry to the RESOURCES array below.
//   2. The /resources index page, /resources/[slug] route, sitemap, metadata,
//      and related-resource links all update automatically.
// ─────────────────────────────────────────────────────────────────────────────

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "link-note"; prefix: string; linkText: string; href: string };

export interface Resource {
  slug: string;
  /** Short title shown on index cards and in <title> */
  title: string;
  /** One-line description shown on index cards */
  description: string;
  /** Used as the <meta name="description"> value */
  metaDescription: string;
  /** Opening paragraph rendered below the H1 */
  intro: string;
  /** Body content blocks in order */
  content: ContentBlock[];
  /** Slugs of other resources to link at the bottom of the article */
  relatedSlugs: string[];
}

export const RESOURCES: Resource[] = [
  // ── 1 ────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-organize-relationship-evidence",
    title: "How to Organize Relationship Evidence",
    description:
      "Step-by-step guide to organizing relationship photos, milestones, and supporting documents into a clear timeline.",
    metaDescription:
      "Learn how to organize relationship photos, milestones, and documents into a clear, chronological timeline for immigration applications.",
    intro:
      "Organizing relationship evidence can feel overwhelming. A clear, chronological timeline makes it much easier for reviewers to follow your history together. Here are five practical steps to help you get started.",
    relatedSlugs: [
      "i130-evidence-checklist",
      "what-counts-as-relationship-evidence",
      "how-many-photos-for-i130",
      "relationship-evidence-example",
    ],
    content: [
      { type: "h2", text: "1. Start with your key milestones" },
      {
        type: "p",
        text: "Begin by listing the most significant events in your relationship — when you met, your first trip together, when you started living together, your engagement, wedding, and so on. These anchor events will form the backbone of your timeline.",
      },
      {
        type: "ul",
        items: [
          "First meeting or date",
          "First trip or vacation together",
          "Moving in together",
          "Engagement or wedding",
          "Major shared life events",
        ],
      },
      { type: "h2", text: "2. Gather photos with clear dates" },
      {
        type: "p",
        text: "Photos are one of the most compelling forms of relationship evidence. Collect photos that clearly show you together over time. Most smartphone photos include EXIF metadata with the exact date taken — TimelineDoc reads this automatically.",
      },
      {
        type: "ul",
        items: [
          "Photos from your phone camera (EXIF dates are usually accurate)",
          "Event photos: holidays, birthdays, weddings",
          "Travel photos with location context",
          "Everyday photos that show shared life",
        ],
      },
      { type: "h2", text: "3. Add short descriptions for context" },
      {
        type: "p",
        text: "A brief note for each event helps reviewers understand the significance of each moment. Keep descriptions factual and specific: where you were, what the occasion was, and who else was present if relevant.",
      },
      { type: "h2", text: "4. Group events by date or occasion" },
      {
        type: "p",
        text: "Once you have your photos and milestones, group them chronologically. Each page of your timeline should represent a distinct event or time period. This keeps the document structured and easy to navigate.",
      },
      {
        type: "ul",
        items: [
          'One page per event (e.g. "Wedding Day, June 2024")',
          "Multiple photos per event where relevant",
          "Consistent date formatting throughout",
        ],
      },
      { type: "h2", text: "5. Review and export your PDF" },
      {
        type: "p",
        text: "Before exporting, review each page for accuracy. Check that dates are correct, descriptions are clear, and photos are legible. A clean, well-organized document is much easier for an officer or attorney to review.",
      },
    ],
  },

  // ── 2 ────────────────────────────────────────────────────────────────────
  {
    slug: "relationship-evidence-example",
    title: "Relationship Evidence Example",
    description: "See an example of a timeline-style relationship evidence page.",
    metaDescription:
      "A sample relationship evidence timeline page showing how photos and events can be organized clearly for immigration applications such as I-130.",
    intro:
      "Many couples struggle to organize relationship evidence for immigration applications such as I-130. Below is a simple example of a clean timeline format that groups photos and events in a clear and structured way.",
    relatedSlugs: [
      "how-to-organize-relationship-evidence",
      "i130-evidence-checklist",
      "what-counts-as-relationship-evidence",
      "how-many-photos-for-i130",
    ],
    content: [
      {
        type: "image",
        src: "/timelinedoc_example.png",
        alt: "Sample relationship evidence timeline page generated with TimelineDoc",
        caption:
          "Sample relationship evidence timeline page generated with TimelineDoc",
      },
      { type: "h2", text: "How this example is structured" },
      {
        type: "ul",
        items: [
          "Each page represents a specific event (e.g. wedding, trip, daily life)",
          "Photos are grouped chronologically",
          "Short descriptions provide context for each event",
          "The layout is clean and easy to review",
        ],
      },
      { type: "h2", text: "Common use cases" },
      {
        type: "p",
        text: "This type of timeline format can help organize relationship history into a clear and structured document.",
      },
      {
        type: "ul",
        items: [
          "I-130 relationship evidence",
          "Spouse visa applications",
          "Marriage-based immigration documentation",
          "Personal relationship timeline summaries",
        ],
      },
    ],
  },

  // ── 3 ────────────────────────────────────────────────────────────────────
  {
    slug: "what-counts-as-relationship-evidence",
    title: "What Counts as Relationship Evidence?",
    description:
      "Common types of relationship evidence people include for immigration cases.",
    metaDescription:
      "An overview of common relationship evidence types — photos, documents, travel records, and more — used in immigration applications.",
    intro:
      "Immigration applications that involve a spouse or partner typically require evidence of a genuine relationship. Here is an overview of the most common types of evidence people include.",
    relatedSlugs: [
      "how-to-organize-relationship-evidence",
      "i130-evidence-checklist",
      "how-many-photos-for-i130",
      "relationship-evidence-example",
    ],
    content: [
      { type: "h2", text: "Photos together" },
      {
        type: "p",
        text: "Photos are among the most straightforward forms of evidence. A selection of photos over time — showing you in different locations, with family, and at significant events — can paint a clear picture of your shared history.",
      },
      {
        type: "ul",
        items: [
          "Photos from different dates and locations",
          "Photos with family or friends",
          "Photos from vacations or events",
          "Everyday photos showing shared life",
        ],
      },
      { type: "h2", text: "Joint financial records" },
      {
        type: "p",
        text: "Shared financial accounts, leases, or ownership documents demonstrate that you have built a life together.",
      },
      {
        type: "ul",
        items: [
          "Joint bank account statements",
          "Shared lease or mortgage",
          "Joint utility bills",
          "Insurance documents listing both names",
        ],
      },
      { type: "h2", text: "Travel records" },
      {
        type: "p",
        text: "Trips taken together can serve as strong evidence of an ongoing relationship, especially if they span multiple years.",
      },
      {
        type: "ul",
        items: [
          "Boarding passes or booking confirmations showing both names",
          "Hotel reservations",
          "Passport stamps",
        ],
      },
      { type: "h2", text: "Messages and communications" },
      {
        type: "p",
        text: "Records of regular communication over time can support evidence of a genuine relationship, particularly for couples who have spent time apart.",
      },
      {
        type: "ul",
        items: [
          "Call logs or messaging app screenshots",
          "Email correspondence",
          "Video call records",
        ],
      },
      { type: "h2", text: "Other supporting documents" },
      {
        type: "ul",
        items: [
          "Wedding certificate (if applicable)",
          "Affidavits from friends or family",
          "Invitations to shared events",
          "Social media posts or profiles listing your relationship",
        ],
      },
    ],
  },

  // ── 4 ────────────────────────────────────────────────────────────────────
  {
    slug: "how-many-photos-for-i130",
    title: "How Many Photos for I-130?",
    description:
      "Learn how many photos to include and how to organize them effectively.",
    metaDescription:
      "Learn how many photos to include for I-130 relationship evidence, what types to choose, and how to organize them into a clear timeline.",
    intro:
      "There is no official number of photos required for an I-130 petition. The right approach depends on your individual situation. This page covers what types of photos are commonly included and how to organize them effectively.",
    relatedSlugs: [
      "how-to-organize-relationship-evidence",
      "i130-evidence-checklist",
      "what-counts-as-relationship-evidence",
      "relationship-evidence-example",
    ],
    content: [
      { type: "h2", text: "Short Answer" },
      {
        type: "p",
        text: "There is no fixed number of photos required for I-130 relationship evidence. Applicants typically include a representative selection of photos that shows the relationship over time.",
      },
      {
        type: "p",
        text: "A well-chosen set of photos tends to be more useful than a large volume of similar images. The focus is usually on:",
      },
      {
        type: "ul",
        items: [
          "Variety — different events, locations, and time periods",
          "Context — photos that show shared experiences",
          "Timeline — coverage across the length of the relationship",
        ],
      },
      { type: "h2", text: "What USCIS Typically Looks For" },
      {
        type: "p",
        text: "Based on publicly available USCIS guidance and common applicant experiences, relationship evidence is used to demonstrate that a relationship is genuine and ongoing.",
      },
      { type: "p", text: "Photos can help illustrate:" },
      {
        type: "ul",
        items: [
          "How the couple met and spent time together",
          "Important milestones (trips, engagement, wedding)",
          "Interactions with each other's families or social circles",
        ],
      },
      {
        type: "p",
        text: "Photos are usually considered alongside other types of evidence, such as travel records, communication history, or shared documents.",
      },
      { type: "h2", text: "What Types of Photos to Include" },
      {
        type: "p",
        text: "Many applicants choose photos that represent different moments in their relationship, such as:",
      },
      { type: "h3", text: "Early relationship" },
      { type: "ul", items: ["First meetings", "Early dates"] },
      { type: "h3", text: "Trips and shared experiences" },
      { type: "ul", items: ["Travel photos", "Holidays or events"] },
      { type: "h3", text: "Major milestones" },
      {
        type: "ul",
        items: ["Engagement", "Wedding", "Moving in together"],
      },
      { type: "h3", text: "Social context" },
      {
        type: "ul",
        items: ["Photos with friends", "Photos with family members"],
      },
      {
        type: "p",
        text: "Including variety is generally more helpful than including many similar photos.",
      },
      { type: "h2", text: "How to Select the Right Photos" },
      { type: "p", text: "Instead of uploading everything, many applicants:" },
      {
        type: "ul",
        items: [
          "Choose a few representative photos per event",
          "Avoid duplicates or very similar images",
          "Include photos from different time periods",
        ],
      },
      {
        type: "p",
        text: "A small, well-selected set of photos can be easier to review than a large, repetitive collection.",
      },
      { type: "h2", text: "How to Organize Photos for I-130" },
      {
        type: "p",
        text: "A common approach is to organize photos into a timeline format, for example:",
      },
      {
        type: "ul",
        items: [
          "2019 — First meeting",
          "2020 — Trips together",
          "2021 — Engagement",
          "2022 — Marriage",
        ],
      },
      { type: "p", text: "Each section may include:" },
      {
        type: "ul",
        items: ["2–4 photos", "A short caption (date, location, context)"],
      },
      {
        type: "p",
        text: "This structure helps present the relationship clearly.",
      },
      { type: "h2", text: "Common Mistakes to Avoid" },
      {
        type: "ul",
        items: [
          "Including too many similar photos",
          "Not providing context (dates or locations)",
          "Mixing unrelated photos together",
          "No clear chronological order",
        ],
      },
      { type: "p", text: "Clarity is usually more important than volume." },
      { type: "h2", text: "Final Thoughts" },
      {
        type: "p",
        text: "There is no fixed number of photos required for I-130 relationship evidence. Each case is different.",
      },
      {
        type: "p",
        text: "Applicants typically focus on selecting photos that show variety — different time periods, locations, and shared experiences — rather than maximizing the number of images.",
      },
      {
        type: "p",
        text: "Organizing photos into a clear timeline structure can make your evidence easier to review.",
      },
    ],
  },

  // ── 5 ────────────────────────────────────────────────────────────────────
  {
    slug: "i130-evidence-checklist",
    title: "I-130 Relationship Evidence Checklist",
    description:
      "A simple checklist of common relationship evidence people include for I-130 applications.",
    metaDescription:
      "A simple I-130 relationship evidence checklist covering photos, travel records, communication, and documents to help organize your application.",
    intro:
      "Preparing relationship evidence for an I-130 petition can feel overwhelming.",
    relatedSlugs: [
      "how-to-organize-relationship-evidence",
      "what-counts-as-relationship-evidence",
      "relationship-evidence-example",
      "how-many-photos-for-i130",
    ],
    content: [
      {
        type: "p",
        text: "Many applicants are unsure what to include, how much evidence is needed, and how to organize everything clearly.",
      },
      {
        type: "p",
        text: "This checklist summarizes commonly used types of relationship evidence based on publicly available guidance and typical applicant practices.",
      },
      {
        type: "p",
        text: "U.S. Citizenship and Immigration Services (USCIS) provides official instructions for Form I-130 on their website.",
      },
      {
        type: "link-note",
        prefix: "Official guidance:",
        linkText: "USCIS Form I-130 (uscis.gov)",
        href: "https://www.uscis.gov/i-130",
      },
      { type: "h2", text: "Quick Checklist" },
      {
        type: "p",
        text: "Most applicants include a combination of the following:",
      },
      {
        type: "ul",
        items: [
          "Photos together",
          "Travel records",
          "Communication history",
          "Proof of shared life (financial or residential)",
          "Statements or supporting documents",
        ],
      },
      {
        type: "p",
        text: "Not every case includes all items — the goal is to show a genuine and ongoing relationship.",
      },
      { type: "h2", text: "1. Photos Together" },
      {
        type: "p",
        text: "Photos are one of the most commonly included types of evidence.",
      },
      { type: "p", text: "Many applicants include:" },
      {
        type: "ul",
        items: [
          "Photos from different time periods",
          "Trips and shared activities",
          "Holidays and events",
          "Photos with friends and family",
        ],
      },
      {
        type: "p",
        text: "A smaller number of well-chosen photos is usually more effective than a large number of similar images.",
      },
      {
        type: "link-note",
        prefix: "See also:",
        linkText: "How many photos for I-130",
        href: "/resources/how-many-photos-for-i130",
      },
      { type: "h2", text: "2. Travel Records" },
      {
        type: "p",
        text: "Travel documents can help show time spent together.",
      },
      { type: "p", text: "Examples include:" },
      {
        type: "ul",
        items: [
          "Flight tickets",
          "Boarding passes",
          "Hotel bookings",
          "Travel itineraries",
        ],
      },
      {
        type: "p",
        text: "These can provide additional context when paired with photos.",
      },
      { type: "h2", text: "3. Communication History" },
      {
        type: "p",
        text: "Some applicants include records of ongoing communication, such as:",
      },
      {
        type: "ul",
        items: ["Chat screenshots", "Call logs", "Emails"],
      },
      {
        type: "p",
        text: "It is common to include a small sample rather than full message histories.",
      },
      { type: "h2", text: "4. Proof of Shared Life" },
      {
        type: "p",
        text: "Documents showing shared responsibilities or living arrangements may include:",
      },
      {
        type: "ul",
        items: [
          "Joint bank accounts",
          "Lease or rental agreements",
          "Utility bills",
          "Insurance policies",
        ],
      },
      {
        type: "p",
        text: "Not all applicants will have these documents, depending on their situation.",
      },
      { type: "h2", text: "5. Milestones and Events" },
      {
        type: "p",
        text: "Important relationship milestones can help show how the relationship developed.",
      },
      { type: "p", text: "Examples:" },
      {
        type: "ul",
        items: [
          "Engagement",
          "Wedding",
          "Moving in together",
          "Visits to each other's families",
        ],
      },
      { type: "h2", text: "How to Organize Your Evidence" },
      {
        type: "p",
        text: "Many applicants organize their evidence into a timeline format, such as:",
      },
      {
        type: "ul",
        items: [
          "Year or date-based sections",
          "Each section includes photos + supporting documents",
          "Short captions explaining context",
        ],
      },
      {
        type: "p",
        text: "This approach can make your evidence easier to review.",
      },
      {
        type: "link-note",
        prefix: "See:",
        linkText: "How to organize relationship evidence",
        href: "/resources/how-to-organize-relationship-evidence",
      },
      { type: "h2", text: "Common Mistakes to Avoid" },
      {
        type: "ul",
        items: [
          "Including too many repetitive photos",
          "Missing dates or descriptions",
          "Uploading unorganized files",
          "Mixing unrelated documents together",
        ],
      },
      {
        type: "p",
        text: "Clarity and structure are usually more helpful than volume.",
      },
      { type: "h2", text: "Creating a Clear Evidence Document" },
      {
        type: "p",
        text: "Manually organizing photos and documents into a clean format can take time.",
      },
      { type: "p", text: "Some applicants choose to:" },
      {
        type: "ul",
        items: [
          "Sort photos by date",
          "Group evidence into events",
          "Create a structured PDF timeline",
        ],
      },
      {
        type: "p",
        text: "TimelineDoc can help you turn your photos into a clean timeline-style document.",
      },
    ],
  },
];

/** Look up a resource by slug. Returns undefined if not found. */
export function getResource(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
