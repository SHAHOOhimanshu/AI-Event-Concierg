import { GeminiResponse } from "@/services/api";
import {
    MapPinIcon,
    CurrencyDollarIcon,
    BuildingLibraryIcon,
    LightBulbIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

interface EventCardProps {
    venueName: string;
    location: string;
    estimatedCost: string;
    whyItFits: string;
    isNew?: boolean;
    onDelete?: () => void;
}

export default function EventCard({
    venueName,
    location,
    estimatedCost,
    whyItFits,
    isNew = false,
    onDelete,
}: EventCardProps) {
    return (
        <div
            className={`relative h-full flex flex-col rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]
        ${isNew
                    ? "border-violet-500/60 bg-violet-950/40 shadow-lg shadow-violet-900/30"
                    : "border-white/10 bg-white/5 shadow-md"
                }`}
        >
            {isNew && (
                <span className="absolute top-4 right-4 text-xs font-semibold bg-violet-600 text-white px-2 py-0.5 rounded-full">
                    New
                </span>
            )}

            {onDelete && !isNew && (
                <button
                    onClick={onDelete}
                    className="absolute top-4 right-4 text-white/30 hover:text-red-400 transition-colors p-1"
                    title="Delete event"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}

            {/* Venue Name */}
            <div className="flex items-center gap-2 mb-4 pr-8">
                <BuildingLibraryIcon className="w-6 h-6 text-violet-400 flex-shrink-0" />
                <h3 className="text-xl font-bold text-white">{venueName}</h3>
            </div>

            <div className="space-y-3 text-sm">
                {/* Location */}
                <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="text-white/50 uppercase text-xs font-semibold tracking-widest">Location</span>
                        <p className="text-white/90">{location}</p>
                    </div>
                </div>

                {/* Cost */}
                <div className="flex items-start gap-2">
                    <CurrencyDollarIcon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="text-white/50 uppercase text-xs font-semibold tracking-widest">Estimated Cost</span>
                        <p className="text-emerald-300 font-semibold">{estimatedCost}</p>
                    </div>
                </div>

                {/* Why It Fits */}
                <div className="flex items-start gap-2">
                    <LightBulbIcon className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="text-white/50 uppercase text-xs font-semibold tracking-widest">Why It Fits</span>
                        <div className="max-h-[140px] overflow-y-auto pr-3 mt-1 custom-scrollbar">
                            <p className="text-white/80 leading-relaxed">{whyItFits}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
