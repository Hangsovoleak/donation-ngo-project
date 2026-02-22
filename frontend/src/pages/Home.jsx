// Home page flow:
// Step 1: Load categories and featured NGOs from API.
// Step 2: Build category chips used by quick filters.
// Step 3: Navigate to /browse with selected query params.
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNgos } from "../services/ngo.service";
import { getCategories } from "../services/meta.service";
import { CATEGORY_ICONS } from "../constants/categories";

// Import Home page components
import HeroSection from "../components/home/HeroSection";
import QuickFilters from "../components/home/QuickFilters";
import HowItWorks from "../components/home/HowItWorks";
import ImpactStats from "../components/home/ImpactStats";
import FeaturedNGOs from "../components/home/FeaturedNGOs";
import VerificationInfo from "../components/home/VerificationInfo";

function Home() {
  const navigate = useNavigate();

  // UI state for search and fetched home data.
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Step 1A: Load categories used in quick filter buttons.
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

  // Step 1B: Load verified NGOs for the featured section.
  useEffect(() => {
    (async () => {
      setFeaturedLoading(true);
      try {
        const list = await getNgos({ verified: "true" });
        const data = list.data || list || [];
        setFeatured(data.slice(0, 6));
      } catch (e) {
        setErr(e.message || "Failed to load NGOs");
      } finally {
        setFeaturedLoading(false);
      }
    })();
  }, []);

  // Step 2: Merge API categories with fallback icons and remove duplicates.
  const catList = useMemo(() => {
    const fromApi = Array.isArray(categories) ? categories.map((c) => c.name || c) : [];
    return Array.from(new Set([...CATEGORY_ICONS.map((q) => q.label), ...fromApi].filter(Boolean)));
  }, [categories]);

  // Step 3: Route to browse page and preserve selected filters in URL.
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
        //use props for pass data to component
        categories={catList}
        categoryIcons={CATEGORY_ICONS}
        onFilterClick={goBrowse}
      />

      <HowItWorks />

      <ImpactStats />

      {/* Featured NGOs */}
      <FeaturedNGOs ngos={featured} error={err} loading={featuredLoading} />

      <VerificationInfo />
    </div>
  );
}

export default Home;
