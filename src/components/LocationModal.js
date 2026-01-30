import { useState, useEffect } from "react";
import { ngoService } from "../services/ngoService";

function LocationModal({ onClose, onAdd }) {
    const [ngos, setNgos] = useState([]);
    const [selectedNgoId, setSelectedNgoId] = useState("");
    const [location, setLocation] = useState({
        address: "",
        city: "Phnom Penh",
        latitude: 0,
        longitude: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                const data = await ngoService.getAllNGOs();
                setNgos(data);
                if (data.length > 0) setSelectedNgoId(data[0].id);
            } catch (error) {
                console.error("Error fetching NGOs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNGOs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedNgoId) return;
        setIsSubmitting(true);
        try {
            const ngo = ngos.find(n => n.id === parseInt(selectedNgoId));
            const updatedLocations = [...ngo.locations, location].map(l => ({
                address: l.address,
                city: l.city,
                latitude: l.latitude,
                longitude: l.longitude
            }));

            const updated = await ngoService.updateNGO(selectedNgoId, { locations: updatedLocations });
            onAdd(updated);
            onClose();
        } catch (error) {
            console.error("Error adding location:", error);
            alert("Failed to add location.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Add New Location</h2>
                        <p className="text-sm text-slate-400">Add an operating address to an existing NGO</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                {isLoading ? (
                    <div className="py-10 text-center">Loading NGOs...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Organization</label>
                            <select
                                value={selectedNgoId}
                                onChange={(e) => setSelectedNgoId(e.target.value)}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none text-slate-700"
                                required
                            >
                                {ngos.map(ngo => (
                                    <option key={ngo.id} value={ngo.id}>{ngo.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Address</label>
                            <input
                                type="text"
                                value={location.address}
                                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                                placeholder="Street number, Building name..."
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none text-slate-700"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">City</label>
                            <select
                                value={location.city}
                                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none text-slate-700"
                                required
                            >
                                <option value="Banteay Meanchey">Banteay Meanchey</option>
                                <option value="Battambang">Battambang</option>
                                <option value="Kampong Cham">Kampong Cham</option>
                                <option value="Kampong Chhnang">Kampong Chhnang</option>
                                <option value="Kampong Speu">Kampong Speu</option>
                                <option value="Kampong Thom">Kampong Thom</option>
                                <option value="Kampot">Kampot</option>
                                <option value="Kandal">Kandal</option>
                                <option value="Kep">Kep</option>
                                <option value="Koh Kong">Koh Kong</option>
                                <option value="Kratie">Kratie</option>
                                <option value="Mondulkiri">Mondulkiri</option>
                                <option value="Oddar Meanchey">Oddar Meanchey</option>
                                <option value="Pailin">Pailin</option>
                                <option value="Phnom Penh">Phnom Penh</option>
                                <option value="Preah Sihanouk">Preah Sihanouk</option>
                                <option value="Preah Vihear">Preah Vihear</option>
                                <option value="Prey Veng">Prey Veng</option>
                                <option value="Pursat">Pursat</option>
                                <option value="Ratanakiri">Ratanakiri</option>
                                <option value="Siem Reap">Siem Reap</option>
                                <option value="Stung Treng">Stung Treng</option>
                                <option value="Svay Rieng">Svay Rieng</option>
                                <option value="Takeo">Takeo</option>
                                <option value="Tboung Khmum">Tboung Khmum</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl">Cancel</button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-4 bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-100 disabled:opacity-50"
                            >
                                {isSubmitting ? "Adding..." : "Add Location"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default LocationModal;
