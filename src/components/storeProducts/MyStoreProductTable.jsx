// =============================
// MyStoreProductTable.jsx
// =============================
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Image as ImageIcon, TrendingUp, List, FileEdit, Package, DollarSign, Pencil, Check, X } from "lucide-react";
import ProductAttributesModal from "./ProductAttributesModal";
import { updateProductPrice } from "@/api/sellerStoreProductPricesService";
import { CURRENCY_CODES } from "@/constants/currencyCode";
import { TABLE_STYLES } from "@/constants/tableStyles";

const TRY_CODE = "TRY";

/** TRY fiyatını bul (tablo varsayılan para birimi) */
const getTryPrice = (prices) => {
  if (!prices?.length) return null;
  return prices.find((p) => p.currencyCode === TRY_CODE) || prices[0];
};

/** Tek fiyat objesini formatla */
const formatPriceFromObj = (price) => {
  if (!price) return "—";
  const val = price?.unitPrice;
  const code = price?.currencyCode || TRY_CODE;
  const sym = CURRENCY_CODES[code]?.symbol ?? code;
  return val != null ? `${Number(val).toLocaleString("tr-TR")} ${sym}` : "—";
};

/** prices dizisinden ilk fiyatı formatla (geriye uyumluluk) */
const formatPrice = (prices) => {
  const p = getTryPrice(prices) || (prices?.[0]);
  return formatPriceFromObj(p);
};

