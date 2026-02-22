// Browse page flow:
// Step 1: Read initial filters from URL query params.
// Step 2: Fetch categories + NGO list from API.
// Step 3: Keep URL in sync when user changes filters.
// Step 4: Render filters, results, and pagination controls.
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getNgos } from "../services/ngo.service";
import { getCategories } from "../services/meta.service";

// Import Browse page components
import BrowseHeader from "../components/browse/BrowseHeader";
import FilterPanel from "../components/browse/FilterPanel";
import NGOGrid from "../components/browse/NGOGrid";
import Pagination from "../components/browse/Pagination";

function Browse() {
  // Step 1: URLSearchParams is the source of truth for shareable filter links.
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

  // Request state and API pagination metadata.
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [err, setErr] = useState("");
  const [meta, setMeta] = useState(null);
  const skipFirstFilterEffect = useRef(true);

  // Step 2A: Load categories once to populate dropdown/filter options.
  async function loadCategories() {
    try {
      const cats = await getCategories();
      setCategories(cats.data || cats || []);
    } catch (e) {
      // keep browsing working even if categories fail
    }
  }

  // Step 2B: Load NGO list with current filters and sort/pagination state.
  async function loadNgos({ silent = false } = {}) {
    if (!silent) {
      setLoading(true);
    } else {
      setIsFetching(true);
    }
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
      // Supports both response shapes: { data, meta } and plain arrays.
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
    if (!silent) {
      setLoading(false);
    } else {
      setIsFetching(false);
    }
  }

  // Initial page load.
  useEffect(() => {
    loadCategories();
    loadNgos();
    // eslint-disable-next-line
  }, []);

  // Step 3: Push current filter state to query string for deep-linking.
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

  // Debounced refetch when filters change to avoid noisy API calls.
  useEffect(() => {
    if (skipFirstFilterEffect.current) {
      skipFirstFilterEffect.current = false;
      return;
    }
    const timer = setTimeout(() => loadNgos({ silent: true }), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [search, city, category, verifiedOnly, page, limit, sortBy, sortOrder]);

  // Merge fallback labels with API labels and remove duplicates.
  const availableCategories = useMemo(() => {
    const fallback = ["Education", "Healthcare", "Food", "Clothing"];
    const fromApi = Array.isArray(categories) && categories.length
      ? categories.map((c) => c.name || c)
      : [];
    return Array.from(new Set([...fallback, ...fromApi].filter(Boolean)));
  }, [categories]);

  // Reset all filters back to defaults.
  function clearFilters() {
    setSearch("");
    setCity("");
    setCategory("");
    setVerifiedOnly(false);
    setPage(1);
  }

  // Return to page 1 when a filter/sort change requires fresh pagination.
  function resetPage() {
    if (page !== 1) setPage(1);
  }

  // Pagination helpers.
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

      {/* Filter Panel */}
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

      {/* NGO Grid */}
      <NGOGrid
        ngos={ngos}
        loading={loading}
        isFetching={isFetching}
        error={err}
        onClearFilters={clearFilters}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={meta?.totalPages}
        onPrev={goPrev}
        onNext={goNext}
        loading={loading}
        isFetching={isFetching}
      />
    </div>
  );
}

export default Browse;
