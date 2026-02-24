/**
 * Software Framework: React (Frontend)
 * Description:
 *      The primary discovery page where users can search, filter, and 
 *      browse the directory of NGOs.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getNgos } from "../services/ngo.service";
import { getCategories } from "../services/meta.service";

// Browse specific components
import BrowseHeader from "../components/browse/BrowseHeader";
import FilterPanel from "../components/browse/FilterPanel";
import NGOGrid from "../components/browse/NGOGrid";
import Pagination from "../components/browse/Pagination";

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Browse directory page component.
 */
function Browse() {
  // Current URL search parameters (source of truth)
  const [params, setParams] = useSearchParams();

  // Data state
  const [ngos, setNgos] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filter state initialized from URL
  const [search, setSearch] = useState(params.get("search") || "");
  const [city, setCity] = useState(params.get("city") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(params.get("verified") === "true");
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const [limit, setLimit] = useState(Number(params.get("limit")) || 9);
  const [sortBy, setSortBy] = useState(params.get("sortBy") || "updated_at");
  const [sortOrder, setSortOrder] = useState(params.get("sortOrder") || "desc");

  // Request & UI state
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [err, setErr] = useState("");
  const [meta, setMeta] = useState(null);
  const skipFirstFilterEffect = useRef(true);

  async function loadCategories() {
    try {
      const resp = await getCategories();
      const payload = resp?.data;
      setCategories(Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []));
    } catch (e) {
      // Non-blocking failure
    }
  }


  /**
   * @brief Fetch NGO list based on current filters.
   * 
   * @param options Execution flags (e.g., silent for background updates).
   */
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

      // Normalize API response shapes
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

  // Initial load
  useEffect(() => {
    loadCategories();
    loadNgos();
    // eslint-disable-next-line
  }, []);

  // Sync state back to URL query parameters
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

  // Automatic re-fetch when filters change (debounced)
  useEffect(() => {
    if (skipFirstFilterEffect.current) {
      skipFirstFilterEffect.current = false;
      return;
    }
    const timer = setTimeout(() => loadNgos({ silent: true }), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [search, city, category, verifiedOnly, page, limit, sortBy, sortOrder]);

  // Derived category list merging API data and fallbacks
  const availableCategories = useMemo(() => {
    const fallback = ["Education", "Healthcare", "Food", "Clothing"];
    const fromApi = Array.isArray(categories) && categories.length
      ? categories.map((c) => c.name || c)
      : [];
    return Array.from(new Set([...fallback, ...fromApi].filter(Boolean)));
  }, [categories]);

  /**
   * @brief Reset all active filters.
   */
  function clearFilters() {
    setSearch("");
    setCity("");
    setCategory("");
    setVerifiedOnly(false);
    setPage(1);
  }

  /**
   * @brief Revert to first page of results.
   */
  function resetPage() {
    if (page !== 1) setPage(1);
  }

  /**
   * @brief Navigate to previous result page.
   */
  function goPrev() {
    if (page > 1) setPage((p) => Math.max(1, p - 1));
  }

  /**
   * @brief Navigate to next result page.
   */
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
        isFetching={isFetching}
        error={err}
        onClearFilters={clearFilters}
      />

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