const MyStoreProductTable = ({
  products,
  startIndex = 0,
  onManage,
  onProductIdMissing,
  selectedIds = new Set(),
  onSelectionChange,
  getStoreProductId = (p) => p.id ?? p.storeProductId,
  onRefresh,
  onFeedback,
}) => {
  const navigate = useNavigate();
  const [selectedProductForAttributes, setSelectedProductForAttributes] = useState(null);
  /** TRY fiyat güncelleme: hangi satır düzenleniyor (storeProductId) ve geçici değer */
  const [editingPriceRow, setEditingPriceRow] = useState(null);
  const [editingPriceValue, setEditingPriceValue] = useState("");
  const [priceUpdateLoading, setPriceUpdateLoading] = useState(false);

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

  const tryPrice = (product) => getTryPrice(product.prices);

  const startEditPrice = (product) => {
    const price = tryPrice(product);
    if (!price?.id) {
      onFeedback?.("TRY fiyatı yok. Diğer para birimleri için Yönet kısmını kullanın.", "error");
      return;
    }
    setEditingPriceRow(getStoreProductId(product));
    setEditingPriceValue(String(price.unitPrice ?? ""));
  };

  const cancelEditPrice = () => {
    setEditingPriceRow(null);
    setEditingPriceValue("");
  };

  const saveEditPrice = async (product) => {
    const storeId = getStoreProductId(product);
    const price = tryPrice(product);
    if (!storeId || !price?.id) return;
    const num = parseFloat(editingPriceValue);
    if (isNaN(num) || num <= 0) {
      onFeedback?.("Birim fiyat 0'dan büyük olmalıdır.", "error");
      return;
    }
    if (!Number.isFinite(num) || (String(num).split(".")[1]?.length ?? 0) > 4) {
      onFeedback?.("Birim fiyat en fazla 4 ondalık hane içermelidir.", "error");
      return;
    }
    setPriceUpdateLoading(true);
    try {
      await updateProductPrice(storeId, price.id, { unitPrice: num });
      onFeedback?.("Fiyat güncellendi.", "success");
      onRefresh?.();
      cancelEditPrice();
    } catch (err) {
      const msg = err?.message ?? err?.errors?.[0] ?? "Fiyat güncellenemedi.";
      onFeedback?.(msg, "error");
    } finally {
      setPriceUpdateLoading(false);
    }
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
    <div className={TABLE_STYLES.container}>
      {/* Desktop Table */}
      <div className="hidden xl:block">
        <table className={TABLE_STYLES.table} style={{ minWidth: 900 }}>
          <thead className={TABLE_STYLES.thead}>
            <tr>
              {onSelectionChange && (
                <th className={`${TABLE_STYLES.thCenter} w-12`}>
                  <span className="sr-only">Seç</span>
                </th>
              )}
              <th className={TABLE_STYLES.thCenter}>#</th>
              <th className={TABLE_STYLES.th}>Ürün</th>
              <th className={TABLE_STYLES.thCenter}>Fiyat</th>
              <th className={TABLE_STYLES.thCenter}>Stok</th>
              <th className={TABLE_STYLES.thCenter}>Durum</th>
              <th className={TABLE_STYLES.thCenter}>İşlem</th>
            </tr>
          </thead>

          <tbody className={TABLE_STYLES.tbody}>
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
                  className={`${TABLE_STYLES.tr} ${isSelected ? TABLE_STYLES.trSelected : ""}`}
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
                    {editingPriceRow === storeId ? (
                      <div className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                        <input
                          type="number"
                          step="0.0001"
                          min="0.01"
                          value={editingPriceValue}
                          onChange={(e) => setEditingPriceValue(e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="Fiyat"
                          disabled={priceUpdateLoading}
                        />
                        <span className="text-xs text-gray-500">{CURRENCY_CODES[TRY_CODE]?.symbol ?? TRY_CODE}</span>
                        <button
                          type="button"
                          onClick={() => saveEditPrice(product)}
                          disabled={priceUpdateLoading}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                          title="Kaydet"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditPrice}
                          disabled={priceUpdateLoading}
                          className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                          title="İptal"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium max-w-[140px]">
                        <DollarSign size={12} className="text-emerald-600 flex-shrink-0" />
                        <span className="truncate" title={formatPrice(product.prices)}>{formatPrice(product.prices)}</span>
                        {tryPrice(product)?.id && (
                          <button
                            type="button"
                            onClick={() => startEditPrice(product)}
                            className="p-0.5 rounded hover:bg-emerald-200 text-emerald-700 flex-shrink-0"
                            title="TRY fiyatını güncelle"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                      </div>
                    )}
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
      <div className={`xl:hidden ${TABLE_STYLES.mobileContainer}`}>
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
                      className={`mt-1 min-w-[44px] min-h-[44px] w-10 h-10 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all touch-manipulation ${
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
                    <div className="flex flex-wrap gap-2 mt-2 items-center">
                      {editingPriceRow === storeId ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="number"
                            step="0.0001"
                            min="0.01"
                            value={editingPriceValue}
                            onChange={(e) => setEditingPriceValue(e.target.value)}
                            className="w-24 px-2 py-1.5 text-sm border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="Fiyat"
                            disabled={priceUpdateLoading}
                          />
                          <span className="text-xs text-gray-500">{CURRENCY_CODES[TRY_CODE]?.symbol ?? TRY_CODE}</span>
                          <button type="button" onClick={() => saveEditPrice(product)} disabled={priceUpdateLoading} className="p-1.5 rounded-lg bg-emerald-600 text-white">
                            <Check size={16} />
                          </button>
                          <button type="button" onClick={cancelEditPrice} disabled={priceUpdateLoading} className="p-1.5 rounded-lg bg-gray-200 text-gray-700">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium">
                            <DollarSign size={12} className="text-emerald-600" />
                            {formatPrice(product.prices)}
                          </span>
                          {tryPrice(product)?.id && (
                            <button
                              type="button"
                              onClick={() => startEditPrice(product)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium"
                            >
                              <Pencil size={12} />
                              Fiyat güncelle
                            </button>
                          )}
                        </>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium">
                        <Package size={12} className="text-blue-600" />
                        Stok: {product.stockQuantity != null ? product.stockQuantity : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - min 44px touch target */}
              <div className={`${TABLE_STYLES.mobileCardBody} space-y-2`}>
                <button
                  type="button"
                  onClick={() => handleEditRequest(product)}
                  className={`${TABLE_STYLES.mobileBtn} bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg active:scale-[0.98] transition-all`}
                >
                  <FileEdit className="w-4 h-4" />
                  Düzenleme Talebi Gönder
                </button>
                <button
                  onClick={() => setSelectedProductForAttributes(product)}
                  className={`${TABLE_STYLES.mobileBtn} bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg active:scale-[0.98] transition-all`}
                >
                  <List className="w-4 h-4" />
                  Özellikler
                </button>
                <button
                  onClick={() => onManage(product)}
                  className={`${TABLE_STYLES.mobileBtn} bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg active:scale-[0.98] transition-all`}
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
