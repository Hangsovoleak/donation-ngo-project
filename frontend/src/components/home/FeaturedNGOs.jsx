/**
 * Software Framework: React (Frontend)
 * Description:
 *      A section component for the home page that displays a carousel 
 *      or grid of featured verified NGOs.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Link } from "react-router-dom";
import NgoCard from "../Card";
import SkeletonCard from "../common/SkeletonCard";

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Featured NGOs section component.
 * 
 * @param ngos Array of featured NGO records.
 * @param error Error state if fetching failed.
 * @param loading Boolean loading indicator.
 */
function FeaturedNGOs({ ngos, error, loading }) {
    return (
        <section className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-4">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-xl md:text-3xl font-semibold text-slate-900">
                            Featured verified NGOs
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            A quick preview. Open Browse for full filters.
                        </p>
                    </div>
                    <Link
                        to="/browse"
                        className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                        View all →
                    </Link>
                </div>

                {error && <div className="mt-3 text-sm text-red-500">{error}</div>}

                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading
                        ? [...Array(6)].map((_, i) => (
                            <SkeletonCard key={`featured-skeleton-${i}`} keyId={`featured-skeleton-${i}`} />
                        ))
                        : ngos.map((ngo) => <NgoCard key={ngo.id} ngo={ngo} />)}
                </div>
            </div>
        </section>
    );
}

export default FeaturedNGOs;
