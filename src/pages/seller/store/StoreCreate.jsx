// =============================
// src/pages/seller/store/StoreCreate.jsx (Final - Modern, Çoklu Seçim Etiketli)
// =============================
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

  // Kategorileri yükle
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

  // Input değişimi
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, [key]: file }));
  };

  const toggleCategory = (id) => {
    setForm((prev) => {
      const selected = prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id];
      return { ...prev, categoryIds: selected };
    });
  };

  // Mağaza oluştur
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef7f7] to-white px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-10 border border-gray-100">
        <h2 className="text-4xl font-bold text-center text-[#003636] mb-10 tracking-tight">
          Mağaza Oluştur
        </h2>

        {message && (
          <div
            className={`mb-8 text-sm px-4 py-3 rounded-lg border text-center ${
              message.includes("oluşturuluyor")
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : message.includes("zorunlu") || message.includes("geçerli")
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-gray-50 border-gray-300 text-gray-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 text-gray-700">
          {/* Mağaza Adı */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Mağaza Adı *
            </label>
            <input
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="Mağaza adınızı girin"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003636]"
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Mağaza Açıklaması
            </label>
            <textarea
              name="storeDescription"
              value={form.storeDescription}
              onChange={handleChange}
              placeholder="Kısa bir açıklama ekleyin"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#003636]"
            />
          </div>

          {/* Dosya yükleme alanları */}
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

          {/* Kategoriler */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Kategoriler *
            </label>

            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = form.categoryIds.includes(cat.id);
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                        active
                          ? "bg-[#003636] text-white border-[#003636]"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Kategoriler yükleniyor veya mevcut değil.
              </p>
            )}

            {form.categoryIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.categoryIds.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200"
                    >
                      {cat?.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kaydet butonu */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60"
          >
            {submitting ? "İşleniyor..." : "Mağazayı Oluştur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreCreate;
