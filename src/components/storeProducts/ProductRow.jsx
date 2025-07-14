import React, { useState } from "react";
import {
  updateProductPrice,
  toggleProductActiveStatus,
  toggleProductOnSale,
  updateProductQuantityLimits,
  uploadProductImage,
  updateProductStock,
} from "@/api/sellerStoreService";

const ProductRow = ({ product, onRefresh, onFeedback }) => {
  const [price, setPrice] = useState(product.unitPrice);
  const [minQty, setMinQty] = useState(product.minOrderQuantity);
  const [maxQty, setMaxQty] = useState(product.maxOrderQuantity);
  const [stock, setStock] = useState(product.stockQuantity ?? 0); // ✅ Doğru alan kullanıldı
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
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
      {/* Ürün */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="w-12 h-12 object-cover rounded border"
          />
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-gray-500">#{product.id}</div>
          </div>
        </div>
      </td>

      {/* Kategori */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div>{product.categoryName}</div>
        <div className="text-xs text-gray-500">{product.categorySubName}</div>
      </td>

      {/* Fiyat */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={() => handleAction(() => updateProductPrice(product.id, price), "Fiyat güncellendi.")}
            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* Limit */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
            className="w-14 border px-2 py-1 rounded text-sm"
            placeholder="Min"
          />
          <input
            type="number"
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value)}
            className="w-14 border px-2 py-1 rounded text-sm"
            placeholder="Max"
          />
          <button
            onClick={() =>
              handleAction(() => updateProductQuantityLimits(product.id, minQty, maxQty), "Limit güncellendi.")
            }
            className="bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* Görsel */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="text-xs"
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
      <td className="px-4 py-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${
            product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {product.isActive ? "Aktif" : "Pasif"}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${
            product.isOnSale ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
          }`}>
            {product.isOnSale ? "Satışta" : "Satışta Değil"}
          </span>
        </div>
      </td>

      {/* Stok */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-16 border px-2 py-1 rounded text-sm"
          />
          <button
            onClick={() => handleAction(() => updateProductStock(product.id, stock), "Stok güncellendi.")}
            className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* İşlemler */}
      <td className="px-4 py-3 text-sm">
        <div className="flex flex-col gap-1">
          <button
            onClick={() =>
              handleAction(
                () => toggleProductActiveStatus(product.id, !product.isActive),
                product.isActive ? "Ürün pasifleştirildi." : "Ürün aktifleştirildi."
              )
            }
            className="text-blue-700 hover:underline"
          >
            {product.isActive ? "Pasifleştir" : "Aktifleştir"}
          </button>
          <button
            onClick={() =>
              handleAction(
                () => toggleProductOnSale(product.id, !product.isOnSale),
                product.isOnSale ? "Satış kapatıldı." : "Satışa açıldı."
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
