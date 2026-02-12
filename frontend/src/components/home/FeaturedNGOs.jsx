import { Link } from "react-router-dom";
import NgoCard from "../Card";

// Home page component: Featured NGOs section
function FeaturedNGOs({ ngos, error }) {
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

                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {ngos.map((ngo) => (
                        <NgoCard key={ngo.id} ngo={ngo} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedNGOs;
