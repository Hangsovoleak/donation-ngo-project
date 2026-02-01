import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNgoById } from "../api/ngoApi";

function Details() {
    const {id} = useParams();
    const [ngo, setNgo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            setErr("");

            try{
                const data = await getNgoById(id);
                setNgo(data.data || data);
            } catch (err) {
                setErr(err.message);
            }
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-soft text-brand-ink text-sm font-medium">
                Loading...
            </div>
        );
    }
    if (err) {
        return <div className="text-red-600">{err}</div>
    }
    if (!ngo) {
        return null;
    }

    const mapLink = ngo.map_link || ngo.map_links?.[0] || ngo.locations?.[0]?.map_link;

    const categories = (ngo.categories || []).join(", ") || "-";
    const beneficiaries = (ngo.beneficiaries || []).join(", ") || "-";

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-brand-ink/70 hover:text-brand-ink">
                <span aria-hidden="true">←</span> Back to Browse
            </Link>

            <div className="bg-white border border-brand-soft rounded-2xl shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold text-brand-ink">{ngo.name}</h1>
                    {ngo.verified && (
                        <span className="inline-flex items-center gap-1 text-brand-ink border border-brand-blue bg-brand-soft rounded-full text-xs px-2.5 py-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-brand-blue" />
                            Verified
                        </span>
                    )}
                </div>
                <p className="mt-3 text-brand-ink/70">{ngo.description || "-"}</p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                        <h2 className="text-lg font-semibold text-brand-ink mb-3">Contact Information</h2>
                        <div className="space-y-2 text-brand-ink/70">
                            <div>
                                <span className="text-brand-ink">City:</span> {ngo.city || "-"}
                            </div>
                            <div>
                                <span className="text-brand-ink">Phone:</span> {ngo.phone || "-"}
                            </div>
                            {mapLink && (
                                <div>
                                    <span className="text-brand-ink">Map:</span>{" "}
                                    <a href={mapLink} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
                                        View on Google Maps
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-brand-ink mb-3">Categories & Focus</h2>
                        <div className="space-y-2 text-brand-ink/70">
                            <div>
                                <span className="text-brand-ink">Categories:</span> {categories}
                            </div>
                            <div>
                                <span className="text-brand-ink">Beneficiaries:</span> {beneficiaries}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-brand-ink mb-2">How to Donate</h2>
                    <p className="text-brand-ink/70">{ngo.donation_info || "-"}</p>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-brand-ink mb-2">What They Need</h2>
                    <p className="text-brand-ink/70">{ngo.needs || "-"}</p>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-brand-ink mb-2">Location</h2>
                    {mapLink ? (
                        <a
                            href={mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-white bg-brand-blue hover:bg-brand-ink border border-transparent focus:ring-4 focus:ring-brand-soft shadow-sm font-medium leading-5 rounded-full text-sm px-4 py-2.5"
                        >
                            View on Google Maps
                        </a>
                    ) : (
                        <div className="text-brand-ink/60">No map link.</div>
                    )}
                </div>
            </div>

            <footer className="border-t border-brand-soft pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://www.tuxglobalinstitute.edu.kh/_ipx/w_300&f_webp/images/TGI-Logo.png"
                            alt="TUX Global Institute logo"
                            className="h-10 w-auto"
                            loading="lazy"
                        />
                        <div className="text-sm font-semibold text-brand-ink">TUX GLOBAL INSTITUTE</div>
                    </div>
                    <div className="text-sm text-brand-ink/70 md:text-right">
                        <div className="font-semibold text-brand-ink">Members</div>
                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Panha
                            </span>
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Voleak
                            </span>
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Monika
                            </span>
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Nyda
                            </span>
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Darith
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Details;
