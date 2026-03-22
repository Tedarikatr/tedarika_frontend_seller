import { Award, CheckCircle, Clock, Calendar, FileText, XCircle, Ban } from "lucide-react";
import { getBrandOwnershipStatusDisplay, BrandOwnershipTypeTr } from "@/constants/brandEnums";

export default function OwnedBrandsSection({ ownedBrands }) {
  const getStatusIcon = (statusNum) => {
    switch (statusNum) {
      case 0: return <Clock className="w-4 h-4 text-amber-600" />;
      case 1: return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 2: return <XCircle className="w-4 h-4 text-red-600" />;
      case 3: return <Ban className="w-4 h-4 text-gray-600" />;
      case 4: return <Calendar className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    const typeNum = typeof type === "number" ? type : (type === "Owner" ? 0 : 1);
    return typeNum === 0 ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-purple-100 text-purple-800 border-purple-300";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div>
      {ownedBrands.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-12 text-center border-2 border-gray-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Henüz Marka Yok</h3>
          <p className="text-gray-600">
            Sahip olduğunuz markalar burada görünecek.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedBrands.map((b) => {
            const { statusNum, label: statusLabel, color: statusColor, colorCard } = getBrandOwnershipStatusDisplay(b.status);
            const typeLabel = BrandOwnershipTypeTr[b.ownershipType] ?? (b.ownershipType === 0 ? "Sahip" : "Yetkili Satıcı");

            return (
              <div
                key={b.id}
                className={`bg-gradient-to-br rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${colorCard}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0 ${
                    statusNum === 1 ? "from-green-500 to-emerald-600" : statusNum === 0 ? "from-amber-500 to-orange-500" : statusNum === 2 ? "from-red-500 to-red-600" : "from-gray-400 to-gray-500"
                  }`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{b.brandName}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 text-xs font-bold ${statusColor}`}>
                        {getStatusIcon(statusNum)}
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">Tür:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 text-xs font-bold ${getTypeColor(b.ownershipType)}`}>
                      {typeLabel}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 px-3 py-2 bg-white rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">ID bilgisi</span>
                    <div className="text-xs font-mono text-gray-700 space-y-0.5">
                      <p title={b.brandId}>Marka ID: {b.brandId ? String(b.brandId).slice(0, 8) + "…" : "—"}</p>
                      <p title={b.id}>Kayıt ID: {b.id ? String(b.id).slice(0, 8) + "…" : "—"}</p>
                    </div>
                  </div>
                  
                  {b.requestedAt && (
                    <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 font-medium">Başvuru:</span>
                      <span className="text-xs font-medium text-gray-700">
                        {formatDate(b.requestedAt)}
                      </span>
                    </div>
                  )}
                  
                  {b.approvedAt && (
                    <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 font-medium">Onay:</span>
                      <span className="text-xs font-medium text-gray-700">
                        {formatDate(b.approvedAt)}
                      </span>
                    </div>
                  )}
                  
                  {b.expiryDate && (
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                      isExpired(b.expiryDate)
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-gray-200"
                    }`}>
                      <span className="text-sm text-gray-600 font-medium">Son Kullanma:</span>
                      <span className={`text-xs font-medium ${
                        isExpired(b.expiryDate) ? "text-red-700" : "text-gray-700"
                      }`}>
                        {formatDate(b.expiryDate)}
                        {isExpired(b.expiryDate) && (
                          <span className="ml-1 text-red-600 font-bold">(Doldu)</span>
                        )}
                      </span>
                    </div>
                  )}
                  
                  {b.notes && (
                    <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-1 mb-1">
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-800">Notlar</span>
                      </div>
                      <p className="text-xs text-blue-900 line-clamp-2">{b.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
