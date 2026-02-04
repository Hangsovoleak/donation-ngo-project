import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNgoById } from "../api/ngoApi";

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-soft bg-brand-soft/40 px-3 py-1 text-xs font-semibold text-brand-ink">
      {children}
    </span>
  );
}

function Details() {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const data = await getNgoById(id);
        setNgo(data.data || data);
      } catch (e) {
        setErr(e.message);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const mapLink = useMemo(() => {
    return ngo?.map_link || ngo?.map_links?.[0] || ngo?.locations?.[0]?.map_link;
  }, [ngo]);

  const imageUrl =
    ngo?.image_url ||
    "https://i.pinimg.com/1200x/a1/a6/d0/a1a6d07762619ed6d38e11269f573d32.jpg";

  const categories = Array.isArray(ngo?.categories) ? ngo.categories : [];
  const beneficiaries = Array.isArray(ngo?.beneficiaries) ? ngo.beneficiaries : [];

  if (loading) {
    return (
      <div className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-semibold">
        Loading NGO...
      </div>
    );
  }

  if (err) {
    return <div className="text-red-400">{err}</div>;
  }

  if (!ngo) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-2 text-sm text-brand-ink/70 hover:text-brand-ink"
      >
        <span aria-hidden="true">←</span> Back to Browse
      </Link>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-md border-2 border-white bg-white shadow-sm">
        <div className="h-[380px] md:h-[420px] w-full">
          <img src={imageUrl} alt={ngo.name} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="p-5 md:p-8 w-full">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2">
                  {ngo.verified ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-300 px-3 py-1 text-xs font-semibold text-white">
                      <span className="inline-block h-2 w-2 rounded-full bg-white" />
                      Verified NGO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-300 px-3 py-1 text-xs font-semibold text-white">
                      Unverified
                    </span>
                  )}

                  {ngo.city ? (
                    <span className="inline-flex items-center rounded-full bg-orange-300 px-3 py-1 text-xs font-semibold text-white">
                      📍 {ngo.city}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-3 text-2xl md:text-4xl font-bold text-white">
                  {ngo.name}
                </h1>

                <p className="mt-2 text-white/85 text-sm md:text-base line-clamp-3">
                  {ngo.short_description || ngo.description || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-black rounded-md shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-950">About this NGO</h2>
            <p className="mt-2 text-sm text-slate-800 whitespace-pre-line">
              {ngo.description || "—"}
            </p>

            {(categories.length || beneficiaries.length) ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold text-slate-900 mb-2">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {categories.length ? categories.map((c) => <Chip key={c}>{c}</Chip>) : <span className="text-sm text-slate-950">—</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 mb-2">Beneficiaries</div>
                  <div className="flex flex-wrap gap-2">
                    {beneficiaries.length ? beneficiaries.map((b) => <Chip key={b}>{b}</Chip>) : <span className="text-sm text-slate-950">—</span>}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* How to donate */}
          <div className="bg-white border-2 border-black rounded-md shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-950">How to donate</h2>

            <div className="mt-2 text-sm text-slate-800 whitespace-pre-line">
              {ngo.donation_info || "Donation info is not added yet. Try calling or visiting their website."}
            </div>
          </div>
        </div>

        {/* Right: contact card */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-black rounded-md shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-950">Contact</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-800">
              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-slate-900">City</span>
                <span className="text-right">{ngo.city || "—"}</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-slate-900">Phone</span>
                <span className="text-right">{ngo.phone || "—"}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {ngo.phone ? (
                <a
                  href={`tel:${ngo.phone}`}
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white font-semibold px-4 py-2"
                >
                  Call Now
                </a>
              ) : null}

              {mapLink ? (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-white border-2 border-black text-slate-900 font-semibold px-4 py-2"
                >
                  Open Google Maps
                </a>
              ) : (
                <div className="text-xs text-slate-900">No map link available.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Details;
