// =============================
// MyStoreProductTable.jsx
// =============================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Image as ImageIcon, TrendingUp, List, FileEdit } from "lucide-react";
import ProductAttributesModal from "./ProductAttributesModal";

const MyStoreProductTable = ({ products, onManage, onProductIdMissing }) => {
  const navigate = useNavigate();
  const [selectedProductForAttributes, setSelectedProductForAttributes] = useState(null);

  const handleEditRequest = (product) => {
    const productId = product.productId ?? product.id;
    if (!productId) {
      onProductIdMissing?.(product);
      return;
    }
    navigate(`/seller/products/edit-request/${productId}`);
  };
  if (!products?.length) {
    return (
      <div className="p-10 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium shadow-sm">
          Mağazanıza ait ürün bulunmuyor.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Ürün
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                İşlem
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product, index) => {
              const cover =
                product.storeProductImagesUrls?.[0] ||
                product.storeProductImageUrl ||
                product.productImageUrls?.[0] ||
                product.imageUrl ||
                "/placeholder.png";

              return (
                <tr
                  key={product.id}
                  className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <img
                          src={cover}
                          alt={product.name || "Ürün görseli"}
                          className="w-12 h-12 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {product.isOnSale ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-800 text-xs font-bold shadow-sm">
                        <TrendingUp className="w-3 h-3" />
                        Satışta
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 text-amber-800 text-xs font-bold shadow-sm">
                        Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleEditRequest(product)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <FileEdit className="w-4 h-4" />
                        Düzenleme Talebi
                      </button>
                      <button
                        onClick={() => setSelectedProductForAttributes(product)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <List className="w-4 h-4" />
                        Özellikler
                      </button>
                      <button
                        onClick={() => onManage(product)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <Settings className="w-4 h-4" />
                        Yönet
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tablet & Mobile Cards */}
      <div className="xl:hidden space-y-4 p-4">
        {products.map((product, index) => {
          const cover =
            product.storeProductImagesUrls?.[0] ||
            product.storeProductImageUrl ||
            product.productImageUrls?.[0] ||
            product.imageUrl ||
            "/placeholder.png";

          return (
            <div
              key={product.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header with Image and Status */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b-2 border-emerald-200">
                <div className="flex items-start gap-4">
                  <img
                    src={cover}
                    alt={product.name || "Ürün görseli"}
                    className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                        {product.name}
                      </h3>
                      {product.isOnSale ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-800 text-xs font-bold shadow-sm whitespace-nowrap">
                          <TrendingUp className="w-3 h-3" />
                          Satışta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 text-xs font-bold shadow-sm whitespace-nowrap">
                          Pasif
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 space-y-2">
                <button
                  type="button"
                  onClick={() => handleEditRequest(product)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <FileEdit className="w-4 h-4" />
                  Düzenleme Talebi Gönder
                </button>
                <button
                  onClick={() => setSelectedProductForAttributes(product)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <List className="w-4 h-4" />
                  Özellikler
                </button>
                <button
                  onClick={() => onManage(product)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Settings className="w-4 h-4" />
                  Ürün Yönetimi
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attributes Modal */}
      {selectedProductForAttributes && (
        <ProductAttributesModal
          productId={selectedProductForAttributes.id || selectedProductForAttributes.storeProductId}
          productName={selectedProductForAttributes.name}
          isOpen={!!selectedProductForAttributes}
          onClose={() => setSelectedProductForAttributes(null)}
        />
      )}
    </div>
  );
};

export default MyStoreProductTable;
