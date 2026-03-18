export default function Spinner() {
    return (
        <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-violet-300 text-sm font-medium tracking-wide animate-pulse">
                AI is planning your event…
            </p>
        </div>
    );
}
