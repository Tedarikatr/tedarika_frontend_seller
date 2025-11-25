import { Award, Send, CheckCircle, Clock } from "lucide-react";

export default function BrandCard({ brand, ownership, sending, onRequest }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-xl text-gray-900 mb-2">{brand.name}</h4>
            {ownership ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Tür:</span>
                  <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                    {ownership.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Durum:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                    <Clock className="w-3 h-3" />
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
          onClick={() => onRequest(brand.id)}
          disabled={sending || ownership}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            ownership
              ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl hover:scale-105"
          }`}
        >
          {ownership ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Başvuru Mevcut
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
