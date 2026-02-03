// =============================
// MyStoreProductTable.jsx
// =============================
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Image as ImageIcon, TrendingUp, List, FileEdit, Package, DollarSign } from "lucide-react";
import ProductAttributesModal from "./ProductAttributesModal";
import { CURRENCY_CODES } from "@/constants/currencyCode";

/** prices dizisinden ilk fiyatı formatla */
const formatPrice = (prices) => {
  if (!prices?.length) return "—";
  const p = prices[0];
  const val = p?.unitPrice;
  const code = p?.currencyCode || "TRY";
  const sym = CURRENCY_CODES[code]?.symbol ?? code;
  return val != null ? `${Number(val).toLocaleString("tr-TR")} ${sym}` : "—";
};

const MyStoreProductTable = ({
  products,
  startIndex = 0,
  onManage,
  onProductIdMissing,
  selectedIds = new Set(),
  onSelectionChange,
  getStoreProductId = (p) => p.id ?? p.storeProductId,
}) => {
  const navigate = useNavigate();
  const [selectedProductForAttributes, setSelectedProductForAttributes] = useState(null);

  const toggleSelection = useCallback(
    (product) => {
      if (!onSelectionChange) return;
      const id = getStoreProductId(product);
      if (!id) return;
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onSelectionChange(next);
    },
    [onSelectionChange, getStoreProductId, selectedIds]
  );

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
        <table className="min-w-[900px] w-full">
          <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
            <tr>
              {onSelectionChange && (
                <th className="px-3 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <span className="sr-only">Seç</span>
                </th>
              )}
              <th className="px-3 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                #
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Ürün
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Fiyat
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Stok
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
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
              const storeId = getStoreProductId(product);
              const isSelected = storeId && selectedIds.has(storeId);

              return (
                <tr
                  key={product.id ?? storeId ?? index}
                  className={`hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 ${isSelected ? "bg-emerald-50/80" : ""}`}
                >
                  {onSelectionChange && (
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {storeId && (
                        <button
                          type="button"
                          onClick={() => toggleSelection(product)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-gray-300 hover:border-emerald-500 bg-white"
                          }`}
                          aria-label={isSelected ? "Seçimi kaldır" : "Seç"}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      )}
                    </td>
                  )}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 font-medium text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative group flex-shrink-0">
                        <img
                          src={cover}
                          alt={product.name || "Ürün görseli"}
                          className="w-11 h-11 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm line-clamp-2" title={product.name}>{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium max-w-[120px] truncate" title={formatPrice(product.prices)}>
                      <DollarSign size={12} className="text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{formatPrice(product.prices)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium">
                      <Package size={12} className="text-blue-600 flex-shrink-0" />
                      {product.stockQuantity != null ? product.stockQuantity : "—"}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center">
                    {product.isOnSale ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-100 border border-green-300 text-green-800 text-xs font-bold">
                        <TrendingUp className="w-3 h-3" />
                        Satışta
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold">
                        Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleEditRequest(product)}
                        className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors"
                        title="Düzenleme Talebi"
                      >
                        <FileEdit className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="hidden 2xl:inline">Düzenleme</span>
                      </button>
                      <button
                        onClick={() => setSelectedProductForAttributes(product)}
                        className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                        title="Özellikler"
                      >
                        <List className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="hidden 2xl:inline">Özellikler</span>
                      </button>
                      <button
                        onClick={() => onManage(product)}
                        className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                        title="Ürün Yönetimi"
                      >
                        <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="hidden 2xl:inline">Yönet</span>
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
          const itemNo = startIndex + index + 1;
          const cover =
            product.storeProductImagesUrls?.[0] ||
            product.storeProductImageUrl ||
            product.productImageUrls?.[0] ||
            product.imageUrl ||
            "/placeholder.png";
          const storeId = getStoreProductId(product);
          const isSelected = storeId && selectedIds.has(storeId);

          return (
            <div
              key={product.id ?? storeId ?? index}
              className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                isSelected ? "border-emerald-500 ring-2 ring-emerald-200" : "border-gray-200"
              }`}
            >
              {/* Header with Image and Status */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b-2 border-emerald-200">
                <div className="flex items-start gap-4">
                  {onSelectionChange && storeId && (
                    <button
                      type="button"
                      onClick={() => toggleSelection(product)}
                      className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-gray-300 hover:border-emerald-500 bg-white"
                      }`}
                      aria-label={isSelected ? "Seçimi kaldır" : "Seç"}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )}
                  <img
                    src={cover}
                    alt={product.name || "Ürün görseli"}
                    className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-500 font-medium">#{itemNo}</span>
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mt-0.5" title={product.name}>
                          {product.name}
                        </h3>
                      </div>
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
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium">
                        <DollarSign size={12} className="text-emerald-600" />
                        {formatPrice(product.prices)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium">
                        <Package size={12} className="text-blue-600" />
                        Stok: {product.stockQuantity != null ? product.stockQuantity : "—"}
                      </span>
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
