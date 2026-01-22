import { useState } from "react";
import NGOModal from "../components/NGOmodal";
import LoadingSpinner from "../components/LoadingSpinner";

function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [ngos, setNgos] = useState([]);

  const addNgo = (newNgo) => {
    setNgos([...ngos, newNgo]);
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage donation listings and locations
        </p>
      </header>

      {/* Action cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          onClick={() => setShowModal(true)}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            +
          </div>
          <h3 className="text-base font-semibold text-slate-700">
            Add Donation
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Create a new donation listing
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:bg-slate-50 transition">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
            +
          </div>
          <h3 className="text-base font-semibold text-slate-700">
            Add Location
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Add a donation location
          </p>
        </div>
      </section>

      {/* Donations list */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          All Donations
        </h2>

        {ngos.length === 0 ? (
          <div className="py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-3">Name</th>
                  <th className="py-3">City</th>
                  <th className="py-3">Categories</th>
                  <th className="py-3">Location</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ngos.map((ngo) => (
                  <tr
                    key={ngo.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 text-slate-700">{ngo.name}</td>
                    <td className="py-3 text-slate-600">{ngo.city}</td>
                    <td className="py-3 text-slate-600">
                      {ngo.categories.join(", ")}
                    </td>
                    <td className="py-3 text-slate-600">
                      {ngo.locations.join(", ")}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ngo.verified
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {ngo.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 text-blue-600 cursor-pointer">
                      Edit
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <NGOModal
          onClose={() => setShowModal(false)}
          onAdd={addNgo}
        />
      )}
    </main>
  );
}

export default DashboardPage;
