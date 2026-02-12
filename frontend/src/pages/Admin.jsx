// Page: Admin dashboard to manage NGOs (CRUD + verify).
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import NgoForm from "../components/Form";

import {
  getNgos,
  getNgoById,
  createNgo,
  updateNgo,
  deleteNgo,
  toggleVerifyNgo,
} from "../services/ngo.service";

import { getCategories, getBeneficiaries } from "../services/meta.service";
import { clearTokens } from "../utils/authStorage";
import { useRequireAdmin } from "../hooks/useRequireAdmin";

function Admin() {
  const [ngos, setNgos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [open, setOpen] = useState(false);
  const [editingNgo, setEditingNgo] = useState(null);

  const navigate = useNavigate();

  const isAuthed = useRequireAdmin();
  const handleLogout = useCallback(() => {
    clearTokens();
    navigate("/admin/login");
  }, [navigate]);

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

  //display lists of data 
  const loadList = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await getNgos();
      setNgos(asData(list));
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (!isAuthed) return;
    loadMeta();
    loadList();
  }, [isAuthed, loadList, loadMeta]);

  //handle on add NGO button in dashboard
  function openAdd() {
    setEditingNgo(null);
    setOpen(true);
  }

  //edit button can work the same as add NGOs
  async function openEdit(ngo) {
    setErr("");
    setLoading(true);
    try {
      const full = await getNgoById(ngo.id);
      setEditingNgo(asData(full));
      setOpen(true);
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  //delete data by which show by organization name
  async function handleDelete(ngo) {
    const ok = window.confirm(`Delete: ${ngo.name} ?`);
    if (!ok) return;

    try {
      await deleteNgo(ngo.id);
      loadList();
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      alert(e.message);
    }
  }

  //for verify button depend on Click by admin
  async function handleVerify(ngo) {
    try {
      await toggleVerifyNgo(ngo.id);
      loadList();
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      alert(e.message);
    }
  }

  async function handleSubmit(payload) {
    try {
      if (editingNgo) {
        await updateNgo(editingNgo.id, payload);
      } else {
        await createNgo(payload);
      }
      setOpen(false);
      setEditingNgo(null);
      loadList();
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      alert(e.message);
    }
  }

  function formatDate(value) {
    if (!value) return "Never";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Never";
    return date.toISOString().slice(0, 10);
  }

  function asData(response) {
    return response?.data || response || [];
  }


  return (
    <div className="space-y-6">
      {/* For admin Header card */}
      <div className="card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage NGOs, edit details, and verify profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="btn-outline text-sm"
            >
              Logout
            </button>

            <button
              onClick={openAdd}
              className="btn-primary text-sm"
            >
              + Add NGO
            </button>
          </div>
        </div>
      </div>

      {err && <div className="text-sm text-red-600">{err}</div>}

      {/* For admin Table */}
      <div className="overflow-x-auto card">
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td className="px-4 py-4 font-medium text-slate-600">Loading...</td>
                <td className="px-4 py-4" />
                <td className="px-4 py-4" />
                <td className="px-4 py-4" />
                <td className="px-4 py-4" />
              </tr>
            ) : ngos.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-900" colSpan={5}>
                  No NGOs yet. Click “Add NGO” to create one.
                </td>
              </tr>
            ) : (
              ngos.map((ngo) => (
                <tr key={ngo.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {ngo.name}
                  </td>
                  <td className="px-4 py-3">{ngo.city || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleVerify(ngo)}
                      className={
                        ngo.verified
                          ? "inline-flex font-semibold items-center gap-1 text-green-700 border border-green-200 bg-green-50 rounded-xl text-xs px-2 py-1"
                          : "inline-flex font-semibold items-center gap-1 text-rose-700 border border-rose-200 bg-rose-50 rounded-xl text-xs px-2 py-1"
                      }
                    >
                      {ngo.verified ? "Verified" : "Unverified"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(
                      ngo.updated_at ||
                      ngo.updatedAt ||
                      ngo.updated ||
                      ngo.created_at ||
                      ngo.createdAt
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(ngo)}
                        className="px-3 py-1 text-slate-900 rounded-full border border-slate-300 bg-white text-xs font-semibold hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ngo)}
                        className="px-3 py-1 text-rose-700 rounded-full border border-rose-200 bg-rose-50 text-xs font-semibold hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* For admin Modal */}
      <Modal open={open} title={editingNgo ? "Edit NGO" : "Add NGO"} onClose={() => setOpen(false)}>
        <NgoForm
          initial={editingNgo}
          categories={categories}
          beneficiaries={beneficiaries}
          onCancel={() => setOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

export default Admin;
