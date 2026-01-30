import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NGOModal from "../components/NGOmodal";
import LocationModal from "../components/LocationModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { ngoService } from "../services/ngoService";
import { authService } from "../services/authService";

function DashboardPage() {
  const [showNGOModal, setShowNGOModal] = useState(false);
  const [showLocModal, setShowLocModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNGOs = async () => {
    try {
      setIsLoading(true);
      const data = await ngoService.getAllNGOs();
      setNgos(data);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate("/login");
    } else {
      fetchNGOs();
    }
  }, [navigate]);

  const handleEdit = (ngo) => {
    setSelectedNgo(ngo);
    setShowNGOModal(true);
  };

  const handleAddNew = () => {
    setSelectedNgo(null);
    setShowNGOModal(true);
  };

  const onDataChange = () => {
    fetchNGOs();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        await ngoService.deleteNGO(id);
        fetchNGOs();
      } catch (error) {
        console.error("Error deleting NGO:", error);
      }
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage donation listings and locations</p>
        </div>
        <button
          onClick={() => { authService.logout(); navigate("/login"); }}
          className="text-sm font-bold text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          onClick={handleAddNew}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-xl">+</div>
          <h3 className="text-base font-semibold text-slate-700">Add Donation</h3>
          <p className="text-sm text-slate-500 mt-1">Create a new donation listing</p>
        </div>

        <div
          onClick={() => setShowLocModal(true)}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 text-xl">+</div>
          <h3 className="text-base font-semibold text-slate-700">Add Location</h3>
          <p className="text-sm text-slate-500 mt-1">Add a donation location to existing NGO</p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">All Donations</h2>

        {isLoading ? (
          <div className="py-10"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">City</th>
                  <th className="py-3 px-2">Categories</th>
                  <th className="py-3 px-2">Addresses</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ngos.map((ngo) => (
                  <tr key={ngo.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-2 text-slate-700 font-medium">{ngo.name}</td>
                    <td className="py-3 px-2 text-slate-600">{ngo.city}</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-wrap gap-1">
                        {ngo.categories.map(c => (
                          <span key={c.id} className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-tighter">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-500 text-xs">
                      {ngo.locations.length > 0
                        ? ngo.locations.map(l => l.address).join(", ")
                        : <span className="text-slate-300 italic">No addresses</span>}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${ngo.verified ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                        {ngo.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(ngo)} className="text-blue-500 hover:text-blue-600 font-bold">Edit</button>
                        <button onClick={() => handleDelete(ngo.id)} className="text-red-400 hover:text-red-500">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showNGOModal && (
        <NGOModal
          onClose={() => setShowNGOModal(false)}
          onAdd={onDataChange}
          editData={selectedNgo}
        />
      )}

      {showLocModal && (
        <LocationModal
          onClose={() => setShowLocModal(false)}
          onAdd={onDataChange}
        />
      )}
    </main>
  );
}

export default DashboardPage;
