// Page: Landing screen with hero, quick filters, and featured NGOs.
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

  const catList = useMemo(() => {
    const fromApi = Array.isArray(categories) ? categories.map((c) => c.name || c) : [];
    return Array.from(new Set([...CATEGORY_ICONS.map((q) => q.label), ...fromApi].filter(Boolean)));
  }, [categories]);

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

      <FeaturedNGOs ngos={featured} error={err} />

      <VerificationInfo />
    </div>
  );
}

export default Home;
