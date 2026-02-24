/**
 * Software Framework: React (Frontend)
 * Description:
 *      A placeholder loading skeleton meant to mimic the NGO card layout.
 * 
 */

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Skeleton Card loader component.
 * 
 * @param keyId Unique key for mapping.
 */
function SkeletonCard({ keyId }) {
    return (
        <div
            key={keyId}
            className="card h-full overflow-hidden animate-pulse"
        >
            {/* Image Placeholder matches h-44 */}
            <div className="h-44 w-full bg-slate-200/70" />

            {/* Content Placeholder matches p-5 and flex-col */}
            <div className="p-5 flex flex-col space-y-3">
                <div className="h-5 w-2/3 rounded bg-slate-200/70" />
                <div className="h-3 w-full rounded bg-slate-200/70" />
                <div className="h-3 w-5/6 rounded bg-slate-200/70" />

                <div className="pt-2 space-y-2">
                    <div className="h-2 w-1/2 rounded bg-slate-100/70" />
                    <div className="h-2 w-3/4 rounded bg-slate-100/70" />
                </div>

                <div className="mt-4 h-9 w-full rounded-lg bg-slate-200/70" />
            </div>
        </div>
    );
}

export default SkeletonCard;
