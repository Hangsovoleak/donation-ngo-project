import { useState, useEffect } from 'react';
import { ngoService } from '../services/ngoService';

function FilterSidebar({ filters, onChange }) {
    const [categories, setCategories] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [cats, benis] = await Promise.all([
                    ngoService.getCategories(),
                    ngoService.getBeneficiaries()
                ]);
                setCategories(cats);
                setBeneficiaries(benis);
            } catch (error) {
                console.error('Error fetching filters:', error);
            }
        };
        fetchFilters();
    }, []);

    const handleCheckboxChange = (type, id) => {
        const currentList = filters[type] || [];
        const newList = currentList.includes(id)
            ? currentList.filter(item => item !== id)
            : [...currentList, id];

        onChange({ ...filters, [type]: newList });
    };

    const handleLocationChange = (e) => {
        onChange({ ...filters, location: e.target.value });
    };

    const clearFilters = () => {
        onChange({ category: [], location: '', beneficiaries: [] });
    };

    return (
        <aside className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 sticky top-24 self-start">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Filters</h2>
                <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-blue-500 uppercase hover:underline"
                >
                    Clear all
                </button>
            </div>

            {/* Category Section */}
            <div className="mb-10">
                <legend className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 block">Category</legend>
                <div className="space-y-3">
                    {categories.map(cate => (
                        <label key={cate.id} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.category?.includes(cate.id)}
                                    onChange={() => handleCheckboxChange('category', cate.id)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 checked:bg-blue-200 checked:border-transparent transition-all"
                                />
                                <span className="absolute text-white text-xs opacity-0 peer-checked:opacity-100 ml-[3px] pointer-events-none mb-1">
                                    ✔️
                                </span>
                            </div>
                            <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                {cate.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Location Section */}
            <div className="mb-10">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Location</label>
                <div className="relative">
                    <select
                        value={filters.location}
                        onChange={handleLocationChange}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    >
                        <option value="">All Province</option>
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

            {/* Beneficiaries Section */}
            <div>
                <legend className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 block">Who is this for?</legend>
                <div className="space-y-3">
                    {beneficiaries.map(beni => (
                        <label key={beni.id} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.beneficiaries?.includes(beni.id)}
                                    onChange={() => handleCheckboxChange('beneficiaries', beni.id)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 checked:bg-blue-300 checked:border-transparent transition-all"
                                />
                                <span className="absolute text-white text-xs opacity-0 peer-checked:opacity-100 ml-[3px] pointer-events-none mb-1">
                                    ✔️
                                </span>
                            </div>
                            <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                {beni.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default FilterSidebar;