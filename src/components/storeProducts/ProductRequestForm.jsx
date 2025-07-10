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
      className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-8"
    >
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Yeni Ürün Başvurusu</h2>
        <p className="text-sm text-gray-500">Aşağıdaki formu eksiksiz doldurarak ürün talebinizi oluşturabilirsiniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Örn. Bluetooth Hoparlör"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Örn. JBL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birim Tipleri</label>
          <input
            name="unitTypes"
            value={form.unitTypes}
            onChange={handleChange}
            placeholder="Örn. Paket, Adet, Kutu"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birim Tipi (int)</label>
          <input
            name="unitType"
            type="number"
            value={form.unitType}
            onChange={handleChange}
            placeholder="Örn. 1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ana Kategori</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt Kategori</label>
          <select
            name="categorySubId"
            value={form.categorySubId}
            onChange={handleChange}
            disabled={!subcategories.length}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Görsel</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder="Ürün hakkında detaylı bilgi giriniz..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 text-sm">
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

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-md text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </div>
    </form>
  );
};

export default ProductRequestForm;
