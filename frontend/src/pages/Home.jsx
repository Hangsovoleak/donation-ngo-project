/**
 * Software Framework: React (Frontend)
 * Description:
 *      Landing page component that displays featured NGOs, hero banner, 
 *      and quick category filters.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNgos } from "../services/ngo.service";
import { getCategories } from "../services/meta.service";
import { CATEGORY_ICONS } from "../constants/categories";

// Page-specific section components
import HeroSection from "../components/home/HeroSection";
import QuickFilters from "../components/home/QuickFilters";
import HowItWorks from "../components/home/HowItWorks";
import ImpactStats from "../components/home/ImpactStats";
import FeaturedNGOs from "../components/home/FeaturedNGOs";
import VerificationInfo from "../components/home/VerificationInfo";

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Home page component.
 */
function Home() {
  const navigate = useNavigate();

  // UI state for search and fetched data
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");
  const [featuredLoading, setFeaturedLoading] = useState(true);

  /**
   * @brief Load categories for quick filters.
   */
  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        const payload = cats?.data;
        setCategories(Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []));
      } catch (e) {
        // Fail silently: categories are optional for the UI
      }
    })();
  }, []);

  /**
   * @brief Load top featured NGOs.
   */
  useEffect(() => {
    (async () => {
      setFeaturedLoading(true);
      try {
        const list = await getNgos({ verified: "true" });
        // Correctly extract array from { data: [...], meta: {} }
        const payload = list?.data;
        const array = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        setFeatured(array.slice(0, 6));
      } catch (e) {
        setErr(e.message || "Failed to load NGOs");
      } finally {
        setFeaturedLoading(false);
      }
    })();
  }, []);

  // Derived category list merging API data with fallbacks
  const catList = useMemo(() => {
    const fromApi = Array.isArray(categories) ? categories.map((c) => c.name || c) : [];
    return Array.from(new Set([...CATEGORY_ICONS.map((q) => q.label), ...fromApi].filter(Boolean)));
  }, [categories]);

  /**
   * @brief Redirect to browse page with parameters.
   * 
   * @param params Query parameters for the browse page.
   */
  function goBrowse(params = {}) {
    const qs = new URLSearchParams(params);
    navigate(`/browse?${qs.toString()}`);
  }

  return (
    <div className="space-y-12">
      <HeroSection
        search={search}
        setSearch={setSearch}
        onSearch={() => goBrowse({ search })}
        onBrowseAll={() => navigate("/browse")}
      />

      <QuickFilters
        categories={catList}
        categoryIcons={CATEGORY_ICONS}
        onFilterClick={goBrowse}
      />

      <HowItWorks />

      <ImpactStats />

      <FeaturedNGOs
        ngos={featured}
        error={err}
        loading={featuredLoading}
      />

      <VerificationInfo />
    </div>
  );
}

export default Home;
