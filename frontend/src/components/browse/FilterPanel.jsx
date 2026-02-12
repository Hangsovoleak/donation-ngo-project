// Browse page component: Comprehensive filter panel
function FilterPanel({
    search,
    setSearch,
    category,
    setCategory,
    city,
    setCity,
    verifiedOnly,
    setVerifiedOnly,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    limit,
    setLimit,
    availableCategories,
    totalNgos,
    onClearFilters,
    onResetPage,
    showClearButton,
}) {
    return (
        <div className="bg-white/85 border border-white/70 rounded-2xl p-5">
            <div className="grid gap-4 md:grid-cols-5">
                <div>
                    <label className="block mb-2 text-xs font-semibold text-slate-900">Search</label>
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            onResetPage();
                        }}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-950 text-sm font-semibold rounded-xl outline-none focus:border-slate-400"
                        placeholder="Search by name or description"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-xs font-semibold text-slate-900">Category</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            onResetPage();
                        }}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-950 text-sm font-semibold rounded-xl outline-none focus:border-slate-400"
                    >
                        <option value="">All Category</option>
                        {availableCategories.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-xs font-semibold text-slate-900">City</label>
                    <select
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                            onResetPage();
                        }}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-950 text-sm font-semibold rounded-xl outline-none focus:border-slate-400"
                    >
                        <option value="">All Cities</option>
                        <option value="Banteay Meanchey">Banteay Meanchey</option>
                        <option value="Battambang">Battambang</option>
                        <option value="Kampong Chhnang">Kampong Chhnang</option>
                        <option value="Kampong Cham">Kampong Cham</option>
                        <option value="Kampong Speu">Kampong Speu</option>
                        <option value="Kampong Thom">Kampong Thom</option>
                        <option value="Kampot">Kampot</option>
                        <option value="Kandal">Kandal</option>
                        <option value="Kep">Kep</option>
                        <option value="Kratie">Kratie</option>
                        <option value="Mondulkiri">Mondulkiri</option>
                        <option value="Phnom Penh">Phnom Penh</option>
                        <option value="Preah Sihanouk">Preah Sihanouk</option>
                        <option value="Prey Veng">Prey Veng</option>
                        <option value="Pursat">Pursat</option>
                        <option value="Ratanakiri">Ratanakiri</option>
                        <option value="Siem Reap">Siem Reap</option>
                        <option value="Stung Treng">Stung Treng</option>
                        <option value="Svay Rieng">Svay Rieng</option>
                        <option value="Takeo">Takeo</option>
                        <option value="Oddar Meanchey">Oddar Meanchey</option>
                        <option value="Preah Vihear">Preah Vihear</option>
                        <option value="Koh Kong">Koh Kong</option>
                        <option value="Tboung Khmum">Tboung Khmum</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-xs font-semibold text-slate-900">Filter</label>
                    <label className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 text-brand-ink text-sm rounded-xl">
                        <input
                            type="checkbox"
                            checked={verifiedOnly}
                            onChange={(e) => {
                                setVerifiedOnly(e.target.checked);
                                onResetPage();
                            }}
                            className="w-4 h-4 rounded-sm border-slate-400 bg-white"
                        />
                        Verified only
                    </label>
                </div>

                <div>
                    <label className="block mb-2 text-xs font-semibold text-slate-900">Sort by</label>
                    <div className="grid grid-cols-2 gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                onResetPage();
                            }}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-950 text-sm font-semibold rounded-xl outline-none focus:border-slate-400"
                        >
                            <option value="updated_at">Updated</option>
                            <option value="created_at">Created</option>
                            <option value="name">Name</option>
                            <option value="city">City</option>
                            <option value="verified">Verified</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => {
                                setSortOrder(e.target.value);
                                onResetPage();
                            }}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-950 text-sm font-semibold rounded-xl outline-none focus:border-slate-400"
                        >
                            <option value="desc">Desc</option>
                            <option value="asc">Asc</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold">
                    Found {totalNgos} NGOs
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Per page
                    </span>
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            onResetPage();
                        }}
                        className="px-3 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold bg-white"
                    >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                        <option value={18}>18</option>
                    </select>
                </div>
                {showClearButton && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}

export default FilterPanel;
