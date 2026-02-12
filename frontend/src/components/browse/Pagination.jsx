// Browse page component: Pagination controls
function Pagination({ currentPage, totalPages, onPrev, onNext, loading }) {
    if (!totalPages || totalPages <= 1 || loading) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-3">
            <button
                type="button"
                onClick={onPrev}
                disabled={currentPage <= 1}
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold disabled:opacity-50"
            >
                Prev
            </button>
            <div className="text-sm text-slate-700">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
            </div>
            <button
                type="button"
                onClick={onNext}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
