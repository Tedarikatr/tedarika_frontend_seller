import React, { useState, useEffect } from "react";
import {
  createProductRequest,
  getAllCategories,
  getSubCategoriesByCategoryId,
} from "@/api/sellerStoreService";

// Etiketler
const UNIT_TYPE_LABELS = {
  1: "Adet", 2: "Ambalaj", 3: "Bidon", 4: "Çuval", 5: "Düzine", 6: "Galon",
  7: "Gram", 8: "Gramaj", 9: "Karat", 10: "Kasa", 11: "kg", 12: "Koli",
  13: "Litre", 14: "Metre", 15: "Metrekare", 16: "Metreküp", 17: "Mililitre",
  18: "Paket", 19: "Palet", 20: "Rulo", 21: "Sandık", 22: "Santimetre",
  23: "Şişe", 24: "Tane", 25: "Takım", 26: "Ton"
};

const initialState = {
  name: "",
  brand: "",
  unitTypes: "",
  unitType: "",
  description: "",
  categoryId: "",
  categorySubId: "",
  allowedDomestic: false,
  allowedInternational: false,
  image: null,
};

const ProductRequestForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState("");

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (form.categoryId) {
      getSubCategoriesByCategoryId(form.categoryId)
        .then(setSubcategories)
        .catch(() => setSubcategories([]));
    } else {
      setSubcategories([]);
    }
  }, [form.categoryId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      setForm({ ...form, image: file });
      if (file) setPreviewURL(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setLoading(true);
      await createProductRequest(formData);
      onSuccess();
    } catch (error) {
      alert("Başvuru gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md px-6 sm:px-10 py-8 space-y-8"
    >
      <header className="border-b pb-5">
        <h2 className="text-2xl font-bold text-gray-800">Yeni Ürün Başvurusu</h2>
        <p className="text-sm text-gray-500 mt-1">Ürünü mağazanıza eklenmek üzere talep edebilirsiniz.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput name="name" label="Ürün Adı" placeholder="Örn. Bluetooth Hoparlör" value={form.name} onChange={handleChange} required />
        <TextInput name="brand" label="Marka" placeholder="Örn. JBL" value={form.brand} onChange={handleChange} required />
        <TextInput name="unitTypes" label="Birim Tipleri (Açıklama)" placeholder="Örn. Adet, Paket" value={form.unitTypes} onChange={handleChange} />
        
        <SelectInput name="unitType" label="Birim Tipi" value={form.unitType} onChange={handleChange} required options={UNIT_TYPE_LABELS} />

        <SelectInput name="categoryId" label="Ana Kategori" value={form.categoryId} onChange={handleChange} required options={categories.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {})} />
        <SelectInput name="categorySubId" label="Alt Kategori" value={form.categorySubId} onChange={handleChange} options={subcategories.reduce((acc, s) => ({ ...acc, [s.id]: s.name }), {})} disabled={!subcategories.length} />

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">Ürün Görseli</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewURL && (
            <img src={previewURL} alt="Önizleme" className="mt-2 max-h-40 rounded shadow" />
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Ürün Açıklaması</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Ürün hakkında detaylı bilgi giriniz..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
        <Checkbox name="allowedDomestic" checked={form.allowedDomestic} onChange={handleChange} label="Yurt içi satışa uygun" />
        <Checkbox name="allowedInternational" checked={form.allowedInternational} onChange={handleChange} label="Yurt dışı satışa uygun" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </div>
    </form>
  );
};

export default ProductRequestForm;

// --- Ek Bileşenler ---
const TextInput = ({ name, label, value, onChange, placeholder, required }) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

const SelectInput = ({ name, label, value, onChange, options, required, disabled }) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Seçiniz</option>
      {Object.entries(options).map(([key, label]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
  </div>
);

const Checkbox = ({ name, checked, onChange, label }) => (
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="accent-blue-600"
    />
    {label}
  </label>
);
