import { Award, Send, CheckCircle, Clock, XCircle, Ban, Calendar } from "lucide-react";
import { getBrandOwnershipStatusDisplay, BrandOwnershipTypeTr } from "@/constants/brandEnums";

export default function BrandCard({ brand, ownership, sending, onRequest }) {
  const getStatusIcon = (statusNum) => {
    switch (statusNum) {
      case 0: return <Clock className="w-4 h-4" />;
      case 1: return <CheckCircle className="w-4 h-4" />;
      case 2: return <XCircle className="w-4 h-4" />;
      case 3: return <Ban className="w-4 h-4" />;
      case 4: return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    return type === "Owner" || type === 0
      ? "bg-blue-100 text-blue-800 border-blue-300"
      : "bg-purple-100 text-purple-800 border-purple-300";
  };

  const statusNum = ownership?.statusNum !== undefined ? ownership.statusNum : (typeof ownership?.status === "number" ? ownership.status : (ownership?.status === "Approved" ? 1 : 0));
  const statusDisplay = getBrandOwnershipStatusDisplay(statusNum);
  const isApproved = ownership && statusNum === 1;
  const hasRequest = ownership !== null && ownership !== undefined;
  const typeLabel = ownership && (ownership.ownershipType === 0 || ownership.type === "Owner") ? BrandOwnershipTypeTr[0] : (ownership ? BrandOwnershipTypeTr[1] : null);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
            {brand.imageUrl ? (
              <img src={brand.imageUrl} alt={brand.name} className="w-full h-full object-contain" />
            ) : (
              <Award className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-xl text-gray-900 mb-3">{brand.name}</h4>
            {ownership ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600 font-medium">Tür:</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border-2 text-xs font-bold ${getTypeColor(ownership.type)}`}>
                    {typeLabel ?? ownership.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600 font-medium">Durum:</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border-2 text-xs font-bold ${statusDisplay.color}`}>
                    {getStatusIcon(statusNum)}
                    {statusDisplay.label}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Henüz başvuru yapılmamış.</p>
            )}
          </div>
        </div>

        <button
          onClick={() => onRequest(brand.id, brand.name)}
          disabled={sending || isApproved}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            isApproved
              ? "bg-gradient-to-r from-green-300 to-green-400 text-green-800 cursor-not-allowed"
              : hasRequest
              ? "bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl hover:scale-105"
          }`}
        >
          {isApproved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Onaylandı
            </>
          ) : hasRequest ? (
            <>
              <Clock className="w-4 h-4" />
              Beklemede
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Başvuru Yap
            </>
          )}
        </button>
      </div>
    </div>
  );
}
