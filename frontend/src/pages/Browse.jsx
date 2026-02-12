// Page: Search + filter NGOs with pagination and sorting.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getNgos } from "../services/ngo.service";
import { getCategories } from "../services/meta.service";

// Import Browse page components
import BrowseHeader from "../components/browse/BrowseHeader";
import FilterPanel from "../components/browse/FilterPanel";
import NGOGrid from "../components/browse/NGOGrid";
import Pagination from "../components/browse/Pagination";

function Browse() {
  const [params, setParams] = useSearchParams();

  const [ngos, setNgos] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState(params.get("search") || "");
  const [city, setCity] = useState(params.get("city") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(params.get("verified") === "true");
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const [limit, setLimit] = useState(Number(params.get("limit")) || 9);
  const [sortBy, setSortBy] = useState(params.get("sortBy") || "updated_at");
  const [sortOrder, setSortOrder] = useState(params.get("sortOrder") || "desc");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [meta, setMeta] = useState(null);

  async function loadCategories() {
    try {
      const cats = await getCategories();
      setCategories(cats.data || cats || []);
    } catch (e) {
      // keep browsing working even if categories fail
    }
  }

  async function loadNgos() {
    setLoading(true);
    setErr("");
    try {
      const list = await getNgos({
        search,
        city,
        category,
        verified: verifiedOnly ? "true" : "",
        page,
        limit,
        sortBy,
        sortOrder,
      });
      const payload = list?.data || list || [];
      if (payload?.data && Array.isArray(payload.data)) {
        setNgos(payload.data);
        setMeta(payload.meta || null);
      } else {
        setNgos(payload);
        setMeta(null);
      }
    } catch (e) {
      setErr(e.message || "Failed to load NGOs");
    }
    setLoading(false);
  }

  // load once
  useEffect(() => {
    loadCategories();
    loadNgos();
    // eslint-disable-next-line
  }, []);

  // keep URL in sync (nice UX)
  useEffect(() => {
    const next = {};
    if (search) next.search = search;
    if (city) next.city = city;
    if (category) next.category = category;
    if (verifiedOnly) next.verified = "true";
    if (page && page !== 1) next.page = String(page);
    if (limit && limit !== 9) next.limit = String(limit);
    if (sortBy && sortBy !== "updated_at") next.sortBy = sortBy;
    if (sortOrder && sortOrder !== "desc") next.sortOrder = sortOrder;
    setParams(next, { replace: true });
    // eslint-disable-next-line
  }, [search, city, category, verifiedOnly, page, limit, sortBy, sortOrder]);

  // reload when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => loadNgos(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [search, city, category, verifiedOnly, page, limit, sortBy, sortOrder]);

  const availableCategories = useMemo(() => {
    const fallback = ["Education", "Healthcare", "Food", "Clothing"];
    const fromApi = Array.isArray(categories) && categories.length
      ? categories.map((c) => c.name || c)
      : [];
    return Array.from(new Set([...fallback, ...fromApi].filter(Boolean)));
  }, [categories]);

  function clearFilters() {
    setSearch("");
    setCity("");
    setCategory("");
    setVerifiedOnly(false);
    setPage(1);
  }

  function resetPage() {
    if (page !== 1) setPage(1);
  }

  function goPrev() {
    if (page > 1) setPage((p) => Math.max(1, p - 1));
  }

  function goNext() {
    const totalPages = meta?.totalPages;
    if (totalPages && page >= totalPages) return;
    setPage((p) => p + 1);
  }


  return (
    <div className="space-y-6">
      <BrowseHeader />

      <FilterPanel
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        city={city}
        setCity={setCity}
        verifiedOnly={verifiedOnly}
        setVerifiedOnly={setVerifiedOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        limit={limit}
        setLimit={setLimit}
        availableCategories={availableCategories}
        totalNgos={meta?.total ?? ngos.length}
        onClearFilters={clearFilters}
        onResetPage={resetPage}
        showClearButton={search || city || category || verifiedOnly}
      />

      <NGOGrid
        ngos={ngos}
        loading={loading}
        error={err}
        onClearFilters={clearFilters}
      />

      <Pagination
        currentPage={page}
        totalPages={meta?.totalPages}
        onPrev={goPrev}
        onNext={goNext}
        loading={loading}
      />
    </div>
  );
}

export default Browse;
