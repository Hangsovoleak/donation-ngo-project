/**
 * Software Framework: React (Frontend)
 * Description:
 *      Responsive grid layout to display NGO cards, including loading 
 *      skeletons and empty state handling.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import NgoCard from "../Card";
import SkeletonCard from "../common/SkeletonCard";

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief NGO Results Grid component.
 * 
 * @param ngos Array of NGO data objects.
 * @param loading Boolean indicating if data is loading.
 * @param isFetching Boolean indicating if background refresh is active.
 * @param error Error message string if fetch failed.
 * @param onClearFilters Callback to reset filters from empty state.
 */
function NGOGrid({ ngos, loading, isFetching, error, onClearFilters }) {
    // Handle error state
    if (error) {
        return <div className="text-sm text-red-500">{error}</div>;
    }

    // Handle initial loading state with skeletons
    if (loading && ngos.length === 0) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={`skeleton-${i}`} keyId={`skeleton-${i}`} />
                ))}
            </div>
        );
    }

    // Handle empty results state
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
            {/* Reserved space for fetch indicator to prevent layout shift */}
            <div className="h-8 mb-1">
                {isFetching && (
                    <div className="inline-flex items-center rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 animate-in fade-in slide-in-from-top-1 duration-300">
                        Updating results...
                    </div>
                )}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ngos.map((ngo) => (
                    <NgoCard key={ngo.id} ngo={ngo} />
                ))}
            </div>
        </div>
    );
}

export default NGOGrid;
