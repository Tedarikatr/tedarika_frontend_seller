/**
 * Ürün yükleme sırasında gösterilen tam ekran modal
 * - Arka plan blur
 * - "Lütfen bu sayfayı kapatmayınız" uyarısı
 * - Process bar (ilerleme çubuğu)
 * - Hatalar için açılır menü
 */
import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const ProductUploadModal = ({
  isOpen,
  progress = 0,
  status = "uploading", // 'uploading' | 'success' | 'error'
  uploadType = "",
  errors = [],
  onClose,
}) => {
  const [errorsExpanded, setErrorsExpanded] = useState(errors.length > 0);
  useEffect(() => {
    if (errors?.length > 0) setErrorsExpanded(true);
  }, [errors?.length]);

  const UPLOAD_TYPE_LABELS = {
    excel: "Excel",
    json: "JSON",
    xml: "XML Dosya",
    "xml-url": "XML URL",
    manual: "Manuel",
  };
  const typeLabel = UPLOAD_TYPE_LABELS[uploadType] || "Ürün";

  if (!isOpen) return null;

  const isComplete = status === "success" || status === "error";
  const hasErrors = errors && errors.length > 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Blur arka plan */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" aria-hidden="true" />

      {/* Modal içerik */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-gray-200 animate-[fadeIn_0.2s_ease-out]">
        {/* Header - Uyarı */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/25 flex items-center justify-center">
            <Loader2
              className={`w-8 h-8 text-white ${!isComplete ? "animate-spin" : ""}`}
            />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {isComplete
              ? status === "success"
                ? "Yükleme Tamamlandı"
                : "Yükleme Başarısız"
              : `${typeLabel} Yükleniyor`}
          </h2>
          <p className="text-amber-100 text-sm font-medium">
            Lütfen bu sayfayı kapatmayınız
          </p>
        </div>

        {/* Process Bar */}
        <div className="px-6 py-5">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>İlerleme</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  status === "error"
                    ? "bg-red-500"
                    : status === "success"
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>

          {/* Hatalar - Açılır menü */}
          {hasErrors && (
            <div className="mt-4 border border-red-200 rounded-xl overflow-hidden bg-red-50">
              <button
                type="button"
                onClick={() => setErrorsExpanded(!errorsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-red-100/50 transition-colors"
              >
                <span className="flex items-center gap-2 font-semibold text-red-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  Hatalar ({errors.length})
                </span>
                {errorsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-red-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-red-600" />
                )}
              </button>
              {errorsExpanded && (
                <div className="max-h-48 overflow-y-auto border-t border-red-200">
                  <ul className="p-3 space-y-2">
                    {errors.map((err, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-red-800 bg-white/60 rounded-lg px-3 py-2 border border-red-100"
                      >
                        {typeof err === "string" ? err : err?.message || JSON.stringify(err)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tamamlandığında Kapat butonu */}
          {isComplete && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-6 py-3 rounded-xl font-semibold bg-gray-800 text-white hover:bg-gray-900 transition-colors"
              >
                Kapat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductUploadModal;
