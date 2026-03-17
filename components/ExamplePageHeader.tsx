import Link from "next/link";

export function ExamplePageHeader() {
  return (
    <header className="h-[76px] border-b border-warm-200 bg-warm-25/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 flex items-center px-5">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-6 h-6 rounded bg-terracotta-100 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="#C67B5C" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="#C67B5C" opacity="0.6" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="#C67B5C" opacity="0.6" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="#C67B5C" opacity="0.3" />
          </svg>
        </div>
        <span className="font-semibold text-warm-900 tracking-tight text-sm group-hover:text-terracotta-500 transition-colors">
          TimelineDoc
        </span>
      </Link>

      <div className="flex-1" />

      <nav className="flex items-center gap-1">
        <Link
          href="/example"
          className="px-3 py-1.5 text-xs font-medium text-warm-600 hover:text-warm-900 hover:bg-warm-100 rounded-lg transition-colors"
        >
          Examples
        </Link>
        <Link
          href="/"
          className="px-3 py-1.5 text-xs font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 rounded-lg transition-colors ml-1"
        >
          Try for free →
        </Link>
      </nav>
    </header>
  );
}
