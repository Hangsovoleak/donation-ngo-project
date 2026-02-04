import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NgoCard from "../components/Card";
import { getNgos } from "../api/ngoApi";
import { getCategories } from "../api/metaApi";
import { GraduationCap, Cross, ChefHat, Shirt, Bookmark, Venus, ShieldCheck, UsersRound, MapPin, TreeDeciduous, Cat } from "lucide-react";

const QUICK = [
  { label: "Education", icon: GraduationCap, color: "#2878c3" },
  { label: "Healthcare", icon: Cross, color: "#3b2da9" },
  { label: "Food", icon: ChefHat, color: "#ffffff" },
  { label: "Clothing", icon: Shirt, color: "#d10065" },
  { label: "Environment", icon: TreeDeciduous, color: "#064b2b" },
  { label: "Women Empowerment", icon: Venus, color: "#d20fcb" },
  { label: "Disaster Relief", icon: UsersRound, color: "#940000" },
  { label: "Animal Welfare", icon: Cat, color: "#e74040" },
];

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats.data || cats || []);
      } catch (e) {
        // silent: Home still works without categories
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const list = await getNgos({ verified: "true" });
        const data = list.data || list || [];
        setFeatured(data.slice(0, 6));
      } catch (e) {
        setErr(e.message || "Failed to load NGOs");
      }
    })();
  }, []);

  const quickByLabel = useMemo(() => {
    return new Map(QUICK.map((item) => [item.label, item]));
  }, []);

  const catList = useMemo(() => {
    const fromApi = Array.isArray(categories) ? categories.map((c) => c.name || c) : [];
    return Array.from(new Set([...QUICK.map((q) => q.label), ...fromApi].filter(Boolean)));
  }, [categories]);

  function goBrowse(params = {}) {
    const qs = new URLSearchParams(params);
    navigate(`/browse?${qs.toString()}`);
  }

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="h-[380px] md:h-[440px] w-full">
          <img
            src="https://www.pse.ngo/sites/default/files/images/paragraphs/img2553.jpg"
            alt="Donation"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="p-6 md:p-10 w-full">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-widest text-white/85 uppercase">
                Donation Directory
              </p>

              <h1 className="mt-2 text-3xl md:text-5xl font-display text-white">
                Find verified NGOs and donate safely
              </h1>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search NGOs by name or description..."
                    className="w-full px-4 py-2.5 rounded-full border border-white/70 bg-white/95 text-slate-900 shadow-sm"
                  />
                </div>
                <button
                  onClick={() => goBrowse({ search })}
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-black"
                >
                  Search
                </button>
                <Link
                  to="/browse"
                  className="px-5 py-2.5 rounded-full bg-white/90 text-slate-900 font-semibold hover:bg-white"
                >
                  Browse all
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {catList.map((c) => {
            const quick = quickByLabel.get(c);
            const Icon = quick?.icon || Bookmark;
            const color = quick?.color || "#fa9200";
            return (
            <button
              key={c}
              onClick={() => goBrowse({ category: c })}
              className="group rounded-xl border border-slate-200 bg-slate-900 hover:bg-black p-4 text-left"
            >
              <div className="text-3xl">
                <Icon color={color} size={32} />
              </div>
              <div className="mt-2 text-sm font-semibold text-white group-hover:text-white">
                {c}
              </div>
              <div className="text-xs text-white/50">Explore</div>
            </button>
          )})}

          <button
            onClick={() => goBrowse({ verified: "true" })}
            className="group rounded-xl border border-slate-200 bg-slate-900 hover:bg-black p-4 text-left"
          >
            <div className="text-3xl"><ShieldCheck color="#08e272" size={32} /></div>
            <div className="mt-2 text-sm font-semibold text-white group-hover:text-white">Verified</div>
            <div className="text-xs text-white/50">Only verified NGOs</div>
          </button>

          <button
            onClick={() => goBrowse({ city: "Phnom Penh" })}
            className="group rounded-xl border border-slate-200 bg-slate-900 hover:bg-black p-4 text-left"
          >
            <div className="text-3xl"><MapPin color="#e0ce00" size={32} /></div>
            <div className="mt-2 text-sm font-semibold text-white group-hover:text-white">Phnom Penh</div>
            <div className="text-xs text-white/50">Browse by city</div>
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-display text-slate-900">
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

          {err && <div className="mt-3 text-sm text-red-500">{err}</div>}

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((ngo) => (
              <NgoCard key={ngo.id} ngo={ngo} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
