import { Link } from "react-router-dom";

function Card({ ngo }) {
  const categories = (ngo.categories || []).join(", ") || "-";
  const beneficiaries = (ngo.beneficiaries || []).join(", ") || "-";

  const imageUrl =
    ngo.image_url ||
    "https://bongsrey.sgp1.digitaloceanspaces.com/library/383/images/5d1ecb8986bbe.jpg";

  return (
    <div className="h-full bg-white border-white border-2 rounded-md shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link to={`/ngos/${ngo.id}`}>
        <img
          src={imageUrl}
          alt={ngo.name || "NGO"}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
      </Link>

      <div className="p-5 flex flex-col h-[calc(100%-176px)]">
        <Link to={`/ngos/${ngo.id}`}>
          <h5 className="text-lg font-bold text-slate-900 line-clamp-2">
            {ngo.name}
          </h5>
        </Link>

        <p className="mt-2 text-sm text-slate-800 line-clamp-2">
          {ngo.short_description || "-"}
        </p>

        <div className="mt-4 space-y-1 text-xs text-slate-500 flex-1">
          <div>
            <span className="font-semibold text-slate-900">City:</span>{" "}
            {ngo.city || "-"}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Categories:</span>{" "}
            {categories}
          </div>
          <div>
            <span className="font-semibold text-slate-900 mb-6">Beneficiaries:</span>{" "}
            {beneficiaries}
          </div>
        </div>

        <div className="mt-4">
          <Link
            to={`/ngos/${ngo.id}`}
            className="inline-flex items-center justify-center w-full font-semibold text-white bg-slate-900 hover:bg-slate-950 rounded-lg px-4 py-2"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
