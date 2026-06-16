"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Flame, Zap, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type Category = {
  name: string;
  score: number;
  verdict: string;
  positives: string[];
  improvements: string[];
};

type RoastResult = {
  url: string;
  overallScore: number;
  summary: string;
  categories: Category[];
  topFixes: string[];
};

function scoreStyle(score: number) {
  if (score >= 7) return { bar: "bg-emerald-500", text: "text-emerald-500", ring: "ring-emerald-500/20", bg: "bg-emerald-500/10 dark:bg-emerald-500/15", label: "Looking good" };
  if (score >= 5) return { bar: "bg-amber-500", text: "text-amber-500", ring: "ring-amber-500/20", bg: "bg-amber-500/10 dark:bg-amber-500/15", label: "Needs work" };
  return { bar: "bg-red-500", text: "text-red-500", ring: "ring-red-500/20", bg: "bg-red-500/10 dark:bg-red-500/15", label: "Ouch" };
}

function ScoreBar({ score, animate = false }: { score: number; animate?: boolean }) {
  const { bar } = scoreStyle(score);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: animate ? 0.2 : 0 }}
        />
      </div>
      <span className="text-sm font-bold tabular-nums w-4 text-right text-zinc-700 dark:text-zinc-300">
        {score}
      </span>
    </div>
  );
}

function OverallScore({ score }: { score: number }) {
  const { text, bg, ring, label } = scoreStyle(score);
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`inline-flex flex-col items-center rounded-2xl px-8 py-5 ring-4 ${ring} ${bg} shrink-0`}
    >
      <span className={`text-5xl font-black leading-none ${text}`}>{score}</span>
      <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-1.5 uppercase tracking-wide">
        /10 · {label}
      </span>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function RoastMySite() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong — give it another shot");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start the roast — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-10"
      >
        <ArrowLeft size={14} /> All tools
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 text-orange-500">
            <Flame size={20} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Roast My Site
          </h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Drop any URL and get an honest AI critique — copy, UX, CTAs, and SEO. No sugarcoating.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-2.5 mb-10">
        <input
          type="text"
          required
          placeholder="yoursite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold px-5 py-3 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Roasting…" : "Roast it 🔥"}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSkeleton />
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-4 text-sm text-red-700 dark:text-red-400"
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as React.SyntheticEvent<HTMLFormElement>)}
              className="ml-6 text-xs font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Try again →
            </button>
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Overall score */}
            <motion.div
              variants={cardVariants}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
            >
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-5">
                Overall Score
              </p>
              <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
                <OverallScore score={result.overallScore} />
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  {result.summary}
                </p>
              </div>
            </motion.div>

            {/* Category cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {result.categories.map((cat) => (
                <motion.div
                  key={cat.name}
                  variants={cardVariants}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {cat.name}
                    </h3>
                  </div>
                  <ScoreBar score={cat.score} animate />
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 italic mt-2.5 mb-3">
                    {cat.verdict}
                  </p>

                  {cat.positives.length > 0 && (
                    <ul className="space-y-1.5 mb-2">
                      {cat.positives.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
                          <CheckCircle size={12} className="shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}

                  {cat.improvements.length > 0 && (
                    <ul className="space-y-1.5">
                      {cat.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-red-500 dark:text-red-400 leading-relaxed">
                          <XCircle size={12} className="shrink-0 mt-0.5" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Top fixes */}
            <motion.div
              variants={cardVariants}
              className="rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5 p-6"
            >
              <h3 className="font-semibold text-orange-900 dark:text-orange-400 mb-4 flex items-center gap-2">
                <Zap size={16} /> Top fixes
              </h3>
              <ol className="space-y-3">
                {result.topFixes.map((fix, i) => (
                  <li key={i} className="flex gap-3 text-sm text-orange-800 dark:text-orange-300 leading-relaxed">
                    <span className="font-bold shrink-0 text-orange-400 dark:text-orange-500 tabular-nums">
                      {i + 1}.
                    </span>
                    {fix}
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.p
              variants={cardVariants}
              className="text-xs text-center text-zinc-400 dark:text-zinc-600 pb-4"
            >
              Analyzed by Gemini via n8n ·{" "}
              <button
                onClick={() => { setResult(null); setUrl(""); }}
                className="underline hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
              >
                Roast another
              </button>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
