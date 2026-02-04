import { useEffect, useState } from "react";
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
} from "../api/ngoApi";

import { getCategories, getBeneficiaries } from "../api/metaApi";

function Admin() {
  const [ngos, setNgos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [open, setOpen] = useState(false);
  const [editingNgo, setEditingNgo] = useState(null);

  const navigate = useNavigate();

  async function loadMeta() {
    setErr("");
    try {
      const [cates, bens] = await Promise.all([getCategories(), getBeneficiaries()]);
      setCategories(asData(cates));
      setBeneficiaries(asData(bens));
    } catch (e) {
      setErr(e.message);
    }
  }

  async function loadList() {
    setLoading(true);
    setErr("");
    try {
      const list = await getNgos();
      setNgos(asData(list));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("AdminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadMeta();
    loadList();
  }, [navigate]);

  function openAdd() {
    setEditingNgo(null);
    setOpen(true);
  }

  async function openEdit(ngo) {
    setErr("");
    setLoading(true);
    try {
      const full = await getNgoById(ngo.id);
      setEditingNgo(asData(full));
      setOpen(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(ngo) {
    const ok = window.confirm(`Delete: ${ngo.name} ?`);
    if (!ok) return;

    try {
      await deleteNgo(ngo.id);
      loadList();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleVerify(ngo) {
    try {
      await toggleVerifyNgo(ngo.id);
      loadList();
    } catch (e) {
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

  function handleLogout() {
    localStorage.removeItem("AdminToken");
    navigate("/admin/login");
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-md border-2 border-black bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-800">
              Manage NGOs, edit details, and verify profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border-2 border-orange-400 bg-orange-300 text-white text-sm font-semibold"
            >
              Logout
            </button>

            <button
              onClick={openAdd}
              className="px-4 py-2 rounded-lg border-2 border-blue-400 bg-blue-300 text-white text-sm font-semibold"
            >
              + Add NGO
            </button>
          </div>
        </div>
      </div>

      {err && <div className="text-sm text-brand-red">{err}</div>}

      {/* Table */}
      <div className="overflow-x-auto border-2 border-brand-soft rounded-lg shadow-sm bg-white">
        <table className="w-full text-sm text-left text-brand-ink/80">
          <thead className="text-xs text-slate-900 uppercase bg-blue-50 border-b border-blue-100">
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
                <td className="px-4 py-4 font-medium text-white">Loading...</td>
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
                <tr key={ngo.id} className="border-t border-slate-200">
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
                          ? "inline-flex font-semibold items-center gap-1 text-white border border-green-400 bg-green-300 rounded-xl text-xs px-2 py-1"
                          : "inline-flex font-semibold items-center gap-1 text-white border border-red-400 bg-red-300 rounded-xl text-xs px-2 py-1"
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
                        className="px-3 py-1 text-slate-950 rounded-full border-2 border-blue-400 bg-blue-300 text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ngo)}
                        className="px-3 py-1 text-slate-950 rounded-full border-2 border-red-400 bg-red-300 text-xs font-semibold"
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
