import React, { useState } from "react";
import {
  updateProductPrice,
  toggleProductActiveStatus,
  toggleProductOnSale,
  updateProductQuantityLimits,
  uploadProductImage,
} from "@/api/sellerStoreService";

const ProductRow = ({ product, onRefresh, onFeedback }) => {
  const [price, setPrice] = useState(product.unitPrice);
  const [minQty, setMinQty] = useState(product.minOrderQuantity);
  const [maxQty, setMaxQty] = useState(product.maxOrderQuantity);
  const [imageFile, setImageFile] = useState(null);

  const handleAction = async (actionFn, successMessage) => {
    try {
      await actionFn();
      onRefresh();
      onFeedback?.(successMessage, "success");
    } catch (err) {
      console.error("İşlem hatası:", err);
      onFeedback?.("Bir hata oluştu!", "error");
    }
  };

  const handleImageUpload = () => {
    if (!imageFile) return;
    return uploadProductImage(product.id, imageFile);
  };

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
      {/* Ürün Bilgisi */}
      <td className="px-4 py-3 border-r border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : product.imageUrl || "/placeholder.png"
            }
            alt={product.name}
            className="w-12 h-12 object-cover rounded-md border"
          />
          <div>
            <div className="font-medium text-gray-800">{product.name}</div>
            <div className="text-xs text-gray-500">#{product.id}</div>
          </div>
        </div>
      </td>

      {/* Kategori */}
      <td className="px-4 py-3 border-r border-gray-200">
        <div className="text-sm text-gray-800">{product.categoryName}</div>
        <div className="text-xs text-gray-500">{product.categorySubName}</div>
      </td>

      {/* Fiyat */}
      <td className="px-4 py-3 border-r border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="border border-gray-300 rounded px-2 py-1 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            onClick={() =>
              handleAction(() => updateProductPrice(product.id, price), "Fiyat güncellendi.")
            }
            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
          >
            Güncelle
          </button>
        </div>
      </td>

      {/* Limitler */}
      <td className="px-4 py-3 border-r border-gray-200">
        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="Min"
            className="border border-gray-300 px-2 py-1 w-14 rounded text-sm"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="border border-gray-300 px-2 py-1 w-14 rounded text-sm"
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value)}
          />
          <button
            onClick={() =>
              handleAction(
                () => updateProductQuantityLimits(product.id, minQty, maxQty),
                "Limitler güncellendi."
              )
            }
            className="bg-gray-400 text-white text-xs px-3 py-1 rounded hover:bg-gray-500"
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* Görsel */}
      <td className="px-4 py-3 border-r border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="text-xs text-gray-700"
          />
          <button
            onClick={() => handleAction(handleImageUpload, "Görsel yüklendi.")}
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
          >
            Yükle
          </button>
        </div>
      </td>

      {/* Durum */}
      <td className="px-4 py-3 border-r border-gray-200">
        <div className="flex flex-col gap-1 text-xs">
          <span
            className={`px-2 py-1 rounded font-medium w-fit ${
              product.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.isActive ? "Aktif" : "Pasif"}
          </span>
          <span
            className={`px-2 py-1 rounded font-medium w-fit ${
              product.isOnSale
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {product.isOnSale ? "Satışta" : "Satışta Değil"}
          </span>
        </div>
      </td>

      {/* İşlemler */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1 text-xs text-blue-700">
          <button
            onClick={() =>
              handleAction(
                () => toggleProductActiveStatus(product.id, !product.isActive),
                !product.isActive ? "Ürün aktifleştirildi." : "Ürün pasifleştirildi."
              )
            }
            className="hover:underline"
          >
            {product.isActive ? "Pasifleştir" : "Aktifleştir"}
          </button>
          <button
            onClick={() =>
              handleAction(
                () => toggleProductOnSale(product.id, !product.isOnSale),
                !product.isOnSale ? "Satışa açıldı." : "Satış kapatıldı."
              )
            }
            className="text-yellow-600 hover:underline"
          >
            {product.isOnSale ? "Satışı Kapat" : "Satışa Aç"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
