import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Info, CheckCircle2 } from "lucide-react";
import TedarikaLoader from "@/components/ui/TedarikaLoader";
import { getProductAttributes } from "@/api/sellerProductAttributeService";
import { useToast } from "@/contexts/ToastContext";

const ProductAttributesModal = ({ productId, productName, isOpen, onClose }) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && productId) {
      loadAttributes();
    } else {
      setAttributes([]);
    }
  }, [isOpen, productId]);

  const loadAttributes = async () => {
    setLoading(true);
    try {
      const data = await getProductAttributes(productId);
      setAttributes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Özellikler yüklenemedi:", err);
      toast.error(err?.message || "Özellikler yüklenirken hata oluştu.");
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold truncate">Ürün Özellikleri</h2>
              <p className="text-xs sm:text-sm text-emerald-100 truncate max-w-full">
                {productName || "Ürün"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Kapat"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <TedarikaLoader variant="compact" label="Özellikler yükleniyor..." />
            </div>
          ) : attributes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3 sm:mb-4">
                <Info className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-center text-sm sm:text-base px-2">
                Bu ürün için kayıtlı özellik bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {attributes.map((attrSet, idx) => (
                <div
                  key={attrSet.attributeSetId || idx}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl border-2 border-emerald-200 p-4 sm:p-5 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-emerald-800 text-sm uppercase tracking-wide">
                      Özellik Seti {idx + 1}
                    </h3>
                  </div>

                  {attrSet.values && Object.keys(attrSet.values).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(attrSet.values).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-white rounded-xl p-3 border border-emerald-200 shadow-sm"
                        >
                          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                            {key}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {value !== null && value !== undefined
                              ? String(value)
                              : "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Bu set için özellik değeri bulunmuyor.
                    </p>
                  )}

                  {(attrSet.createdAt || attrSet.updatedAt) && (
                    <div className="mt-4 pt-4 border-t border-emerald-200 text-xs text-gray-500">
                      {attrSet.createdAt && (
                        <div>
                          Oluşturulma:{" "}
                          {new Date(attrSet.createdAt).toLocaleString("tr-TR")}
                        </div>
                      )}
                      {attrSet.updatedAt && (
                        <div>
                          Güncellenme:{" "}
                          {new Date(attrSet.updatedAt).toLocaleString("tr-TR")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
          >
            Kapat
          </button>
        </div>
      </div>

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
  );

  return createPortal(modalContent, document.body);
};

export default ProductAttributesModal;
