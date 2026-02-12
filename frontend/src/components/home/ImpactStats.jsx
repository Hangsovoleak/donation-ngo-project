import { Building2, Users, TrendingUp } from "lucide-react";

// Home page component: Impact statistics cards
function ImpactStats() {
    return (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-6 text-center hover:scale-105 transition-transform">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-4">
                    <Building2 className="text-blue-600" size={32} />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">20+</div>
                <div className="text-sm font-semibold text-slate-700">Verified NGOs</div>
                <p className="text-xs text-slate-500 mt-2">Trusted organizations making real impact</p>
            </div>

            <div className="card p-6 text-center hover:scale-105 transition-transform">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-4">
                    <Users className="text-green-600" size={32} />
                </div>
                <div className="text-3xl font-bold gradient-text-accent mb-2">5K+</div>
                <div className="text-sm font-semibold text-slate-700">Lives Impacted</div>
                <p className="text-xs text-slate-500 mt-2">People helped through donations</p>
            </div>

            <div className="card p-6 text-center hover:scale-105 transition-transform sm:col-span-2 lg:col-span-1">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-4">
                    <TrendingUp className="text-purple-600" size={32} />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-700">Transparency</div>
                <p className="text-xs text-slate-500 mt-2">Direct connection to NGOs</p>
            </div>
        </section>
    );
}

export default ImpactStats;
