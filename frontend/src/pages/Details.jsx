// Details page flow:
// Step 1: Read NGO id from route params.
// Step 2: Fetch NGO detail from API.
// Step 3: Build derived UI fields (image, map link, chips).
// Step 4: Render loading, error, or final detail layout.
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNgoById } from "../services/ngo.service";
import Chip from "../components/common/Chip";

function Details() {
  // Step 1: Dynamic route param from /ngos/:id.
  const { id } = useParams();
  // Request state.
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Step 2: Refetch whenever route id changes.
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

  // Step 3A: Normalize map link from multiple possible payload shapes.
  const mapLink = useMemo(() => {
    return ngo?.map_link || ngo?.map_links?.[0] || ngo?.locations?.[0]?.map_link;
  }, [ngo]);

  // Step 3B: Fallback image keeps the page presentable when API has no image.
  const imageUrl =
    ngo?.image_url ||
    "https://i.pinimg.com/1200x/a1/a6/d0/a1a6d07762619ed6d38e11269f573d32.jpg";

  // Step 3C: Normalize relation arrays for rendering chip components.
  const categories = Array.isArray(ngo?.categories) ? ngo.categories : [];
  const beneficiaries = Array.isArray(ngo?.beneficiaries) ? ngo.beneficiaries : [];

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-5 w-32 rounded bg-slate-200/70" />
        <section className="relative overflow-hidden card">
          <div className="h-[380px] md:h-[420px] w-full bg-slate-200/70" />
        </section>
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="h-5 w-40 rounded bg-slate-200/70" />
              <div className="mt-3 h-3 w-full rounded bg-slate-200/70" />
              <div className="mt-2 h-3 w-5/6 rounded bg-slate-200/70" />
              <div className="mt-2 h-3 w-4/6 rounded bg-slate-200/70" />
            </div>
            <div className="card p-6">
              <div className="h-5 w-32 rounded bg-slate-200/70" />
              <div className="mt-3 h-3 w-full rounded bg-slate-200/70" />
              <div className="mt-2 h-3 w-5/6 rounded bg-slate-200/70" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <div className="h-5 w-24 rounded bg-slate-200/70" />
              <div className="mt-3 h-3 w-5/6 rounded bg-slate-200/70" />
              <div className="mt-4 h-9 w-full rounded bg-slate-200/70" />
            </div>
            <div className="card p-6">
              <div className="h-5 w-24 rounded bg-slate-200/70" />
              <div className="mt-3 h-3 w-5/6 rounded bg-slate-200/70" />
              <div className="mt-2 h-3 w-4/6 rounded bg-slate-200/70" />
            </div>
          </div>
        </section>
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
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <span aria-hidden="true">←</span> Back to Browse
      </Link>

      <section className="relative overflow-hidden card">
        <div className="h-[380px] md:h-[420px] w-full">
          <img src={imageUrl} alt={ngo.name} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

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

      {/* Quick donate bar */}
      <section className="card px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2">

            <button
              type="button"
              className="h-9 rounded-full bg-slate-900 px-5 text-xs font-semibold text-white shadow-sm"
            >
              DONATE NOW
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900">
            <div className="text-3xl font-black leading-none">100%</div>
            <div className="text-[11px] font-semibold uppercase leading-tight text-slate-700">
              Donation Policy
              <div className="text-[10px] font-normal normal-case text-slate-500">
                All funds received are 100% used on specified appeals and orphan care.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
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
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-950">How to donate</h2>

            <div className="mt-2 text-sm text-slate-800 whitespace-pre-line">
              {ngo.donation_info || "Donation info is not added yet. Try calling or visiting their website."}
            </div>
          </div>
        </div>

        {/* Right: contact card */}
        <div className="space-y-6">
          <div className="card p-6">
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
                  className="btn-primary text-sm"
                >
                  Call Now
                </a>
              ) : null}

              {mapLink ? (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline text-sm"
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
