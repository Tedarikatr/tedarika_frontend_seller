import { Award, Send, CheckCircle, Clock, XCircle, Ban, Calendar } from "lucide-react";
import { BrandOwnershipStatus } from "@/constants/brandEnums";

export default function BrandCard({ brand, ownership, sending, onRequest }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 0: // Pending
        return <Clock className="w-4 h-4" />;
      case 1: // Approved
        return <CheckCircle className="w-4 h-4" />;
      case 2: // Rejected
        return <XCircle className="w-4 h-4" />;
      case 3: // Revoked
        return <Ban className="w-4 h-4" />;
      case 4: // Expired
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: // Pending
        return "bg-amber-100 text-amber-800 border-amber-300";
      case 1: // Approved
        return "bg-green-100 text-green-800 border-green-300";
      case 2: // Rejected
        return "bg-red-100 text-red-800 border-red-300";
      case 3: // Revoked
        return "bg-gray-100 text-gray-800 border-gray-300";
      case 4: // Expired
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeColor = (type) => {
    return type === "Owner" || type === 0
      ? "bg-blue-100 text-blue-800 border-blue-300"
      : "bg-purple-100 text-purple-800 border-purple-300";
  };

  // Ownership varsa ve status Approved ise başvuru yapılamaz
  const statusNum = ownership?.statusNum !== undefined ? ownership.statusNum : 
    (typeof ownership?.status === "number" ? ownership.status : 
    (ownership?.status === "Approved" ? 1 : 0));
  const isApproved = ownership && statusNum === 1;
  const hasRequest = ownership !== null && ownership !== undefined;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-xl text-gray-900 mb-3">{brand.name}</h4>
            {ownership ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600 font-medium">Tür:</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border-2 text-xs font-bold ${getTypeColor(ownership.type)}`}>
                    {ownership.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600 font-medium">Durum:</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border-2 text-xs font-bold ${getStatusColor(statusNum)}`}>
                    {getStatusIcon(statusNum)}
                    {ownership.status}
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
              ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed"
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
