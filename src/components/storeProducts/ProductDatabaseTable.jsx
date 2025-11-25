import React from "react";
import { CheckCircle, Plus, Tag, Package, Hash } from "lucide-react";

const ProductDatabaseTable = ({ products = [], onAdd, addingId, addedIds = [] }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Ürün Adı
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Marka
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Barkod
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
              İşlem
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {products.map((prod, index) => {
            const productId = String(prod.id ?? prod.productId);
            const isAdded = addedIds.includes(productId);
            const isAdding = String(addingId) === productId;

            return (
              <tr 
                key={productId} 
                className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">{prod.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-gray-900">{prod.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{prod.categoryName}</div>
                    {prod.categorySubName && (
                      <div className="text-xs text-gray-500 mt-1">{prod.categorySubName}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{prod.brand}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
                    {prod.barcode}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {isAdded ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-800 text-sm font-bold shadow-sm">
                      <CheckCircle className="w-4 h-4" />
                      Mağazada Var
                    </span>
                  ) : (
                    <button
                      onClick={() => onAdd(productId)}
                      disabled={isAdding}
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                        isAdding
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      {isAdding ? "Ekleniyor..." : "Mağazama Ekle"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDatabaseTable;
