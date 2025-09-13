// src/pages/seller/store/StoreUpdate.jsx
import { useEffect, useState } from "react";
import {
  getMyStore,
  updateStore,
  getAllCategories,
} from "@/api/sellerStoreService";
import { Store } from "lucide-react";

const normalizeCats = (catsRes) => {
  const arr = Array.isArray(catsRes) ? catsRes : catsRes?.items || [];
  // {id, name} / {Id, Name} ikisine de uyum
  return arr.map((c) => ({
    id: Number(c.id ?? c.Id),
    name: String(c.name ?? c.Name ?? ""),
  }));
};

const toNumberArray = (val) => {
  if (!val) return [];
  // backend bazen [1,2] bazen ["1","2"] dönebilir
  try {
    return (Array.isArray(val) ? val : []).map((x) => Number(x)).filter((x) => !Number.isNaN(x));
  } catch {
    return [];
  }
};

const StoreUpdate = () => {
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // (opsiyonel) mevcut logo/banner URL önizleme için:
  const [currentLogoUrl, setCurrentLogoUrl] = useState("");
  const [currentBannerUrl, setCurrentBannerUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [store, catsRes] = await Promise.all([getMyStore(), getAllCategories()]);

        setCategories(normalizeCats(catsRes));

        setForm({
          storeName: store?.storeName || "",
          storeDescription: store?.storeDescription || "",
          logoFile: null,
          bannerFile: null,
          // backend’den gelen categoryIds’i normalize et
          categoryIds: toNumberArray(store?.categoryIds),
        });

        // (opsiyonel) mevcut resimler
        setCurrentLogoUrl(store?.logoUrl ?? store?.LogoUrl ?? "");
        setCurrentBannerUrl(store?.bannerImageUrl ?? store?.BannerImageUrl ?? "");
      } catch {
        setMessage("❌ Mağaza veya kategori bilgileri alınamadı.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, [type]: file }));
  };

  const toggleCategory = (catIdRaw) => {
    const catId = Number(catIdRaw);
    setForm((prev) => {
      const has = prev.categoryIds.includes(catId);
      const updated = has
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId];
      return { ...prev, categoryIds: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    if (submitting) return;

    setMessage("");
    // basit validasyon
    if (!form.storeName.trim()) {
      setMessage("❌ Mağaza adı zorunludur.");
      return;
    }
    if (!form.categoryIds.length) {
      setMessage("❌ En az bir kategori seçmelisiniz.");
      return;
    }

    try {
      setSubmitting(true);
      await updateStore(form);
      setMessage("✅ Mağaza başarıyla güncellendi.");
      // yeni dosya yüklendiyse önizlemeyi resetlemek isteyebilirsin:
      if (form.logoFile) setCurrentLogoUrl("");
      if (form.bannerFile) setCurrentBannerUrl("");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("❌ Güncelleme sırasında bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 animate-pulse">
        Mağaza bilgileri yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafb] to-[#e6f3f2] py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-2xl p-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-[#003636] text-white p-3 rounded-full">
            <Store size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#003636]">Mağaza Bilgilerini Güncelle</h2>
            <p className="text-sm text-gray-600 mt-1">
              Mağazanıza ait bilgileri güncelleyin ve görünürlüğünüzü artırın.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            placeholder="Mağaza Adı"
            className="p-3 border rounded-md"
          />

          <textarea
            name="storeDescription"
            value={form.storeDescription}
            onChange={handleChange}
            placeholder="Açıklama"
            className="p-3 border rounded-md col-span-full"
          />

          {/* Logo */}
          <div className="col-span-full">
            <label className="text-sm font-medium text-gray-700 block mb-2">Logo</label>
            {currentLogoUrl && !form.logoFile && (
              <img
                src={currentLogoUrl}
                alt="Logo"
                className="h-16 mb-2 rounded border object-contain bg-gray-50"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "logoFile")}
              className="text-sm"
            />
            {form.logoFile && (
              <span className="text-sm text-gray-600 mt-1 block">
                {form.logoFile.name}
              </span>
            )}
          </div>

          {/* Banner */}
          <div className="col-span-full">
            <label className="text-sm font-medium text-gray-700 block mb-2">Banner</label>
            {currentBannerUrl && !form.bannerFile && (
              <img
                src={currentBannerUrl}
                alt="Banner"
                className="h-24 mb-2 rounded border object-cover bg-gray-50"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "bannerFile")}
              className="text-sm"
            />
            {form.bannerFile && (
              <span className="text-sm text-gray-600 mt-1 block">
                {form.bannerFile.name}
              </span>
            )}
          </div>

          {/* Kategoriler */}
          <div className="col-span-full mt-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Kategoriler</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const selected = form.categoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition cursor-pointer ${
                      selected
                        ? "bg-green-100 border-green-500 text-green-800 font-semibold"
                        : "bg-white border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCategory(cat.id)}
                      className="accent-green-600"
                    />
                    {cat.name}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="col-span-full mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#003636] to-[#005e5e] text-white font-semibold py-3 rounded-lg shadow-lg hover:brightness-110 transition disabled:opacity-60"
            >
              {submitting ? "Güncelleniyor..." : "Güncelle"}
          </button>
          </div>

          {message && (
            <div
              className={`col-span-full text-center mt-3 text-sm font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StoreUpdate;
