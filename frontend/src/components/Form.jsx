import { useEffect, useMemo, useState } from "react";

function Form({ initial, categories, beneficiaries, onCancel, onSubmit }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        city: "",
        phone: "",
        beneficiaries: [],
        categories: [],
        locations: [{ link: "" }],
    });

    useEffect(() => {
        if (initial) {
            const initialLinks =
                Array.isArray(initial.locations) && initial.locations.length
                    ? initial.locations.map((loc) =>
                          typeof loc === "string" ? { link: loc } : { link: loc?.link || "" }
                      )
                    : initial.map_link
                    ? [{ link: initial.map_link }]
                    : [{ link: "" }];

            setForm({
                name: initial.name || "",
                description: initial.description || "",
                city: initial.city || "",
                phone: initial.phone || "",
                beneficiaries: Array.isArray(initial.beneficiaries) ? initial.beneficiaries : [],
                categories: Array.isArray(initial.categories) ? initial.categories : [],
                locations: initialLinks,
            });
        }
    }, [initial]);

    const availableCategories = useMemo(() => {
        if (Array.isArray(categories) && categories.length) {
            return categories.map((c) => c.name || c);
        }
        return ["Education", "Healthcare", "Food", "Clothing"];
    }, [categories]);

    const availableBeneficiaries = useMemo(() => {
        if (Array.isArray(beneficiaries) && beneficiaries.length) {
            return beneficiaries.map((b) => b.name || b);
        }
        return ["Children", "Elderly", "Community"];
    }, [beneficiaries]);

    const update = (key) => (event) => {
        setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

    const toggleCategory = (category) => {
        setForm((prev) => {
            const next = prev.categories.includes(category)
                ? prev.categories.filter((item) => item !== category)
                : [...prev.categories, category];
            return { ...prev, categories: next };
        });
    };

    const toggleBeneficiary = (target) => {
        setForm((prev) => ({
            ...prev,
            beneficiaries: prev.beneficiaries.includes(target) ? [] : [target],
        }));
    };

    const updateLocation = (index) => (event) => {
        const value = event.target.value;
        setForm((prev) => {
            const locations = [...prev.locations];
            locations[index] = { ...locations[index], link: value };
            return { ...prev, locations };
        });
    };

    const addLocation = () => {
        setForm((prev) => ({
            ...prev,
            locations: [...prev.locations, { link: "" }],
        }));
    };

    const removeLocation = (index) => {
        setForm((prev) => {
            const next = prev.locations.filter((_, i) => i !== index);
            return { ...prev, locations: next.length ? next : [{ link: "" }] };
        });
    };

    function handleSubmit(event) {
        event.preventDefault();

        if (!form.name.trim()) {
            alert("NGO name is required");
            return;
        }

        const mapLinks = form.locations
            .map((loc) => loc.link.trim())
            .filter(Boolean);

        onSubmit({
            ...form,
            map_link: mapLinks[0] || "",
            map_links: mapLinks,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="h-full space-y-0">
            <div>
                <label className="text-xs font-semibold text-slate-600 mb-2 block">Organization Name</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="e.g. Hope for Children"
                    className="w-full px-3 py-2.5 bg-brand-base border border-brand-soft rounded-lg focus:ring-2 focus:ring-brand-soft transition-all outline-none text-sm text-brand-ink placeholder:text-brand-ink/40"
                    required
                />
            </div>

            <div>
                <label className="text-xs font-semibold text-brand-ink/70 mb-2 block">Description</label>
                <textarea
                    value={form.description}
                    onChange={update("description")}
                    placeholder="Tell us about the mission..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-brand-base border border-brand-soft rounded-lg focus:ring-2 focus:ring-brand-soft transition-all outline-none text-sm text-brand-ink placeholder:text-brand-ink/40 resize-none"
                    required
                />
            </div>

            <div>
                <label className="text-xs font-semibold text-brand-ink/70 mb-2 block">Operating City</label>
                <select
                    value={form.city}
                    onChange={update("city")}
                    className="w-full px-3 py-2.5 bg-brand-base border border-brand-soft rounded-lg focus:ring-2 focus:ring-brand-soft transition-all outline-none text-sm text-brand-ink appearance-none"
                    required
                >
                    <option value="" disabled>
                        Select Province
                    </option>
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

            <div>
                <label className="text-xs font-semibold text-brand-ink/70 mb-2 block">Phone Number</label>
                <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="e.g. +855 12 345 678"
                    className="w-full px-3 py-2.5 bg-brand-base border border-brand-soft rounded-lg focus:ring-2 focus:ring-brand-soft transition-all outline-none text-sm text-brand-ink placeholder:text-brand-ink/40"
                />
            </div>

            <div>
                <span className="text-xs font-semibold text-brand-ink/70 mb-2 block">Donation for who?</span>
                <div className="flex flex-wrap gap-2">
                    {availableBeneficiaries.map((target) => (
                        <button
                            key={target}
                            type="button"
                            onClick={() => toggleBeneficiary(target)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                form.beneficiaries.includes(target)
                                    ? "bg-brand-blue text-white border-brand-blue"
                                    : "bg-white text-brand-ink/70 border-brand-soft hover:bg-brand-base"
                            }`}
                        >
                            {target}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <span className="text-xs font-semibold text-brand-ink/70 mb-2 block">Categories</span>
                <div className="flex flex-wrap gap-3">
                    {availableCategories.map((category) => {
                        const checked = form.categories.includes(category);
                        return (
                            <label key={category} className="flex items-center gap-2 text-xs text-brand-ink/70">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleCategory(category)}
                                    className="h-4 w-4 rounded border-brand-soft text-brand-blue focus:ring-brand-soft"
                                />
                                {category}
                            </label>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-ink/70 ml-1">Donation Location Links</span>
                    <button
                        type="button"
                        onClick={addLocation}
                        className="text-xs font-semibold text-brand-blue hover:underline"
                    >
                        Add link
                    </button>
                </div>

                <div className="space-y-3">
                    {form.locations.map((location, index) => (
                        <div key={`${location.link}-${index}`} className="space-y-2 rounded-lg bg-brand-base p-2.5">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={location.link}
                                    onChange={updateLocation(index)}
                                    placeholder="Paste Google Maps link"
                                    className="w-full rounded-lg border border-brand-soft bg-white px-3 py-2 text-xs text-brand-ink outline-none focus:ring-2 focus:ring-brand-soft"
                                />
                                {form.locations.length > 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => removeLocation(index)}
                                        className="text-xs font-semibold text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 bg-brand-base text-brand-ink/70 text-sm font-semibold rounded-lg hover:bg-brand-soft transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-lg hover:bg-brand-ink transition-all"
                >
                    Save Organization
                </button>
            </div>
        </form>
    );
}

export default Form;
