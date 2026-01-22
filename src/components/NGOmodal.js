function NGOModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/20">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Add New NGO</h2>
                        <p className="text-sm text-slate-400">Fill in the details to register a new organization</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-5">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Organization Name</label>
                        <input 
                            type="text"
                            placeholder="e.g. Hope for Children"
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Description</label>
                        <textarea
                            placeholder="Tell us about the mission..."
                            rows={3}
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 placeholder:text-slate-300 resize-none"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Operating City</label>
                        <select className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-700 appearance-none" required>
                            <option>All Province</option>
                            <option value="Banteay Meanchey">Banteay Meanchey</option>
                            <option value="Battambang">Battambang</option>
                            <option value="Kampong Chhnang">Kampong Chhnang</option>
                            <option value="Kampong Cham">Kampong Cham</option>
                            <option value="Kampong Speu">Kampong Speu</option>
                            <option value="Kampong Thom">Kampong Thom</option>
                            <option value="Kampot">Kampot</option>
                            <option value="Kandal">Kandal</option>
                            <option value="Kep">Kep</option>
                            <option value="Kratie">Kratie</option>
                            <option value="Mondulkiri">Mondulkiri</option>
                            <option value="Phnom Penh">Phnom Penh</option>
                            <option value="Preah Sihanouk">Preah Sihanouk</option>
                            <option value="Prey Veng">Prey Veng</option>
                            <option value="Pursat">Pursat</option>
                            <option value="Ratanakiri">Ratanakiri</option>
                            <option value="Siem Reap">Siem Reap</option>
                            <option value="Stung Treng">Stung Treng</option>
                            <option value="Svay Rieng">Svay Rieng</option>
                            <option value="Takeo">Takeo</option>
                            <option value="Oddar Meanchey">Oddar Meanchey</option>
                            <option value="Preah Vihear">Preah Vihear</option>
                            <option value="Koh Kong">Koh Kong</option>
                            <option value="Tboung Khmum">Tboung Khmum</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-6 py-4 bg-blue-300 text-white font-bold rounded-2xl hover:bg-blue-400 shadow-lg shadow-blue-100 transition-all"
                        >
                            Save Organization
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NGOModal;