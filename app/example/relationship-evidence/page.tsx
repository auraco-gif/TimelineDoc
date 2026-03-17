import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExamplePageHeader } from "@/components/ExamplePageHeader";

export const metadata: Metadata = {
  title: "Relationship Evidence Example (Timeline PDF)",
  description:
    "A simple example of how to organize relationship evidence into a clean timeline PDF for immigration applications such as I-130.",
};

const HOW_IT_WORKS = [
  "Each page represents a specific event (e.g. wedding, trip, daily life)",
  "Photos are grouped chronologically",
  "Short descriptions provide context",
  "The layout is clean and easy to review",
];

const USE_CASES = [
  "I-130 relationship evidence",
  "Spouse visa applications",
  "Marriage-based immigration documentation",
  "Personal relationship timeline summaries",
];

export default function RelationshipEvidencePage() {
  return (
    <div className="min-h-screen bg-warm-50">
      <ExamplePageHeader />

      <main className="pt-[76px]">
        <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">
          {/* Back link */}
          <Link
            href="/example"
            className="inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All examples
          </Link>

          {/* Title + intro */}
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-warm-900 tracking-tight leading-snug">
              Relationship Evidence Example (Timeline PDF)
            </h1>
            <p className="text-base text-warm-600 leading-relaxed">
              Many couples struggle to organize relationship evidence for
              immigration applications such as I-130. Below is a simple example
              of a clean timeline format that groups photos and events in a
              clear and structured way.
            </p>
          </div>

          {/* Image section */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-400">
              Relationship Evidence Example
            </p>
            <div className="rounded-2xl overflow-hidden border border-warm-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/timelinedoc_example.png"
                alt="Sample relationship evidence timeline page generated with TimelineDoc"
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-warm-400 text-center">
              Sample relationship evidence timeline page generated with TimelineDoc
            </p>
          </div>

          {/* How it's structured */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-warm-900 tracking-tight">
              How this example is structured
            </h2>
            <ul className="space-y-2.5">
              {HOW_IT_WORKS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-warm-600 leading-relaxed"
                >
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Use cases */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-warm-900 tracking-tight">
              Common use cases
            </h2>
            <p className="text-sm text-warm-600 leading-relaxed">
              This type of timeline format can help organize relationship history
              into a clear and structured document.
            </p>
            <ul className="space-y-2.5">
              {USE_CASES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-warm-600 leading-relaxed"
                >
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-warm-100 border border-warm-200 rounded-2xl p-8 space-y-4">
            <h2 className="text-lg font-semibold text-warm-900 tracking-tight">
              Create your own timeline
            </h2>
            <p className="text-sm text-warm-600 leading-relaxed">
              Instead of manually organizing photos and documents, you can
              generate a clean timeline PDF in seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 transition-colors shadow-sm"
            >
              Create your timeline →
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="border border-warm-200 rounded-xl p-6 space-y-2 bg-[#FFFDFC]">
            <h2 className="text-sm font-semibold text-warm-700">Disclaimer</h2>
            <p className="text-xs text-warm-500 leading-relaxed">
              This page is for informational purposes only and does not
              constitute legal advice. TimelineDoc is not affiliated with USCIS
              or any government agency. The example shown above is a sample
              format generated for demonstration purposes only. Applicants
              should consult official sources or a qualified immigration
              attorney for guidance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
