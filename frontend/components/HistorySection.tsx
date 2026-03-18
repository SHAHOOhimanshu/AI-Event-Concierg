"use client";

import { useEffect, useState } from "react";
import { fetchHistory, deleteEvent, EventRecord } from "@/services/api";
import EventCard from "./EventCard";
import { ClockIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function HistorySection() {
    const [history, setHistory] = useState<EventRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchHistory();
            setHistory(data);
        } catch {
            setError("Failed to load history. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEvent(id);
            setHistory((prev) => prev.filter((item) => item.id !== id));
        } catch {
            alert("Failed to delete event.");
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <section className="mt-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-violet-400" />
                    <h2 className="text-xl font-bold text-white">Previous Searches</h2>
                    {history.length > 0 && (
                        <span className="ml-1 text-xs bg-violet-700/60 text-violet-200 px-2 py-0.5 rounded-full">
                            {history.length}
                        </span>
                    )}
                </div>
                <button
                    onClick={loadHistory}
                    className="flex items-center gap-1.5 text-xs text-violet-300 hover:text-white transition-colors"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* States */}
            {loading && (
                <div className="text-center py-8 text-white/40 text-sm">Loading history…</div>
            )}

            {error && (
                <div className="rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-sm px-4 py-3">
                    {error}
                </div>
            )}

            {!loading && !error && history.length === 0 && (
                <div className="text-center py-10 text-white/30 text-sm">
                    No previous searches yet. Plan your first event above! 🎉
                </div>
            )}

            {!loading && !error && history.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {history.map((record) => (
                        <div key={record.id} className="flex flex-col">
                            <p className="text-xs text-white/30 mb-1.5 truncate flex-shrink-0">
                                &ldquo;{record.query}&rdquo;
                            </p>
                            <div className="flex-1">
                                <EventCard
                                    venueName={record.response.venue_name}
                                    location={record.response.location}
                                    estimatedCost={record.response.estimated_cost}
                                    whyItFits={record.response.why_it_fits}
                                    onDelete={() => handleDelete(record.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
