import { Bookmark, ShieldCheck, MapPin } from "lucide-react";

// Home page component: Quick category filters
function QuickFilters({ categories, categoryIcons, onFilterClick }) {
    const quickByLabel = new Map(categoryIcons.map((item) => [item.label, item]));

    return (
        <section className="card p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {categories.map((c) => {
                    const quick = quickByLabel.get(c);
                    const Icon = quick?.icon || Bookmark;
                    const color = quick?.color || "#fa9200";
                    return (
                        <button
                            key={c}
                            onClick={() => onFilterClick({ category: c })}
                            className="group rounded-xl border border-slate-200 bg-slate-100 p-4 text-left transition hover:bg-slate-200"
                        >
                            <div className="text-3xl">
                                <Icon color={color} size={32} />
                            </div>
                            <div className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-slate-900">
                                {c}
                            </div>
                        </button>
                    );
                })}

                <button
                    onClick={() => onFilterClick({ verified: "true" })}
                    className="group rounded-xl border border-slate-200 bg-slate-100 p-4 text-left transition hover:bg-slate-200"
                >
                    <div className="text-3xl">
                        <ShieldCheck color="#08e272" size={32} />
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-slate-900">
                        Verified
                    </div>
                    <div className="text-xs text-slate-900/50">Only verified NGOs</div>
                </button>

                <button
                    onClick={() => onFilterClick({ city: "Phnom Penh" })}
                    className="group rounded-xl border border-slate-200 bg-slate-100 p-4 text-left transition hover:bg-slate-200"
                >
                    <div className="text-3xl">
                        <MapPin color="#e0ce00" size={32} />
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-slate-900">
                        Phnom Penh
                    </div>
                    <div className="text-xs text-slate-900/50">Browse by city</div>
                </button>
            </div>
        </section>
    );
}

export default QuickFilters;
