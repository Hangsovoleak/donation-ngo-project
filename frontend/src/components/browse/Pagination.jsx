// Browse page component: Pagination controls
// using it in Browse.jsx to display pagination
function Pagination({ currentPage, totalPages, onPrev, onNext, loading, isFetching }) {
    //check if totalPages is less than 1 or loading is true
    if (!totalPages || totalPages <= 1 || loading) {
        return null;
    }
    //display pagination controls
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
