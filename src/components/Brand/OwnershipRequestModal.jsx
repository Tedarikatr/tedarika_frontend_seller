import { useState, useEffect } from "react";
import { X, Loader2, Send, Calendar, FileText } from "lucide-react";
import { requestBrandOwnership } from "@/api/brandservice";
import { BrandOwnershipType } from "@/constants/brandEnums";

export default function OwnershipRequestModal({ 
  isOpen, 
  onClose, 
  brandId, 
  brandName,
  onSuccess 
}) {
  const [ownershipType, setOwnershipType] = useState(0); // 0 = Owner, 1 = AuthorizedReseller
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Yetkili satıcı seçildiğinde varsayılan olarak 1 yıl sonrasını ayarla
  useEffect(() => {
    if (ownershipType === 1 && !expiryDate) {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setExpiryDate(nextYear.toISOString().split("T")[0]);
    }
  }, [ownershipType, expiryDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ExpiryDate girilmişse geçmişte olamaz
    if (expiryDate && new Date(expiryDate) < new Date()) {
      setError("Son kullanma tarihi geçmişte olamaz.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        brandId,
        ownershipType,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        notes: notes.trim() || null,
      };

      const result = await requestBrandOwnership(payload);
      
      // Başarılı işlem sonrası formu temizle
      setOwnershipType(0);
      setExpiryDate("");
      setNotes("");
      
      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Başvuru oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOwnershipType(0);
      setExpiryDate("");
      setNotes("");
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
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Marka Sahiplik Başvurusu</h2>
              <p className="text-sm text-emerald-100 truncate max-w-md">
                {brandName || "Marka"}
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
            {/* Sahiplik Tipi */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Sahiplik Tipi <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Owner */}
                <button
                  type="button"
                  onClick={() => {
                    setOwnershipType(0);
                    setExpiryDate(""); // Owner için expiryDate gerekmez
                    setError("");
                  }}
                  disabled={loading}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    ownershipType === 0
                      ? "border-emerald-500 bg-emerald-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        ownershipType === 0
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-gray-300"
                      }`}
                    >
                      {ownershipType === 0 && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-bold text-gray-900">
                      {BrandOwnershipType[0]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Marka sahibi olarak başvuru yapın
                  </p>
                </button>

                {/* Authorized Reseller */}
                <button
                  type="button"
                  onClick={() => {
                    setOwnershipType(1);
                    setError("");
                  }}
                  disabled={loading}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    ownershipType === 1
                      ? "border-emerald-500 bg-emerald-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        ownershipType === 1
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-gray-300"
                      }`}
                    >
                      {ownershipType === 1 && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-bold text-gray-900">
                      {BrandOwnershipType[1]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Yetkili satıcı olarak başvuru yapın
                  </p>
                </button>
              </div>
            </div>

            {/* Son Kullanma Tarihi (Sadece Yetkili Satıcı için, opsiyonel) */}
            {ownershipType === 1 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Son Kullanma Tarihi <span className="text-gray-500 text-xs">(Opsiyonel)</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => {
                      setExpiryDate(e.target.value);
                      setError("");
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-800 font-medium"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Yetkili satıcı sözleşmesinin sona ereceği tarih (isteğe bağlı)
                </p>
              </div>
            )}

            {/* Notlar */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Notlar <span className="text-gray-500 text-xs">(Opsiyonel, max 1000 karakter)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 1000) {
                    setNotes(value);
                    setError("");
                  }
                }}
                placeholder="Başvurunuz hakkında ek bilgiler..."
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-800 font-medium resize-none"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2 text-right">
                {notes.length}/1000 karakter
              </p>
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
                <strong>Not:</strong> Başvurunuz admin tarafından incelenecektir. 
                Bazı durumlarda başvurunuz otomatik olarak onaylanabilir.
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
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Başvuru Gönder
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
