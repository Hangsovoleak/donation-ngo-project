import { useState, useEffect } from "react";
import { ngoService } from "../services/ngoService";
import LoadingSpinner from "./LoadingSpinner";

function NGOModal({ onClose, onAdd, editData = null }) {
    const [formData, setFormData] = useState({
        name: "",
        short_description: "",
        description: "",
        city: "Phnom Penh",
        phone: "",
        website: "",
        qr_code: "",
        category_ids: [],
        beneficiary_ids: [],
        locations: []
    });

    const [categories, setCategories] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, benis] = await Promise.all([
                    ngoService.getCategories(),
                    ngoService.getBeneficiaries()
                ]);
                setCategories(cats);
                setBeneficiaries(benis);

                if (editData) {
                    setFormData({
                        ...editData,
                        category_ids: editData.categories.map(c => c.id),
                        beneficiary_ids: editData.beneficiaries.map(b => b.id),
                        locations: editData.locations.map(l => ({
                            address: l.address,
                            city: l.city,
                            latitude: l.latitude,
                            longitude: l.longitude
                        }))
                    });
                }
            } catch (error) {
                console.error("Error fetching modal data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [editData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (type, id) => {
        setFormData(prev => {
            const currentList = prev[type];
            const newList = currentList.includes(id)
                ? currentList.filter(item => item !== id)
                : [...currentList, id];
            return { ...prev, [type]: newList };
        });
    };

    const handleAddLocation = () => {
        setFormData(prev => ({
            ...prev,
            locations: [...prev.locations, { address: "", city: prev.city || "Phnom Penh" }]
        }));
    };

    const handleLocationChange = (index, field, value) => {
        const newLocations = [...formData.locations];
        newLocations[index][field] = value;
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const handleRemoveLocation = (index) => {
        setFormData(prev => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editData) {
                const updated = await ngoService.updateNGO(editData.id, formData);
                onAdd(updated);
            } else {
                const created = await ngoService.createNGO(formData);
                onAdd(created);
            }
            onClose();
        } catch (error) {
            console.error("Error saving NGO:", error);
            alert("Failed to save NGO. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {editData ? "Edit Organization" : "Add New NGO"}
                        </h2>
                        <p className="text-sm text-slate-400">
                            {editData ? "Update the details of your organization" : "Fill in the details to register a new organization"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Organization Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Hope for Children"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Short Description</label>
                                <input
                                    name="short_description"
                                    value={formData.short_description || ""}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="One sentence summary"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Operating City</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 appearance-none"
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
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Phone Number</label>
                                <input
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. 012 345 678"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Website</label>
                                <input
                                    name="website"
                                    value={formData.website || ""}
                                    onChange={handleChange}
                                    type="url"
                                    placeholder="https://example.org"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">QR Code URL</label>
                                <input
                                    name="qr_code"
                                    value={formData.qr_code || ""}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Link to QR code image"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Full Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell us about the mission and work..."
                            rows={4}
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder:text-slate-300 resize-none"
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleCheckboxChange('category_ids', cat.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${formData.category_ids.includes(cat.id)
                                            ? "bg-blue-100 text-blue-600 border-2 border-blue-200"
                                            : "bg-slate-50 text-slate-400 border-2 border-transparent hover:bg-slate-100"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Beneficiaries</label>
                            <div className="flex flex-wrap gap-2">
                                {beneficiaries.map(ben => (
                                    <button
                                        key={ben.id}
                                        type="button"
                                        onClick={() => handleCheckboxChange('beneficiary_ids', ben.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${formData.beneficiary_ids.includes(ben.id)
                                            ? "bg-green-100 text-green-600 border-2 border-green-200"
                                            : "bg-slate-50 text-slate-400 border-2 border-transparent hover:bg-slate-100"
                                            }`}
                                    >
                                        {ben.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">Donation Locations</label>
                            <button
                                type="button"
                                onClick={handleAddLocation}
                                className="text-xs font-bold text-blue-500 hover:underline"
                            >
                                + Add Address
                            </button>
                        </div>
                        {formData.locations.map((loc, index) => (
                            <div key={index} className="flex gap-2 p-4 bg-slate-50 rounded-2xl relative">
                                <div className="flex-1 space-y-2">
                                    <input
                                        placeholder="Address"
                                        value={loc.address}
                                        onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                                        className="w-full bg-transparent border-none outline-none text-sm text-slate-700"
                                        required
                                    />
                                    <input
                                        placeholder="City"
                                        value={loc.city}
                                        onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                                        className="w-full bg-transparent border-none outline-none text-xs text-slate-400"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLocation(index)}
                                    className="text-slate-300 hover:text-red-400"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : editData ? "Update Organization" : "Save Organization"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NGOModal;