import React, { useState } from "react";
import {
  updateProductPrice,
  toggleProductOnSale,
  updateProductQuantityLimits,
  uploadProductImage,
  updateProductStock,
} from "@/api/sellerStoreService";

// Boşluklara karşı güvenli input
const safeNumberInput = (value) =>
  value === null || value === undefined || value === "NaN" ? "" : value;

const ProductRow = ({ product, onRefresh, onFeedback, hasCoverage }) => {
  const [price, setPrice] = useState(product.unitPrice);
  const [minQty, setMinQty] = useState(product.minOrderQuantity);
  const [maxQty, setMaxQty] = useState(product.maxOrderQuantity);
  const [stock, setStock] = useState(product.stockQuantity ?? 0);
  const [imageFile, setImageFile] = useState(null);

  const storeProductId = product.storeProductId ?? product.id;

  const handleAction = async (fn, msg) => {
    try {
      await fn();
      onRefresh();
      onFeedback(msg, "success");
    } catch (error) {
      console.error(error);
      onFeedback("İşlem başarısız oldu!", "error");
    }
  };

  const handleImageUpload = () => {
    if (!imageFile) return;
    return uploadProductImage(storeProductId, imageFile);
  };

  const inputStyle =
    "px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition";

  const buttonStyle =
    "px-3 py-1 text-xs font-semibold rounded-md transition text-white";

  return (
    <>
      {/* Ürün */}
      <td className="px-5 py-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : product.imageUrl || "/placeholder.png"
            }
            alt={product.name || "Ürün görseli"}
            className="w-12 h-12 object-cover rounded border"
          />
          <div>
            <div className="font-semibold text-gray-800 text-sm">
              {product.name}
            </div>
            <div className="text-[11px] text-gray-500">#{storeProductId}</div>
          </div>
        </div>
      </td>

      {/* Kategori */}
      <td className="px-5 py-3">
        <div className="text-sm">{product.categoryName}</div>
        <div className="text-xs text-gray-500">{product.categorySubName}</div>
      </td>

      {/* Fiyat */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={safeNumberInput(price)}
            onChange={(e) => setPrice(e.target.value)}
            className={`${inputStyle} min-w-[100px] max-w-[140px]`}
            placeholder="₺"
          />
          <button
            onClick={() =>
              handleAction(
                () => updateProductPrice(storeProductId, price),
                "Fiyat güncellendi."
              )
            }
            className={`${buttonStyle} bg-emerald-600 hover:bg-emerald-700`}
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* Limit */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={safeNumberInput(minQty)}
            onChange={(e) => setMinQty(e.target.value)}
            className={`${inputStyle} w-16`}
            placeholder="Min"
          />
          <input
            type="number"
            value={safeNumberInput(maxQty)}
            onChange={(e) => setMaxQty(e.target.value)}
            className={`${inputStyle} w-16`}
            placeholder="Max"
          />
          <button
            onClick={() =>
              handleAction(
                () =>
                  updateProductQuantityLimits(storeProductId, minQty, maxQty),
                "Limit güncellendi."
              )
            }
            className={`${buttonStyle} bg-gray-600 hover:bg-gray-700`}
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* Görsel */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="text-xs text-gray-600"
          />
          <button
            onClick={() => handleAction(handleImageUpload, "Görsel yüklendi.")}
            className={`${buttonStyle} bg-blue-600 hover:bg-blue-700`}
          >
            Yükle
          </button>
        </div>
      </td>

      {/* Durum */}
      <td className="px-5 py-3">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            product.isOnSale
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {product.isOnSale ? "Satışta" : "Pasif"}
        </span>
      </td>

      {/* Stok */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={safeNumberInput(stock)}
            onChange={(e) => setStock(e.target.value)}
            className={`${inputStyle} w-20`}
          />
          <button
            onClick={() =>
              handleAction(
                () => updateProductStock(storeProductId, stock),
                "Stok güncellendi."
              )
            }
            className={`${buttonStyle} bg-indigo-600 hover:bg-indigo-700`}
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* Satışa Aç/Kapat */}
      <td className="px-5 py-3">
        <button
          onClick={() =>
            handleAction(
              () =>
                toggleProductOnSale(storeProductId, !product.isOnSale),
              product.isOnSale ? "Satış kapatıldı." : "Satışa açıldı."
            )
          }
          disabled={!hasCoverage}
          title={
            !hasCoverage
              ? "Satışa açmak için hizmet bölgesi tanımlayın."
              : ""
          }
          className={`text-sm font-medium underline ${
            !hasCoverage
              ? "text-gray-400 cursor-not-allowed"
              : "text-yellow-600 hover:text-yellow-700"
          }`}
        >
          {product.isOnSale ? "Satışı Kapat" : "Satışa Aç"}
        </button>
      </td>
    </>
  );
};

export default ProductRow;
