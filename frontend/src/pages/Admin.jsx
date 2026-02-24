/**
 * Software Framework: React (Frontend)
 * Description:
 *      Protected administrative dashboard for managing the NGO directory.
 *      Supports full CRUD operations and verification toggling.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Building2, Pencil, Plus, Trash2, LogOut, BadgeCheck } from "lucide-react";

// UI Components
import Modal from "../components/Modal";
import NgoForm from "../components/Form";

// Services & Hooks
import { getNgos, getNgoById, createNgo, updateNgo, deleteNgo, toggleVerifyNgo } from "../services/ngo.service";
import { getCategories, getBeneficiaries } from "../services/meta.service";
import { clearTokens } from "../utils/authStorage";
import { useRequireAdmin } from "../hooks/useRequireAdmin";

/*------------------------------------------------------------------------------
                               INTERNAL HELPERS
------------------------------------------------------------------------------*/

/**
 * @brief Reusable action button for the dashboard.
 */
function ActionButton({ label, tone = "neutral", icon, onClick }) {
  const toneClass = {
    create: "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    update: "border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100",
    delete: "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100",
    neutral: "border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClass[tone] || toneClass.neutral}`}
    >
      {icon}
      {label}
    </button>
  );
}

/**
 * @brief Layout section wrapper for the dashboard.
 */
function AdminSection({ title, icon, count, onCreate, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">{title}</h2>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {count} records
            </p>
          </div>
        </div>
        {onCreate ? (
          <ActionButton
            label="POST"
            tone="create"
            icon={<Plus size={14} />}
            onClick={onCreate}
          />
        ) : null}
      </div>
      {children}
    </section>
  );
}

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Main Admin dashboard component.
 */
