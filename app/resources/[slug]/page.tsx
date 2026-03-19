import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RESOURCES, getResourcePage, type ContentBlock } from "@/lib/resources";
import { ResourcePageHeader } from "@/components/ResourcePageHeader";

export async function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourcePage(slug);
  if (!resource) return {};
  return {
    title: `${resource.title} | TimelineDoc`,
    description: resource.metaDescription,
  };
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={index}
          className="text-lg font-semibold text-warm-900 tracking-tight pt-2"
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p key={index} className="text-sm text-warm-600 leading-relaxed">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={index} className="space-y-2">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-warm-600 leading-relaxed"
            >
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <div key={index} className="space-y-3">
          <div className="rounded-2xl overflow-hidden border border-warm-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.src}
              alt={block.alt}
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
          {block.caption && (
            <p className="text-xs text-warm-400 text-center">{block.caption}</p>
          )}
        </div>
      );
  }
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourcePage(slug);

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <ResourcePageHeader />

      <main className="pt-[76px]">
        <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
          {/* Back link */}
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Resources
          </Link>

          {/* Article header */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-warm-900 tracking-tight leading-snug">
              {resource.title}
            </h1>
            <p className="text-base text-warm-600 leading-relaxed">
              {resource.intro}
            </p>
          </div>

          {/* Article content */}
          <div className="space-y-5">
            {resource.content.map((block, i) => renderBlock(block, i))}
          </div>

          {/* CTA */}
          <div className="bg-warm-100 border border-warm-200 rounded-2xl p-8 space-y-4">
            <h2 className="text-lg font-semibold text-warm-900 tracking-tight">
              Create your own timeline
            </h2>
            <p className="text-sm text-warm-600 leading-relaxed">
              Upload your photos and generate a clean, chronological timeline
              PDF in seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 transition-colors shadow-sm"
            >
              Create your timeline →
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="border border-warm-200 rounded-xl p-6 bg-[#FFFDFC]">
            <p className="text-xs font-semibold text-warm-700 mb-1.5">
              Disclaimer
            </p>
            <p className="text-xs text-warm-500 leading-relaxed">
              This page is for informational purposes only and does not
              constitute legal advice. TimelineDoc is not affiliated with USCIS
              or any government agency. Applicants should consult official
              sources or a qualified immigration attorney for guidance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
