/**
 * Software Framework: React (Frontend)
 * Description:
 *      Horizontal button list providing one-click category filtering for 
 *      the home page.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Bookmark } from "lucide-react";

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Quick Category Filter component.
 * 
 * @param categories List of category names.
 * @param categoryIcons Metadata objects mapping names to icons/colors.
 * @param onFilterClick Callback when a category is selected.
 */
function QuickFilters({ categories, categoryIcons, onFilterClick }) {
    // Lookup map for fast icon/color resolution
    const quickByLabel = new Map(categoryIcons.map((item) => [item.label, item]));

    return (
        <section className="card p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
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
            </div>
        </section>
    );
}

export default QuickFilters;