function Admin() {
  // Primary datasets
  const [ngos, setNgos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);

  // Operation status flags
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form modal state for create/edit form
  const [open, setOpen] = useState(false);
  const [editingNgo, setEditingNgo] = useState(null);

  const navigate = useNavigate();

  // Enforce authentication at the hook level
  const isAuthed = useRequireAdmin();

  /**
   * @brief Handle user session termination.
   */
  const handleLogout = useCallback(() => {
    clearTokens();
    navigate("/admin/login");
  }, [navigate]);

  /**
   * @brief Load category and beneficiary lookup data.
   */
  const loadMeta = useCallback(async () => {
    setErr("");
    try {
      const [cates, bens] = await Promise.all([getCategories(), getBeneficiaries()]);
      setCategories(asData(cates));
      setBeneficiaries(asData(bens));
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      setErr(e.message);
    }
  }, [handleLogout]);

  /**
   * @brief Load the primary NGO list.
   */
  const loadList = useCallback(async ({ silent = false } = {}) => {
    // ARTIFICIAL DELAY: Wait 2.5 seconds to show "Loading..." state (for student demo)
    if (!silent) await new Promise((r) => setTimeout(r, 2500));

    if (!silent) setLoading(true);
    setErr("");
    try {
      // Request a high limit to show all NGOs in one list
      const resp = await getNgos({ limit: 1000 });
      const payload = resp?.data || resp;

      if (payload?.data && Array.isArray(payload.data)) {
        setNgos(payload.data);
      } else {
        setNgos(Array.isArray(payload) ? payload : []);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      setErr(e.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [handleLogout]);

  // Initial stabilization sync
  useEffect(() => {
    if (!isAuthed) return;
    loadMeta();
    loadList();
  }, [isAuthed, loadList, loadMeta]);

  /**
   * @brief Initialize form for a new NGO entry.
   */
  function openAdd() {
    setEditingNgo(null);
    setOpen(true);
  }

  /**
   * @brief Initialize form for an existing NGO with detailed data.
   */
  async function openEdit(ngo) {
    console.log("Admin: openEdit called for NGO:", ngo.id, ngo.name);
    setErr("");
    setEditingId(ngo.id);
    try {
      const full = await getNgoById(ngo.id);
      const normalized = asData(full);
      console.log("Admin: Received normalized data:", normalized);
      setEditingNgo(normalized);
      setOpen(true);
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      setErr(e.message);
    } finally {
      setEditingId(null);
    }
  }

  /**
   * @brief Perform optimistic deletion of an NGO.
   */
  async function handleDelete(ngo) {
    const ok = window.confirm(`Delete: ${ngo.name} ?`);
    if (!ok) return;

    const previous = ngos;
    setDeletingId(ngo.id);
    setNgos((prev) => prev.filter((item) => item.id !== ngo.id));

    try {
      await deleteNgo(ngo.id);
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      setNgos(previous);
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  /**
   * @brief Toggle verification status with immediate UI feedback.
   */
  async function handleVerify(ngo) {
    const previousValue = Boolean(ngo.verified);
    setVerifyingId(ngo.id);
    setNgos((prev) =>
      prev.map((item) =>
        item.id === ngo.id
          ? {
            ...item,
            verified: !previousValue,
            updated_at: new Date().toISOString(),
          }
          : item
      )
    );

    try {
      const response = await toggleVerifyNgo(ngo.id);
      const payload = asData(response);

      if (typeof payload?.verified === "boolean") {
        setNgos((prev) =>
          prev.map((item) =>
            item.id === ngo.id
              ? { ...item, verified: payload.verified, updated_at: new Date().toISOString() }
              : item
          )
        );
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      setNgos((prev) =>
        prev.map((item) =>
          item.id === ngo.id ? { ...item, verified: previousValue } : item
        )
      );
      alert(e.message);
    } finally {
      setVerifyingId(null);
    }
  }

  /**
   * @brief Submit the NGO form (Create or Update).
   */
  async function handleSubmit(payload) {
    setSaving(true);
    try {
      if (editingNgo) {
        const response = await updateNgo(editingNgo.id, payload);
        const updated = asData(response);
        setNgos((prev) =>
          prev.map((item) =>
            item.id === editingNgo.id
              ? {
                ...item,
                ...updated,
                updated_at: updated?.updated_at || new Date().toISOString(),
              }
              : item
          )
        );
      } else {
        const response = await createNgo(payload);
        const created = asData(response);
        setNgos((prev) => [created, ...prev]);
      }
      setOpen(false);
      setEditingNgo(null);
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  // Date formatting helper
  function formatDate(value) {
    if (!value) return "Never";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Never";
    return date.toISOString().slice(0, 10);
  }

  // Response normalizer for paginated or direct responses
  function asData(response) {
    // Axios wraps response in .data. 
    // Our API for list data uses { data: [], meta: {} }
    // Our API for single data uses { ...ngoFields }
    const body = response?.data || response;

    // If it's the wrapped list format
    if (body?.data && Array.isArray(body.data)) return body.data;

    // If it's already an array
    if (Array.isArray(body)) return body;

    // If it's a single object (like a single NGO record for editing)
    if (body && typeof body === "object") return body;

    return body || null;
  }

  // Stats calculations
  const verifiedCount = useMemo(
    () => ngos.filter((ngo) => Boolean(ngo.verified)).length,
    [ngos]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dbeafe_0%,_#f8fafc_35%,_#e2e8f0_100%)] pb-10">
      <div className="pointer-events-none absolute -left-24 -top-20 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                NGO Dashboard API Control Panel
              </h1>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Manage NGOs with explicit actions: POST, PUT, DELETE, VERIFY.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ActionButton
                label="LOGOUT"
                tone="neutral"
                icon={<LogOut size={14} />}
                onClick={saving ? null : handleLogout}
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wide sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
              Total NGOs: {ngos.length}
            </div>
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-800">
              Verified: {verifiedCount}
            </div>
            <div className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-sky-800">
              Categories: {categories.length}
            </div>
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800">
              Beneficiaries: {beneficiaries.length}
            </div>
          </div>
        </section>

        {err ? (
          <div className="mb-5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {err}
          </div>
        ) : null}

        <AdminSection
          title="Organizations"
          icon={<Building2 size={18} />}
          count={ngos.length}
          onCreate={openAdd}
        >
          <div className="space-y-2">
            {loading ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-medium text-slate-500">
                Loading dashboard data...
              </div>
            ) : ngos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-medium text-slate-500">
                No NGOs yet. Click POST to create one.
              </div>
            ) : (
              ngos.map((ngo) => (
                <div
                  key={ngo.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 text-sm font-semibold text-slate-700">
                      <div className="text-base font-black text-slate-900">{ngo.name}</div>
                      <div>City: {ngo.city || "-"}</div>
                      <div>
                        Updated:{" "}
                        {formatDate(
                          ngo.updated_at ||
                          ngo.updatedAt ||
                          ngo.updated ||
                          ngo.created_at ||
                          ngo.createdAt
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleVerify(ngo)}
                        disabled={verifyingId === ngo.id || deletingId === ngo.id || saving}
                        className={
                          ngo.verified
                            ? "mt-1 inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                            : "mt-1 inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        }
                      >
                        {ngo.verified ? <BadgeCheck size={13} /> : <ShieldCheck size={13} />}
                        {verifyingId === ngo.id
                          ? "Updating..."
                          : ngo.verified
                            ? "Verified"
                            : "Unverified"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ActionButton
                        label={editingId === ngo.id ? "OPENING..." : "PUT"}
                        tone="update"
                        icon={<Pencil size={14} />}
                        onClick={
                          verifyingId === ngo.id || deletingId === ngo.id || saving
                            ? null
                            : () => openEdit(ngo)
                        }
                      />
                      <ActionButton
                        label={deletingId === ngo.id ? "DELETING..." : "DELETE"}
                        tone="delete"
                        icon={<Trash2 size={14} />}
                        onClick={
                          verifyingId === ngo.id || deletingId === ngo.id || saving
                            ? null
                            : () => handleDelete(ngo)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminSection>
      </main>

      <Modal open={open} title={editingNgo ? "Edit NGO" : "Add NGO"} onClose={() => setOpen(false)}>
        <NgoForm
          initial={editingNgo}
          categories={categories}
          beneficiaries={beneficiaries}
          onCancel={() => setOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={saving}
        />
      </Modal>
    </div>
  );
}

export default Admin;
