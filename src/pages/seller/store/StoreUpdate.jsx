// src/pages/seller/store/StoreUpdate.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyStore,
  updateStore,
  getAllCategories,
} from "@/api/sellerStoreService";
import { isStoreNotFoundError, STORE_CREATE_PATH } from "@/utils/storeNotFound";
import { Store, Sparkles, Upload, Image as ImageIcon, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

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
  const navigate = useNavigate();
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
      } catch (err) {
        if (isStoreNotFoundError(err)) {
          toast.error(err.message || "Mağaza bulunamadı. Önce mağaza oluşturmanız gerekiyor.");
          navigate(STORE_CREATE_PATH);
          return;
        }
        setMessage("❌ Mağaza veya kategori bilgileri alınamadı.");
      }
    };
    fetchData();
  }, [navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Header */}
        <motion.div 
          className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8 overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl hidden sm:block" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl hidden sm:block" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <motion.div 
                className="bg-white/20 backdrop-blur-sm text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Store size={24} className="sm:w-8 sm:h-8" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span>Mağaza Bilgilerini Güncelle</span>
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse flex-shrink-0" />
                </h1>
                <p className="text-emerald-50 text-sm sm:text-base lg:text-lg">
                  Mağazanızı daha çekici hale getirin ve müşterilerinizle güçlü bir bağ kurun
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">24/7</div>
                <div className="text-xs sm:text-sm text-emerald-100">Görünürlük</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">∞</div>
                <div className="text-xs sm:text-sm text-emerald-100">Potansiyel Müşteri</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">%100</div>
                <div className="text-xs sm:text-sm text-emerald-100">Profesyonel</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          className="bg-white border-2 border-gray-200 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Store Name & Description */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Store className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  Mağaza Adı *
                </label>
                <input
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  placeholder="Mağazanızın adını girin"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  Mağaza Açıklaması
                </label>
                <textarea
                  name="storeDescription"
                  value={form.storeDescription}
                  onChange={handleChange}
                  placeholder="Mağazanızı tanıtın, müşterilerinize kendinizi anlatan bir metin yazın..."
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Logo */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <label className="block text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Mağaza Logosu
              </label>
              
              {currentLogoUrl && !form.logoFile && (
                <div className="mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4">
                  <img
                    src={currentLogoUrl}
                    alt="Mevcut Logo"
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg sm:rounded-xl border-2 border-white object-cover shadow-md flex-shrink-0"
                  />
                  <div className="text-xs sm:text-sm text-gray-600 min-w-0 flex-1">
                    <p className="font-semibold">Mevcut Logo</p>
                    <p className="text-xs">Yeni bir dosya seçerek değiştirebilirsiniz</p>
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
                />
                <label
                  htmlFor="logoFile"
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-dashed border-blue-300 rounded-lg sm:rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-700 text-sm sm:text-base text-center truncate">
                    {form.logoFile ? (form.logoFile.name.length > 20 ? form.logoFile.name.substring(0, 20) + '...' : form.logoFile.name) : "Logo Dosyası Seç"}
                  </span>
                </label>
              </div>
              
              {form.logoFile && (
                <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-green-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Yeni logo yüklenecek: {form.logoFile.name}</span>
                </div>
              )}
            </div>

            {/* Banner */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <label className="block text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Mağaza Banner Görseli
              </label>
              
              {currentBannerUrl && !form.bannerFile && (
                <div className="mb-3 sm:mb-4">
                  <img
                    src={currentBannerUrl}
                    alt="Mevcut Banner"
                    className="w-full h-24 sm:h-32 rounded-lg sm:rounded-xl border-2 border-white object-cover shadow-md"
                  />
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">Mevcut banner görseliniz</p>
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
                  <span className="font-semibold text-gray-700 text-sm sm:text-base text-center truncate">
                    {form.bannerFile ? (form.bannerFile.name.length > 20 ? form.bannerFile.name.substring(0, 20) + '...' : form.bannerFile.name) : "Banner Dosyası Seç"}
                  </span>
                </label>
              </div>
              
              {form.bannerFile && (
                <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-green-600">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Yeni banner yüklenecek: {form.bannerFile.name}</span>
                </div>
              )}
            </div>

            {/* Kategoriler */}
            <div>
              <label className="block text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                Mağaza Kategorileri *
              </label>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Mağazanızın faaliyet gösterdiği kategorileri seçin</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {categories.map((cat) => {
                const selected = form.categoryIds.includes(cat.id);
                return (
                  <motion.label
                    key={cat.id}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                      selected
                        ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-500 text-emerald-800 font-bold shadow-md"
                        : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-sm"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-emerald-600 cursor-pointer flex-shrink-0"
                    />
                    <span className={`${selected ? "text-emerald-900" : "text-gray-700"} truncate flex-1`}>
                      {cat.name}
                    </span>
                    {selected && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 ml-auto flex-shrink-0" />}
                  </motion.label>
                );
              })}
            </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6">
              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-sm sm:text-base lg:text-lg"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Güncelleniyor...</span>
                    <span className="sm:hidden">Yükleniyor...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Mağazayı Güncelle
                  </span>
                )}
              </motion.button>
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-center font-semibold text-xs sm:text-sm ${
                  message.includes("✅")
                    ? "bg-green-100 text-green-800 border-2 border-green-300"
                    : "bg-red-100 text-red-800 border-2 border-red-300"
                }`}
              >
                {message}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreUpdate;
