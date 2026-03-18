"use client";

import { useState } from "react";
import { generateEvent, EventRecord } from "@/services/api";
import EventCard from "@/components/EventCard";
import HistorySection from "@/components/HistorySection";
import Spinner from "@/components/Spinner";
import { SparklesIcon } from "@heroicons/react/24/solid";


// hi
const EXAMPLES = [
  "Plan a 10-person leadership retreat in the mountains for 3 days with a $4000 budget",
  "Organize a 50-person outdoor wedding in the Tuscan hills with a $15,000 budget",
  "Host a tech startup team-building event in NYC for 20 people, 1 day, $3,000",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EventRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await generateEvent(query.trim());
      setResult(data);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detail = (err as any)?.response?.data?.detail || "";
      if (detail.includes("Gemini") || detail.includes("Failed to parse") || !detail) {
        setError("API is expire or not responding. Please try again.");
      } else {
        setError(detail || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0614] text-white">
      {/* Ambient glow background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-700/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-pink-700/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-indigo-700/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14">

          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-violet-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent leading-tight mb-4">
            AI Event Concierge
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Describe your event in plain English. Our AI finds the perfect
            venue, fit for your budget and vision.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-xl mb-8">
          <label
            htmlFor="query"
            className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-widest"
          >
            Describe your event
          </label>
          <textarea
            id="query"
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder='e.g. "Plan a 10-person leadership retreat in the mountains for 3 days with a $4000 budget"'
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/60 transition disabled:opacity-50"
          />

          {/* Example chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="text-xs text-violet-300/70 border border-violet-700/30 bg-violet-900/20 hover:bg-violet-700/30 hover:text-violet-200 rounded-full px-3 py-1 transition truncate max-w-xs"
              >
                {ex.length > 50 ? ex.slice(0, 50) + "…" : ex}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-white/30">Ctrl + Enter to submit</p>
            <button
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40"
            >
              <SparklesIcon className="w-4 h-4" />
              {loading ? "Planning…" : "Plan My Event"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <Spinner />}

        {/* Error Banner */}
        {error && (
          <div className="rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-sm px-5 py-4 mb-6 flex items-start gap-2">
            <span className="text-red-400 font-bold">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        {result && !loading && (
          <div className="mb-6">
            <p className="text-xs text-white/30 mb-2 uppercase tracking-widest">
              AI Recommendation
            </p>
            <EventCard
              venueName={result.response.venue_name}
              location={result.response.location}
              estimatedCost={result.response.estimated_cost}
              whyItFits={result.response.why_it_fits}
              isNew
            />
          </div>
        )}

        {/* History Section */}
        <HistorySection />

        {/* Footer */}
        <footer className="mt-20 text-center text-white/20 text-xs">
          AI Event Concierge • Built with Next.js, FastAPI & Google Gemini
        </footer>
      </div>
    </main>
  );
}
