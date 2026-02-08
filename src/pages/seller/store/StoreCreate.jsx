import { useState, useEffect } from "react";
import { createStore, getAllCategories } from "@/api/sellerStoreService";
import { refreshToken } from "@/api/sellerAuthService";
import { useNavigate } from "react-router-dom";
import { Store, Upload, Image as ImageIcon, X, CheckCircle, Loader2, Sparkles, Award } from "lucide-react";

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
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
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
    
    // Önizleme oluştur
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (key === "logoFile") {
          setLogoPreview(reader.result);
        } else if (key === "bannerFile") {
          setBannerPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (key === "logoFile") {
        setLogoPreview(null);
      } else if (key === "bannerFile") {
        setBannerPreview(null);
      }
    }
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

      // Token yenile (mağaza oluşturulduktan sonra)
      try {
        const token = localStorage.getItem("sellerToken");
        if (token) {
          const refreshed = await refreshToken({ token });
          if (refreshed?.token) {
            localStorage.setItem("sellerToken", refreshed.token);
            const features = refreshed?.features ?? {};
            if (features.subscriptionActive !== undefined)
              localStorage.setItem("sellerSubscriptionActive", String(features.subscriptionActive));
            if (features.isthesystemactive !== undefined)
              localStorage.setItem("sellerSystemActive", String(features.isthesystemactive));
          }
        }
      } catch {
        /* Token yenileme başarısız - sessizce devam et */
      }

      navigate("/seller/profile#store", { replace: true });
    } catch (err) {
      setMessage(err?.message || "Mağaza oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Header */}
        <header className="mb-6 sm:mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-center overflow-hidden">
          {/* Dekoratif Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl hidden sm:block"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl hidden sm:block"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
                <Store className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Mağaza Oluştur
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse hidden sm:block" />
            </div>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-medium px-2">
              Platformda ürün yayınlamak için mağazanızı oluşturun
            </p>
          </div>
        </header>

        {/* Form Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-gray-200 p-4 sm:p-6 lg:p-8">
          {message && (
            <div
              className={`mb-4 sm:mb-6 text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 text-center font-medium ${
                message.includes("oluşturuluyor")
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : message.includes("zorunlu") || message.includes("geçerli")
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-gray-50 border-gray-300 text-gray-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Mağaza Adı */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                Mağaza Adı <span className="text-red-500">*</span>
              </label>
              <input
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                placeholder="Örn: Moda Dünyası"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-800 font-medium"
                required
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                Mağaza Açıklaması
              </label>
              <textarea
                name="storeDescription"
                value={form.storeDescription}
                onChange={handleChange}
                placeholder="Mağazanız hakkında kısa bir açıklama yazın..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-800 font-medium resize-none"
              />
            </div>

            {/* Logo Yükleme */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <label className="block text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Mağaza Logosu <span className="text-red-500 text-xs sm:text-sm">*</span>
              </label>

              {logoPreview && (
                <div className="mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo Önizleme"
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg sm:rounded-xl border-2 border-white object-cover shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, logoFile: null }));
                        setLogoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">Logo Önizleme</p>
                    <p className="text-xs truncate">{form.logoFile?.name}</p>
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logoFile")}
                  className="hidden"
                  id="logoFile"
                  required
                />
                <label
                  htmlFor="logoFile"
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-dashed border-blue-300 rounded-lg sm:rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-700 text-sm sm:text-base text-center">
                    {form.logoFile ? (form.logoFile.name.length > 20 ? form.logoFile.name.substring(0, 20) + '...' : form.logoFile.name) : "Logo Dosyası Seç"}
                  </span>
                </label>
              </div>
            </div>

            {/* Banner Yükleme */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <label className="block text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 flex-wrap">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Mağaza Banner Görseli
                <span className="text-gray-500 text-xs font-normal">(Opsiyonel)</span>
              </label>

              {bannerPreview && (
                <div className="mb-3 sm:mb-4">
                  <div className="relative">
                    <img
                      src={bannerPreview}
                      alt="Banner Önizleme"
                      className="w-full h-32 sm:h-40 rounded-lg sm:rounded-xl border-2 border-white object-cover shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, bannerFile: null }));
                        setBannerPreview(null);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 truncate">{form.bannerFile?.name}</p>
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "bannerFile")}
                  className="hidden"
                  id="bannerFile"
                />
                <label
                  htmlFor="bannerFile"
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-dashed border-purple-300 rounded-lg sm:rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-700 text-sm sm:text-base text-center">
                    {form.bannerFile ? (form.bannerFile.name.length > 20 ? form.bannerFile.name.substring(0, 20) + '...' : form.bannerFile.name) : "Banner Dosyası Seç"}
                  </span>
                </label>
              </div>
            </div>

            {/* Kategoriler */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Kategoriler <span className="text-red-500">*</span>
              </label>

              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {categories.map((cat) => {
                    const active = form.categoryIds.includes(cat.id);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2 transition-all duration-300 ${
                          active
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg scale-105"
                            : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  Kategoriler yükleniyor veya mevcut değil.
                </p>
              )}

              {form.categoryIds.length > 0 && (
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Seçilenler:
                  </span>
                  {form.categoryIds.map((id) => {
                    const cat = categories.find((c) => c.id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-200 font-bold"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {cat?.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Kaydet Butonu */}
            <div className="pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={submitting || !form.storeName.trim() || !form.logoFile || form.categoryIds.length === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="hidden sm:inline">Mağaza Oluşturuluyor...</span>
                    <span className="sm:hidden">Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    Mağazayı Oluştur
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoreCreate;
