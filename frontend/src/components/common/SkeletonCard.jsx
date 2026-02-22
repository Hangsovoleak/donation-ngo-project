// Common UI component: Skeleton loading card
// using it in NGOCard.jsx to show skeleton while loading
function SkeletonCard({ keyId }) {
    return (
        <div
            key={keyId}
            className="rounded-2xl border border-white/70 bg-white/85 p-4 animate-pulse"
        >
            <div className="h-36 rounded-xl bg-slate-200/70" />
            <div className="mt-4 h-4 w-2/3 rounded bg-slate-200/70" />
            <div className="mt-2 h-3 w-full rounded bg-slate-200/70" />
            <div className="mt-2 h-3 w-5/6 rounded bg-slate-200/70" />
            <div className="mt-4 h-8 w-24 rounded-full bg-slate-200/70" />
        </div>
    );
}

export default SkeletonCard;
