function SearchBar({ value, onChange }) {
    return (
        <section className="col-span-full mb-8">
            <div className="relative max-w-md group">
                {/* Search Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"></div>

                <input 
                    type="search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search donations..."
                    className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
            </div>
        </section>
    );
}

export default SearchBar;