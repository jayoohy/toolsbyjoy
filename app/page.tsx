import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";

const tools = [
  {
    slug: "roastmysite",
    name: "Roast My Site",
    description:
      "Get an honest AI critique of any website — copy clarity, UX, CTAs, and SEO basics. No sugarcoating.",
    icon: Flame,
    status: "Live",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="mb-16">
        <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">
          toolsbyjoy
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5 text-zinc-900 dark:text-zinc-50 leading-[1.1] text-balance">
          AI tools that{" "}
          <span className="text-orange-500">actually</span>
          <br />
          do stuff
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed text-pretty">
          A growing collection of free AI-powered tools. Drop in, get results,
          leave smarter.
        </p>
      </div>

      {/* Tools grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group relative block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-orange-400/60 dark:hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 dark:hover:shadow-orange-500/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 text-orange-500">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 rounded-full px-2.5 py-1">
                  {tool.status}
                </span>
              </div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 text-lg group-hover:text-orange-500 transition-colors duration-200">
                {tool.name}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-orange-500 group-hover:gap-2.5 transition-all duration-200">
                Try it <ArrowRight size={12} />
              </div>
            </Link>
          );
        })}

        {/* Coming soon placeholder */}
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-45">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
            <Sparkles size={16} />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            More tools coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
