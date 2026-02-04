import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NgoCard from "../components/Card";
import { getNgos } from "../api/ngoApi";
import { getCategories } from "../api/metaApi";

function Browse() {
  const [params, setParams] = useSearchParams();

  const [ngos, setNgos] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState(params.get("search") || "");
  const [city, setCity] = useState(params.get("city") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(params.get("verified") === "true");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function loadCategories() {
    try {
      const cats = await getCategories();
      setCategories(cats.data || cats || []);
    } catch (e) {
      // keep browsing working even if categories fail
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
        verified: verifiedOnly ? "true" : "",
      });
      setNgos(list.data || list || []);
    } catch (e) {
      setErr(e.message || "Failed to load NGOs");
    }
    setLoading(false);
  }

  // load once
  useEffect(() => {
    loadCategories();
    loadNgos();
    // eslint-disable-next-line
  }, []);

  // keep URL in sync (nice UX)
  useEffect(() => {
    const next = {};
    if (search) next.search = search;
    if (city) next.city = city;
    if (category) next.category = category;
    if (verifiedOnly) next.verified = "true";
    setParams(next, { replace: true });
    // eslint-disable-next-line
  }, [search, city, category, verifiedOnly]);

  // reload when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => loadNgos(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [search, city, category, verifiedOnly]);

  const cities = Array.from(new Set(ngos.map((n) => n.city).filter(Boolean)));

  const availableCategories = useMemo(() => {
    const fallback = ["Education", "Healthcare", "Food", "Clothing"];
    const fromApi = Array.isArray(categories) && categories.length
      ? categories.map((c) => c.name || c)
      : [];
    return Array.from(new Set([...fallback, ...fromApi].filter(Boolean)));
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Header block (same style as Home sections) */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-brand-soft/50 p-6 md:p-10 text-center shadow-sm">
        <h1 className="mt-2 text-2xl md:text-4xl font-display text-slate-900">
          Find the right organization
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Search by name, filter by category, city, or verified status.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-900">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-950 text-sm font-semibold rounded-xl shadow-sm outline-none focus:border-slate-400"
              placeholder="Search by name or description"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-900">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-950 text-sm font-semibold rounded-xl shadow-sm outline-none focus:border-slate-400"
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
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-950 text-sm font-semibold rounded-xl shadow-sm outline-none focus:border-slate-400"
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
            <label className="block mb-2 text-xs font-semibold text-slate-900">Filter</label>
            <label className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 text-brand-ink text-sm rounded-xl shadow-sm">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-400 bg-white"
              />
              Verified only
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold">
            Found {ngos.length} NGOs
          </div>

        </div>
      </div>

      {err && <div className="text-sm text-red-500">{err}</div>}

      {loading ? (
        <div className="text-sm text-slate-600">Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ngos.map((ngo) => (
            <NgoCard key={ngo.id} ngo={ngo} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Browse;
