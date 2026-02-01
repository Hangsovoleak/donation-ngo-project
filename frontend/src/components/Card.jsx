import { Link } from "react-router-dom";

function Card({ ngo }) {
    const categories = (ngo.categories || []).join(", ") || "-";
    const beneficiaries = (ngo.beneficiaries || []).join(", ") || "-";

    return (
        <div className="bg-white block max-w-sm p-6 border border-brand-soft rounded-3xl shadow-sm">
            <Link to={`/ngos/${ngo.id}`}>
                <img
                    src="https://i.pinimg.com/1200x/a1/a6/d0/a1a6d07762619ed6d38e11269f573d32.jpg"
                    alt="NGO"
                    className="rounded-2xl border border-brand-soft"
                    loading="lazy"
                />
            </Link>
            <Link to={`/ngos/${ngo.id}`}>
                <h5 className="mt-6 mb-2 text-2xl font-bold tracking-tight text-brand-ink">
                    {ngo.name}
                </h5>
            </Link>
            <p className="mb-6 text-brand-ink/70">{ngo.short_description || "-"}</p>
            <div className="mb-6 space-y-1 text-sm text-brand-ink/70">
                <div>
                    <span className="text-brand-ink font-semibold">City:</span> {ngo.city || "-"}
                </div>
                <div>
                    <span className="text-brand-ink">Categories:</span> {categories}
                </div>
                <div>
                    <span className="text-brand-ink">Beneficiaries:</span> {beneficiaries}
                </div>
            </div>
            <Link
                to={`/ngos/${ngo.id}`}
                className="inline-flex items-center font-semibold text-brand-ink border border-brand-blue bg-brand-soft/60 rounded-xl px-4 py-2 hover:bg-brand-soft"
            >
                View details
            </Link>
        </div>
    );
}

export default Card;
