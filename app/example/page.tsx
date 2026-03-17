import type { Metadata } from "next";
import Link from "next/link";
import { ExamplePageHeader } from "@/components/ExamplePageHeader";

export const metadata: Metadata = {
  title: "Examples — TimelineDoc",
  description: "See example timeline PDFs created with TimelineDoc.",
};

const EXAMPLES = [
  {
    label: "Relationship Evidence Example",
    description: "Timeline PDF for I-130 and spouse visa applications.",
    href: "/example/relationship-evidence",
    available: true,
  },
  {
    label: "Travel History Example",
    description: "Chronological travel record for visa or border applications.",
    href: "#",
    available: false,
  },
  {
    label: "Personal Timeline Example",
    description: "Life events and memories organized into a clean document.",
    href: "#",
    available: false,
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-warm-50">
      <ExamplePageHeader />

      <main className="pt-[76px]">
        <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">
              Examples
            </h1>
            <p className="text-sm text-warm-600 leading-relaxed">
              See what a TimelineDoc PDF looks like before you create your own.
            </p>
          </div>

          <div className="space-y-2">
            {EXAMPLES.map((item) =>
              item.available ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-4 p-5 bg-[#FFFDFC] border border-warm-200 rounded-xl hover:border-warm-300 hover:bg-warm-100 transition-colors group"
                >
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0 mt-2" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-warm-900 group-hover:text-terracotta-500 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-warm-500">{item.description}</p>
                  </div>
                </Link>
              ) : (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-5 bg-warm-50 border border-warm-200 rounded-xl opacity-50"
                >
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-warm-300 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-warm-700">
                      {item.label}{" "}
                      <span className="text-xs font-normal text-warm-400">— coming soon</span>
                    </p>
                    <p className="text-xs text-warm-400">{item.description}</p>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="pt-2 border-t border-warm-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 transition-colors shadow-sm"
            >
              Create your own timeline →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
