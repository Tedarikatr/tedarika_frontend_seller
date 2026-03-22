import { Clock, CheckCircle, XCircle, Ban, Calendar, FileText } from "lucide-react";
import { getBrandOwnershipStatusDisplay, BrandOwnershipTypeTr } from "@/constants/brandEnums";

export default function OwnershipStatusSection({ ownerships }) {
  const getStatusIcon = (statusNum) => {
    switch (statusNum) {
      case 0: return <Clock className="w-5 h-5 text-amber-600" />;
      case 1: return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 2: return <XCircle className="w-5 h-5 text-red-600" />;
      case 3: return <Ban className="w-5 h-5 text-gray-600" />;
      case 4: return <Calendar className="w-5 h-5 text-orange-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    return type === 0 ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-purple-100 text-purple-800 border-purple-300";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (ownerships.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-12 text-center border-2 border-gray-200">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Henüz Başvuru Yok</h3>
        <p className="text-gray-600">
          Marka sahiplik başvurularınız burada görünecek.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ownerships.map((ownership) => (
        <div
          key={ownership.id}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-bold text-xl text-gray-900 mb-2">
                  {ownership.brandName || "Marka"}
                </h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Status Badge — Onay / Red / Beklemede ilgili renklerde */}
                  {(() => {
                    const disp = getBrandOwnershipStatusDisplay(ownership.status);
                    return (
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm ${disp.color}`}>
                        {getStatusIcon(disp.statusNum)}
                        {disp.label}
                      </span>
                    );
                  })()}
                  {/* Type Badge */}
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm ${getTypeColor(ownership.ownershipType)}`}>
                    {BrandOwnershipTypeTr[ownership.ownershipType] ?? "Bilinmeyen"}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Başvuru Tarihi */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Başvuru Tarihi
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(ownership.requestedAt)}
                </p>
              </div>

              {/* Onay Tarihi */}
              {ownership.approvedAt && (
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Onay Tarihi
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(ownership.approvedAt)}
                  </p>
                </div>
              )}

              {/* İptal Tarihi */}
              {ownership.revokedAt && (
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      İptal Tarihi
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(ownership.revokedAt)}
                  </p>
                </div>
              )}

              {/* Son Kullanma Tarihi */}
              {ownership.expiryDate && (
                <div
                  className={`bg-white rounded-xl p-4 border ${
                    isExpired(ownership.expiryDate)
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar
                      className={`w-4 h-4 ${
                        isExpired(ownership.expiryDate) ? "text-red-500" : "text-gray-500"
                      }`}
                    />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Son Kullanma Tarihi
                    </span>
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      isExpired(ownership.expiryDate)
                        ? "text-red-700"
                        : "text-gray-900"
                    }`}
                  >
                    {formatDate(ownership.expiryDate)}
                    {isExpired(ownership.expiryDate) && (
                      <span className="ml-2 text-xs font-bold text-red-600">
                        (Süresi Doldu)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Notlar */}
            {ownership.notes && (
              <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
                    Notlar
                  </span>
                </div>
                <p className="text-sm text-blue-900">{ownership.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
