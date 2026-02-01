import React, { useState } from "react";
import { CheckCircle, Plus, Tag, Package, List } from "lucide-react";
import ProductAttributesModal from "./ProductAttributesModal";

const ProductDatabaseTable = ({
  products = [],
  onAdd,
  addingId,
  addedIds = [],
  startIndex = 0,
}) => {
  const [selectedProductForAttributes, setSelectedProductForAttributes] = useState(null);
  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden xl:block overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
              #
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
              EAN
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
              SKU
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
                  {startIndex + index + 1}
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
                    {prod.ean ?? prod.barcode ?? "-"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
                    {prod.sku ?? "-"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedProductForAttributes(prod)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <List className="w-4 h-4" />
                      Özellikler
                    </button>
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
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {/* Tablet & Mobile Cards */}
      <div className="xl:hidden space-y-4 p-2 sm:p-4">
        {products.map((prod, index) => {
          const productId = String(prod.id ?? prod.productId);
          const isAdded = addedIds.includes(productId);
          const isAdding = String(addingId) === productId;

          return (
            <div
              key={productId}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b-2 border-emerald-200">
                <div className="flex items-start gap-3">
                  <Package className="w-10 h-10 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2">
                      {prod.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {prod.categoryName}
                        {prod.categorySubName && ` / ${prod.categorySubName}`}
                      </span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {prod.brand || "-"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded">
                        EAN: {prod.ean ?? prod.barcode ?? "-"}
                      </span>
                      <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded">
                        SKU: {prod.sku ?? "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setSelectedProductForAttributes(prod)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:shadow-lg transition-all"
                >
                  <List className="w-4 h-4" />
                  Özellikler
                </button>
                {isAdded ? (
                  <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-800 text-sm font-bold">
                    <CheckCircle className="w-4 h-4" />
                    Mağazada Var
                  </span>
                ) : (
                  <button
                    onClick={() => onAdd(productId)}
                    disabled={isAdding}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isAdding
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {isAdding ? "Ekleniyor..." : "Mağazama Ekle"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Attributes Modal */}
      {selectedProductForAttributes && (
        <ProductAttributesModal
          productId={selectedProductForAttributes.id || selectedProductForAttributes.productId}
          productName={selectedProductForAttributes.name}
          isOpen={!!selectedProductForAttributes}
          onClose={() => setSelectedProductForAttributes(null)}
        />
      )}
    </div>
  );
};

export default ProductDatabaseTable;
