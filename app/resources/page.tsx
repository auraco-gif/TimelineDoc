import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RESOURCES } from "@/lib/resources";
import { ResourcePageHeader } from "@/components/ResourcePageHeader";

export const metadata: Metadata = {
  title: "Resources — TimelineDoc",
  description:
    "Guides, examples, and tips for organizing relationship evidence and creating timeline PDFs.",
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-warm-50">
      <ResourcePageHeader />

      <main className="pt-[76px]">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
          {/* Page header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">
              Resources
            </h1>
            <p className="text-sm text-warm-600 leading-relaxed">
              Guides and examples to help you organize relationship evidence and
              create clear timeline documents.
            </p>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESOURCES.map((resource) => (
              <Link
                key={resource.slug}
                href={`/resources/${resource.slug}`}
                className="group flex flex-col gap-3 p-6 bg-[#FFFDFC] border border-warm-200 rounded-2xl hover:border-warm-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all"
              >
                <div className="flex-1 space-y-1.5">
                  <h2 className="text-sm font-semibold text-warm-900 leading-snug group-hover:text-terracotta-500 transition-colors">
                    {resource.title}
                  </h2>
                  <p className="text-xs text-warm-500 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-terracotta-500">
                  Read more
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-warm-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 transition-colors shadow-sm"
            >
              Create your timeline →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
