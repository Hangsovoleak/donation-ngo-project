// Form: Admin create/edit NGO form with validation and helper logic.
import { useEffect, useMemo, useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  city: "",
  phone: "",
  image_url: "",
  beneficiaries: [],
  categories: [],
  locations: [{ link: "" }],
};

function buildInitialForm(initial) {
  const locations =
    Array.isArray(initial.locations) && initial.locations.length
      ? initial.locations.map((loc) => ({ link: toLink(loc) }))
      : initial.map_link
      ? [{ link: initial.map_link }]
      : [{ link: "" }];

  return {
    ...EMPTY_FORM,
    name: initial.name || "",
    description: initial.description || "",
    city: initial.city || "",
    phone: initial.phone || "",
    image_url: initial.image_url || "",
    beneficiaries: Array.isArray(initial.beneficiaries) ? initial.beneficiaries : [],
    categories: Array.isArray(initial.categories) ? initial.categories : [],
    locations,
  };
}

function toLink(loc) {
  if (typeof loc === "string") return loc;
  return loc?.link || "";
}

function Form({ initial, categories, beneficiaries, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!initial) return;
    setForm(buildInitialForm(initial));
  }, [initial]);

  const categoryNames = useMemo(() => {
    return Array.isArray(categories) && categories.length
      ? categories.map((cate) => cate.name || cate)
      : [
          "Education",
          "Healthcare",
          "Food",
          "Clothing",
          "Enviroment",
          "Women Empowerment",
          "Disaster Relief",
          "Animal Welface",
        ];
  }, [categories]);

  const beneficiaryNames = useMemo(() => {
    return Array.isArray(beneficiaries) && beneficiaries.length
      ? beneficiaries.map((bene) => bene.name || bene)
      : ["Children", "Elderly", "Community", "Women", "Animal"];
  }, [beneficiaries]);

  const categoryNameToId = useMemo(() => {
    return new Map((categories || []).map((cate) => [cate.name, cate.id]));
  }, [categories]);

  const beneficiaryNameToId = useMemo(() => {
    return new Map((beneficiaries || []).map((bene) => [bene.name, bene.id]));
  }, [beneficiaries]);

  function updateField(key) {
    return (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function toggleCategory(name) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(name)
        ? prev.categories.filter((cate) => cate !== name)
        : [...prev.categories, name],
    }));
  }

  function toggleBeneficiary(name) {
    setForm((prev) => ({
      ...prev,
      beneficiaries: prev.beneficiaries.includes(name) ? [] : [name],
    }));
  }

  function updateLocation(index) {
    return (e) => {
      const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === index ? { ...loc, link: value } : loc
      ),
    }));
  };
  }

  function addLocation() {
    setForm((prev) => ({ ...prev, locations: [...prev.locations, { link: "" }]}));
  }

  function removeLocation(index) {
    setForm((prev) => {
      const next = prev.locations.filter((_, i) => i !== index);
      return { ...prev, locations: next.length ? next : [{ link: "" }] };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("NGO name is required");
      return;
    }

    const categoryIds = form.categories
      .map((name) => categoryNameToId.get(name))
      .filter(Number.isFinite);

    const beneficiaryIds = form.beneficiaries
      .map((name) => beneficiaryNameToId.get(name))
      .filter(Number.isFinite);

    const mapLinks = form.locations.map((loc) => loc.link.trim()).filter(Boolean);

    onSubmit({
      ...form,
      categoryIds,
      beneficiaryIds,
      map_link: mapLinks[0] || "",
      map_links: mapLinks,
    });
  }


  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">
            {initial ? "Edit organization" : "Add organization"}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            Organization Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={updateField("name")}
            placeholder="e.g. Hope for Children"
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg outline-none text-sm text-slate-900"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600 mb-2 block">Description</label>
          <textarea
            value={form.description}
            onChange={updateField("description")}
            placeholder="Tell us about the mission..."
            rows={3}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg outline-none text-sm text-slate-900 resize-none"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">Operating City</label>
          <select
            value={form.city}
            onChange={updateField("city")}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none text-sm text-slate-900"
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

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={updateField("phone")}
            placeholder="e.g. +855 12 345 678"
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none text-sm text-slate-900"
          />
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600 mb-2 block">Image URL</label>
          <input
            type="url"
            value={form.image_url}
            onChange={updateField("image_url")}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none text-sm text-slate-900"
          />
        </div>

        {/* Beneficiaries */}
        <div className="md:col-span-2">
          <div className="text-xs font-semibold text-slate-600 mb-2">Donation for who?</div>
          <div className="flex flex-wrap gap-2">
            {beneficiaryNames.map((target) => {
              const active = form.beneficiaries.includes(target);
              return (
                <button
                  key={target}
                  type="button"
                  onClick={() => toggleBeneficiary(target)}
                  className={
                    active
                      ? "px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white border border-slate-900"
                      : "px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200"
                  }
                >
                  {target}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="md:col-span-2">
          <div className="text-xs font-semibold text-slate-600 mb-2">Categories</div>
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((c) => {
              const checked = form.categories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  className={
                    checked
                      ? "px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white border border-slate-900"
                      : "px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200"
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locations */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-600">Donation Location Links</div>
            <button
              type="button"
              onClick={addLocation}
              className="text-xs font-semibold text-slate-700 hover:underline"
            >
              + Add link
            </button>
          </div>

          <div className="space-y-3">
            {form.locations.map((loc, index) => (
              <div
                key={`${loc.link}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={loc.link}
                    onChange={updateLocation(index)}
                    placeholder="Paste Google Maps link"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                  {form.locations.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="text-xs font-semibold text-red-500 hover:underline whitespace-nowrap"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-outline text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 btn-primary text-sm"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default Form;
