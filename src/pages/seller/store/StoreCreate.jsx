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
        const arr = Array.isArray(res) ? res : res?.items || [];
        const normalized = arr.map((c) => ({
          id: Number(c.id ?? c.Id),
          name: String(c.name ?? c.Name ?? ""),
        }));
        setCategories(normalized);
      } catch {
        setMessage("Kategoriler alınamadı.");
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

    if (!form.storeName.trim()) return setMessage("Mağaza adı zorunludur.");
    if (!form.logoFile) return setMessage("Logo zorunludur.");
    if (!form.categoryIds.length) return setMessage("En az bir kategori seçiniz.");
    if (form.logoFile && !form.logoFile.type.startsWith("image/"))
      return setMessage("Logo için geçerli bir görsel seçiniz.");
    if (form.bannerFile && !form.bannerFile.type.startsWith("image/"))
      return setMessage("Banner için geçerli bir görsel seçiniz.");

    try {
      setSubmitting(true);
      setMessage("Mağaza oluşturuluyor...");
      await createStore(form);
      navigate("/seller/store/update", { replace: true });
    } catch {
      setMessage("Mağaza oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f5f5] to-[#ffffff] px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-10 border border-gray-100">
        <h2 className="text-4xl font-bold text-center text-[#003636] mb-10 tracking-tight">
          Mağaza Oluştur
        </h2>

        {message && (
          <div className="mb-8 text-sm px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-center text-gray-700">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 text-gray-700"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">Mağaza Adı *</label>
            <input
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="Mağaza adınızı girin"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003636]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Mağaza Açıklaması</label>
            <textarea
              name="storeDescription"
              value={form.storeDescription}
              onChange={handleChange}
              placeholder="Kısa bir açıklama ekleyin"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#003636]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Logo (zorunlu)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "logoFile")}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#003636]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Banner (isteğe bağlı)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "bannerFile")}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#003636]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Kategoriler *</label>
            <select
              multiple
              value={form.categoryIds}
              onChange={handleCategoryChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003636]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Birden fazla kategori seçmek için <kbd>Ctrl</kbd> veya <kbd>Cmd</kbd> tuşunu basılı tutun.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60"
          >
            {submitting ? "İşleniyor..." : "Mağazayı Oluştur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreCreate;
