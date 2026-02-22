import NgoCard from "../Card";
import SkeletonCard from "../common/SkeletonCard";

// Browse page component: NGO grid with loading and empty states
// using it in Browse.jsx to display NGOs
function NGOGrid({ ngos, loading, isFetching, error, onClearFilters }) {
    if (error) {
        return <div className="text-sm text-red-500">{error}</div>;
    }
    //display loading state while fetching NGOs (first load only)
    if (loading && ngos.length === 0) {
        return (
            //while loading waiting for backend accept with data for displaying on page browse
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    
                    <SkeletonCard key={`skeleton-${i}`} keyId={`skeleton-${i}`} />
                ))}
            </div>
        );
    }
    //display empty state when no NGOs are found
    if (ngos.length === 0) {
        return (
            <div className="rounded-2xl border border-white/70 bg-white/85 p-8 text-center">
                <div className="text-lg font-semibold text-slate-900">No NGOs found</div>
                <div className="mt-2 text-sm text-slate-600">
                    Try clearing filters or use a different search term.
                </div>
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-4 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-black"
                >
                    Clear filters
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {isFetching ? (
                <div className="inline-flex items-center rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                    Updating results...
                </div>
            ) : null}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ngos.map((ngo) => (
                    <NgoCard key={ngo.id} ngo={ngo} />
                ))}
            </div>
        </div>
    );
}

export default NGOGrid;
