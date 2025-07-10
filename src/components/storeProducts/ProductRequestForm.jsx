import React, { useState, useEffect } from "react";
import {
  createProductRequest,
  getAllCategories,
  getSubCategoriesByCategoryId,
} from "@/api/sellerStoreService";

const initialState = {
  name: "",
  description: "",
  brand: "",
  unitTypes: "",
  unitType: "",
  categoryId: "",
  categorySubId: "",
  allowedDomestic: false,
  allowedInternational: false,
  image: null,
};

const ProductRequestForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

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
      setForm({ ...form, image: files[0] });
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
    } catch {
      alert("Başvuru gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md px-6 sm:px-10 py-8 space-y-8"
    >
      <header className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold text-gray-800">Yeni Ürün Başvurusu</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ürünü mağazanıza eklenmek üzere talep edebilirsiniz.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ürün Adı */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Ürün Adı</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Örn. Bluetooth Hoparlör"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Marka */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Marka</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
            placeholder="Örn. JBL"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Birim Tipleri */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Birim Tipleri</label>
          <input
            name="unitTypes"
            value={form.unitTypes}
            onChange={handleChange}
            placeholder="Örn. Paket, Adet, Kutu"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Birim Tipi */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Birim Tipi (int)</label>
          <input
            name="unitType"
            type="number"
            value={form.unitType}
            onChange={handleChange}
            placeholder="Örn. 1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Ana Kategori */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Ana Kategori</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Seçiniz</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Alt Kategori */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Alt Kategori</label>
          <select
            name="categorySubId"
            value={form.categorySubId}
            onChange={handleChange}
            disabled={!subcategories.length}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Seçiniz</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Görsel Yükleme */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">Ürün Görseli</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Açıklama */}
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

      {/* Checkbox'lar */}
      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowedDomestic"
            checked={form.allowedDomestic}
            onChange={handleChange}
            className="accent-blue-600"
          />
          Yurt içi satışa uygun
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowedInternational"
            checked={form.allowedInternational}
            onChange={handleChange}
            className="accent-blue-600"
          />
          Yurt dışı satışa uygun
        </label>
      </div>

      {/* Butonlar */}
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
