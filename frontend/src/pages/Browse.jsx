import { useEffect, useState } from "react";
import NgoCard from "../components/Card";
import { getNgos } from "../api/ngoApi";
import { getCategories } from "../api/metaApi";

function Browse() {
    const [ngos, setNgos] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("");
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    async function loadCategories() {
        try {
            const cats = await getCategories();
            setCategories(cats.data || cats || []);
        } catch (err) {
            setErr(err.message);
        }
    }

    async function loadNgos() {
        setLoading(true);
        setErr("");
        try {
            const list = await getNgos({
                search,
                city,
                category,
                verified: verifiedOnly? "true": "",
            });
            setNgos(list.data || list || []);
        } catch (err) {
            setErr(err.message);
        }
        setLoading(false);
    }

    //load once
    useEffect(() => {
        loadCategories();
        loadNgos();
        //eslint-disable-next-line
    }, []);

    //reload when filters change
    useEffect(() => {
        const timer = setTimeout(() => loadNgos(), 500);
        return () => clearTimeout(timer);
        //eslint-disable-next-line
    }, [search, city, category, verifiedOnly]);

    //city options from ngos
    const cities = Array.from(new Set(ngos.map((n) => n.city).filter(Boolean)));

    return (
        <div>
            <h1 className="text-2xl md:text-5xl font-bold text-brand-ink text-center">
                Welcome to Donation Website
            </h1>

            <div className="mt-6 bg-white border border-brand-soft rounded-2xl shadow-sm p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    <div>
                        <label className="block mb-2 text-xs font-semibold text-brand-ink">Search</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-brand-ink/50">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                            </span>
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="w-full ps-9 pe-3 py-2.5 bg-brand-base border border-brand-soft text-brand-ink text-sm rounded-lg shadow-sm focus:ring-2 focus:ring-brand-soft outline-none"
                                placeholder="Search by name or description"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-xs font-semibold text-brand-ink">Category</label>
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="w-full px-3 py-2.5 bg-brand-base border border-brand-soft text-brand-ink text-sm rounded-lg shadow-sm focus:ring-2 focus:ring-brand-soft outline-none"
                        >
                            <option value="">All Category</option>
                            <option value="">Education</option>
                            <option value="">Healthcare</option>
                            <option value="">Food</option>
                            <option value="">Clothing</option>
                            {categories.map((c) => (
                                <option key={c.id || c.name} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 text-xs font-semibold text-brand-ink">City</label>
                        <select
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            className="w-full px-3 py-2.5 bg-brand-base border border-brand-soft text-brand-ink text-sm rounded-lg shadow-sm focus:ring-2 focus:ring-brand-soft outline-none"
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
                            {cities.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 text-xs font-semibold text-brand-ink">Filter</label>
                        <label className="flex items-center gap-2 px-3 py-2.5 bg-brand-base border border-brand-soft text-brand-ink text-sm rounded-lg shadow-sm">
                            <input
                                type="checkbox"
                                checked={verifiedOnly}
                                onChange={(e) => setVerifiedOnly(e.target.checked)}
                                className="w-4 h-4 rounded border-brand-blue bg-white focus:ring-brand-soft"
                            />
                            Verified only
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center py-2 font-semibold text-brand-ink bg-brand-soft/60 border border-brand-blue p-3 rounded-full w-44">
                Found {ngos.length} NGOs
            </div>

            {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

            {loading ? (
                <div className="mt-4 text-sm text-brand-ink/60">Loading...</div>
            ) : (
                <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ngos.map((ngo) => (
                        <NgoCard key={ngo.id} ngo={ngo} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Browse;
