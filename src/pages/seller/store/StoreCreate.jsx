// src/pages/seller/store/StoreCreate.jsx
import { useState, useEffect } from "react";
import { createStore, getAllCategories } from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";

const StoreCreate = () => {
  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    logoFile: null,
    bannerFile: null,
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCategories();
        const arr = Array.isArray(res) ? res : (res?.items || []);
        const normalized = arr.map((c) => ({
          id: Number(c.id ?? c.Id),
          name: String(c.name ?? c.Name ?? ""),
        }));
        setCategories(normalized);
      } catch {
        setMessage("❌ Kategoriler alınamadı.");
      }
    })();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, [key]: file }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) =>
      Number(opt.value)
    );
    setForm((prev) => ({ ...prev, categoryIds: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Basit validasyon
    if (!form.storeName.trim()) return setMessage("❌ Mağaza adı zorunludur.");
    if (!form.logoFile) return setMessage("❌ Logo zorunludur.");
    if (!form.categoryIds.length) return setMessage("❌ En az bir kategori seçiniz.");
    if (form.logoFile && !form.logoFile.type.startsWith("image/")) {
      return setMessage("❌ Logo için geçerli bir görsel seçiniz.");
    }
    if (form.bannerFile && !form.bannerFile.type.startsWith("image/")) {
      return setMessage("❌ Banner için geçerli bir görsel seçiniz.");
    }

    try {
      setSubmitting(true);
      setMessage("Mağaza oluşturuluyor...");
      await createStore(form);

      // Sende /seller/store route'u yok; /seller/store/update var.
      navigate("/seller/store/update", { replace: true });
    } catch {
      setMessage("❌ Mağaza oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-[#003636] mb-8">
        Mağaza Oluştur
      </h2>

      {message && (
        <div className="mb-6 text-sm px-4 py-3 border rounded-md bg-yellow-50 text-yellow-800 border-yellow-300 text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5 bg-white p-6 rounded-xl shadow-md">
        <input
          name="storeName"
          value={form.storeName}
          onChange={handleChange}
          placeholder="Mağaza Adı *"
          className="p-3 border rounded-md"
        />

        <textarea
          name="storeDescription"
          value={form.storeDescription}
          onChange={handleChange}
          placeholder="Mağaza Açıklaması"
          className="p-3 border rounded-md"
        />

        <div>
          <label className="text-sm font-semibold">Logo (zorunlu)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logoFile")} />
        </div>

        <div>
          <label className="text-sm font-semibold">Banner (opsiyonel)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bannerFile")} />
        </div>

        <div>
          <label className="text-sm font-semibold">Kategoriler</label>
          <select
            multiple
            value={form.categoryIds}
            onChange={handleCategoryChange}
            className="w-full border p-2 rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Birden fazla kategori seçmek için <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> tuşunu kullanın.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#003636] hover:bg-[#004848] text-white font-semibold py-2 rounded-lg disabled:opacity-60"
        >
          {submitting ? "İşleniyor..." : "Mağazayı Oluştur"}
        </button>
      </form>
    </div>
  );
};

export default StoreCreate;
