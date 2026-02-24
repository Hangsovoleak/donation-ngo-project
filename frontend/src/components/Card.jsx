/**
 * Software Framework: React (Frontend)
 * Description:
 *      A card component to display a visual summary of an NGO, 
 *      including its name, description, categories, and beneficiaries.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Link } from "react-router-dom";

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief NGO Card component.
 * 
 * @param ngo NGO data object containing names, descriptions, and relations.
 */
function Card({ ngo }) {
  // Extract category and beneficiary names for display
  const categories = (ngo.categories || []).join(", ") || "-";
  const beneficiaries = (ngo.beneficiaries || []).join(", ") || "-";

  // Fallback image if none provided
  const imageUrl =
    ngo.image_url ||
    "https://bongsrey.sgp1.digitaloceanspaces.com/library/383/images/5d1ecb8986bbe.jpg";

  return (
    <div className="card h-full overflow-hidden">
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
          <h5 className="text-lg font-semibold text-slate-900 line-clamp-2">
            {ngo.name}
          </h5>
        </Link>

        <p className="mt-2 text-sm text-slate-600 line-clamp-2">
          {ngo.short_description || "-"}
        </p>

        <div className="mt-3 space-y-1 text-xs text-slate-600 flex-1">
          <div>
            <span className="mb-2 font-semibold text-slate-900">City:</span>{" "}
            {ngo.city || "-"}
          </div>
          <div>
            <span className="mb-2 font-semibold text-slate-900">Categories:</span>{" "}
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
            className="btn-primary text-sm"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
