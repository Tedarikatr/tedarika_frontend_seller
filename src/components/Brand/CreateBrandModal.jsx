import { useState } from "react";
import { X, Loader2, Award, Upload, Image as ImageIcon } from "lucide-react";
import { createBrand } from "@/api/brandservice";

export default function CreateBrandModal({ isOpen, onClose, onSuccess }) {
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Görsel boyutu 5MB'dan küçük olmalıdır.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Lütfen geçerli bir görsel dosyası seçin.");
        return;
      }
      setImage(file);
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!brandName.trim()) {
      setError("Marka adı zorunludur.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("brandName", brandName.trim());
      if (image) {
        formData.append("image", image);
      }

      const result = await createBrand(formData);
      
      // Başarılı işlem sonrası formu temizle
      setBrandName("");
      setImage(null);
      setImagePreview(null);
      
      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Marka oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setBrandName("");
      setImage(null);
      setImagePreview(null);
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Yeni Marka Oluştur</h2>
              <p className="text-sm text-emerald-100">
                Markanızı oluşturun ve admin onayı bekleyin
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors disabled:opacity-50"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Marka Adı */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Marka Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => {
                  setBrandName(e.target.value);
                  setError("");
                }}
                placeholder="Örn: Yeni Marka"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-800 font-medium"
                disabled={loading}
                required
              />
            </div>

            {/* Görsel Yükleme */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Marka Görseli <span className="text-gray-500 text-xs">(Opsiyonel)</span>
              </label>
              <div className="space-y-4">
                {/* Görsel Önizleme */}
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Önizleme"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Yükleme Butonu */}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {imagePreview ? (
                      <ImageIcon className="w-10 h-10 text-emerald-600 mb-2" />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    )}
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Görsel seçmek için tıklayın</span> veya sürükleyip bırakın
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Bilgi Notu */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Not:</strong> Oluşturduğunuz marka admin onayından sonra aktif olacaktır. 
                Marka oluşturulduktan sonra otomatik olarak marka sahibi olarak atanacaksınız.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !brandName.trim()}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  Marka Oluştur
                </>
              )}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
