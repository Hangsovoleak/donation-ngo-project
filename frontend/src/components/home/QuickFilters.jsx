import { Bookmark } from "lucide-react";

// Home page component: Quick category filters
// using it in HomePage.jsx to display quick category filters
function QuickFilters({ categories, categoryIcons, onFilterClick }) {
    //create a map of category icons for quick filtering
    const quickByLabel = new Map(categoryIcons.map((item) => [item.label, item]));

    return (
        <section className="card p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {categories.map((c) => {

                    //get the category icon and color from the map
                    const quick = quickByLabel.get(c);
                    const Icon = quick?.icon || Bookmark;
                    const color = quick?.color || "#fa9200";
                    
                    //display category icon and name
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
            </div>
        </section>
    );
}

export default QuickFilters;
