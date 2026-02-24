/**
 * Software Framework: React (Frontend)
 * Description:
 *      Pagination control component with Next/Back buttons and page indicators.
 * 
 */

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Pagination controls component.
 * 
 * @param currentPage Current active page number.
 * @param totalPages Cumulative count of available pages.
 * @param onPrev Callback for previous page.
 * @param onNext Callback for next page.
 * @param loading Boolean loading state.
 * @param isFetching Boolean refresh state.
 */
function Pagination({ currentPage, totalPages, onPrev, onNext, loading, isFetching }) {
    // Reserve space even if hidden to prevent footer/bottom layout shifts
    if (!totalPages || totalPages <= 1 || loading) {
        return <div className="h-[42px] w-full" aria-hidden="true" />;
    }

    return (
        <div className="flex items-center justify-center gap-3">
            <button
                type="button"
                onClick={onPrev}
                disabled={currentPage <= 1 || isFetching}
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
                Back
            </button>
            <div className="text-sm text-slate-700">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
            </div>
            <button
                type="button"
                onClick={onNext}
                disabled={currentPage >= totalPages || isFetching}
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
