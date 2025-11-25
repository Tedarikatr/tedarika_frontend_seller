import { Award, CheckCircle, Tag } from "lucide-react";

export default function OwnedBrandsSection({ ownedBrands }) {
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
          {ownedBrands.map((b) => (
            <div
              key={b.id}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-1">{b.brandName}</h4>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Aktif</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Tür:</span>
                  <span className="text-sm font-bold text-gray-900">{b.ownershipType}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Durum:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-200 text-green-800 text-xs font-bold">
                    <CheckCircle className="w-3 h-3" />
                    {b.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
