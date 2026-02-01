import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from '../components/Modal';
import NgoForm from '../components/Form';

import { getNgos, getNgoById, createNgo, updateNgo, deleteNgo, toggleVerifyNgo } from "../api/ngoApi";
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
        try {
            const cates = await getCategories();
            const bens = await getBeneficiaries();
            setCategories(cates.data || cates || []);
            setBeneficiaries(bens.data || bens || []);
        } catch (err) {
            setErr(err.message);
        }
    }

    async function loadList() {
        setLoading(true);
        setErr("");
        try {
            const list = await getNgos();
            setNgos(list.data || list || []);
        } catch (err) {
            setErr(err.message);
        }
        setLoading(false);
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
            setEditingNgo(full.data || full);
            setOpen(true);
        } catch (err) {
            setErr(err.message);
        }
        setLoading(false);
    }

    async function handleDelete(ngo) {
        const ok = window.confirm("Delete: " + ngo.name + " ?");
        if(!ok) return;

        try {
            await deleteNgo(ngo.id);
            loadList();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleVerify(ngo) {
        try {
            await toggleVerifyNgo(ngo.id);
            loadList();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleSubmit(payload) {
        try {
            if(editingNgo) {
                await updateNgo(editingNgo.id, payload);
            } else {
                await createNgo(payload);
            }

            setOpen(false);
            setEditingNgo(null);
            loadList();
        } catch (err) {
            alert(err.message);
        }
    }

    function formatDate(value) {
        if (!value) return "Never";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Never";
        return date.toISOString().slice(0, 10);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-3xl font-bold text-brand-ink">Admin Dashboard</div>

                <div className="flex items-center gap-8">
                    <button
                        onClick={() => {
                            localStorage.removeItem("AdminToken");
                            navigate("/admin/login");
                        }}
                        className="text-slate-950 bg-sky-100 border border-sky-200 hover:bg-red-200 hover:border-red-300 shadow-sm font-medium leading-5 rounded-full text-sm px-4 py-2.5 items-center"
                    >
                        Logout
                    </button>
                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-2 text-white bg-brand-blue hover:bg-brand-ink border border-transparent focus:ring-4 focus:ring-brand-soft shadow-sm font-medium leading-5 rounded-full text-sm px-4 py-2.5"
                    >
                        Add NGO
                    </button>
                </div>
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <div className="overflow-x-auto border border-brand-soft rounded-2xl shadow-sm bg-white">
                <table className="w-full text-sm text-left text-brand-ink/80">
                    <thead className="text-xs text-brand-ink uppercase bg-brand-base border-b border-brand-soft">
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
                                <td className="px-4 py-3 font-medium text-brand-ink whitespace-nowrap">Loading...</td>
                                <td className="px-4 py-3" />
                                <td className="px-4 py-3" />
                                <td className="px-4 py-3" />
                                <td className="px-4 py-3" />
                            </tr>
                        ) : (
                            ngos.map((ngo) => (
                                <tr key={ngo.id} className="border-t border-brand-soft">
                                    <td className="px-4 py-3 font-medium text-brand-ink whitespace-nowrap">{ngo.name}</td>
                                    <td className="px-4 py-3">{ngo.city || "-"}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => handleVerify(ngo)}
                                            className={
                                                ngo.verified
                                                    ? "inline-flex font-semibold items-center gap-1 text-slate-900 border border-green-300 bg-green-200 rounded-full text-xs px-2.5 py-1"
                                                    : "inline-flex font-semibold items-center gap-1 text-slate-900 border border-red-300 bg-red-200 rounded-full text-xs px-2.5 py-1"
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
                                                className="text-brand-ink/70 hover:text-brand-ink"
                                                aria-label="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4B77D1"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ngo)}
                                                className="text-red-600 hover:text-red-700"
                                                aria-label="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#BB271A"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                open={open}
                title={editingNgo ? "Edit NGO" : "Add NGO"}
                onClose={() => setOpen(false)}
            >
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

export default Admin
