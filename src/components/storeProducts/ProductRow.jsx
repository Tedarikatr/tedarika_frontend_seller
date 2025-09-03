import React, { useEffect, useRef, useState } from "react";
import {
  updateProductPrice,
  toggleProductOnSale,
  updateProductQuantityLimits,
  uploadProductImages,
  updateProductStock,
} from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Images, ChevronRight } from "lucide-react";

const safeNumberInput = (v) =>
  v === null || v === undefined || v === "NaN" ? "" : v;

const withBuster = (url, buster) => {
  if (!url) return url;
  try {
    const u = new URL(url, window.location.origin);
    u.searchParams.set("v", String(buster));
    return u.toString();
  } catch {
    return `${url}${url.includes("?") ? "&" : "?"}v=${buster}`;
  }
};

const ProductRow = ({ product, onRefresh, onFeedback, hasCoverage }) => {
  const nav = useNavigate();

  const [price, setPrice] = useState(product.unitPrice);
  const [minQty, setMinQty] = useState(product.minOrderQuantity);
  const [maxQty, setMaxQty] = useState(product.maxOrderQuantity);
  const [stock, setStock] = useState(product.stockQuantity ?? 0);

  // görseller: üründen gelen liste
  const initialUrls =
    product.storeProductImagesUrls?.length
      ? product.storeProductImagesUrls
      : product.productImageUrls || [];
  const [images, setImages] = useState(initialUrls.map((u) => ({ url: u })));

  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [buster, setBuster] = useState(Date.now());
  const tempBlobs = useRef([]);

  useEffect(() => {
    const urls =
      product.storeProductImagesUrls?.length
        ? product.storeProductImagesUrls
        : product.productImageUrls || [];
    setImages(urls.map((u) => ({ url: u })));
    setBuster(Date.now());
  }, [product.id]);

  const storeProductId = product.storeProductId ?? product.id;
  const isOnSale = product.isOnSale ?? false;

  const handleAction = async (fn, msg) => {
    try {
      await fn();
      onFeedback(msg, "success");
      onRefresh?.();
    } catch (err) {
      console.error(err);
      onFeedback("İşlem başarısız oldu!", "error");
    }
  };

  const optimisticAdd = (fileList) => {
    const files = Array.from(fileList || []);
    const now = Date.now();
    const items = files.map((f, i) => {
      const url = URL.createObjectURL(f);
      tempBlobs.current.push(url);
      return { url, _temp: true, key: `temp-${now}-${i}` };
    });
    setImages((prev) => [...items, ...prev]);
  };

  const handleUpload = async () => {
    if (!selectedFiles || !selectedFiles.length) return;
    optimisticAdd(selectedFiles);
    setUploading(true);
    try {
      await uploadProductImages(storeProductId, Array.from(selectedFiles));
      setBuster(Date.now());
      onFeedback("Görseller yüklendi.", "success");
      setSelectedFiles(null);
    } finally {
      setUploading(false);
      tempBlobs.current.forEach((u) => URL.revokeObjectURL(u));
      tempBlobs.current = [];
    }
  };

  const inputStyle =
    "px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60 transition shadow-sm";
  const pillBtn =
    "px-3 py-1.5 text-xs font-semibold rounded-xl transition text-white shadow-sm";
  const ghostBtn =
    "px-3 py-1.5 text-xs font-semibold rounded-xl transition border shadow-sm";

  const cover =
    images?.[0]?.url ||
    product.storeProductImageUrl ||
    product.imageUrl ||
    "/placeholder.png";

  return (
    <>
      {/* ÜRÜN */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={withBuster(cover, buster)}
              alt={product.name || "Ürün görseli"}
              className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border shadow-sm bg-white"
            />
            {images.length > 1 && (
              <span className="absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white shadow">
                {images.length}
              </span>
            )}
          </div>
          <div className="min-w-[180px]">
            <div className="font-semibold text-gray-800">{product.name}</div>
            <div className="text-[11px] text-gray-500">#{storeProductId}</div>
          </div>
        </div>
      </td>

      {/* KATEGORİ */}
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 border">
            {product.categoryName}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-50 text-gray-500 border">
            {product.categorySubName}
          </span>
        </div>
      </td>

      {/* FİYAT */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute -top-2 left-2 text-[10px] text-gray-400">₺</span>
            <input
              type="number"
              value={safeNumberInput(price)}
              onChange={(e) => setPrice(e.target.value)}
              className={`${inputStyle} min-w-[110px] pl-5`}
              placeholder="₺"
            />
          </div>
          <button
            onClick={() =>
              handleAction(
                () => updateProductPrice(storeProductId, price),
                "Fiyat güncellendi."
              )
            }
            className={`${pillBtn} bg-emerald-600 hover:bg-emerald-700`}
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* LİMİT */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={safeNumberInput(minQty)}
            onChange={(e) => setMinQty(e.target.value)}
            className={`${inputStyle} w-16 text-center`}
            placeholder="Min"
          />
          <input
            type="number"
            value={safeNumberInput(maxQty)}
            onChange={(e) => setMaxQty(e.target.value)}
            className={`${inputStyle} w-16 text-center`}
            placeholder="Max"
          />
          <button
            onClick={() =>
              handleAction(
                () => updateProductQuantityLimits(storeProductId, minQty, maxQty),
                "Limit güncellendi."
              )
            }
            className={`${ghostBtn} border-gray-300 hover:bg-gray-50`}
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* GÖRSELLER */}
      <td className="px-6 py-4">
        {/* mini galeri */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex -space-x-2">
            {images.slice(0, 3).map((t, i) => (
              <img
                key={t.key || t.url || i}
                src={withBuster(t.url, buster)}
                alt=""
                className="w-8 h-8 rounded-lg ring-2 ring-white border object-cover bg-white shadow-sm"
              />
            ))}
          </div>

          {/* yönet butonu */}
          <button
            onClick={() => nav(`/seller/products/${storeProductId}/images`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            title="Görselleri yönet"
          >
            <Images size={14} />
            Yönet
            <ChevronRight size={14} className="-mr-0.5" />
          </button>
        </div>

        {/* hızlı yükleme */}
        <div className="flex items-center gap-2 mt-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-dashed hover:border-emerald-500/80 text-gray-700 hover:text-emerald-700 bg-white cursor-pointer shadow-sm">
            <ImagePlus size={14} />
            Dosyaları Seç
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFiles || selectedFiles.length === 0}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl text-white shadow-sm ${
              uploading || !selectedFiles
                ? "bg-gray-300"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {uploading ? "Yükleniyor..." : "Yükle"}
          </button>
        </div>
      </td>

      {/* DURUM */}
      <td className="px-6 py-4">
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm ${
            isOnSale
              ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
          }`}
        >
          {isOnSale ? "Satışta" : "Pasif"}
        </span>
      </td>

      {/* STOK */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={safeNumberInput(stock)}
            onChange={(e) => setStock(e.target.value)}
            className={`${inputStyle} w-24 text-center`}
          />
          <button
            onClick={() =>
              handleAction(
                () => updateProductStock(storeProductId, stock),
                "Stok güncellendi."
              )
            }
            className={`${ghostBtn} border-gray-300 hover:bg-gray-50`}
          >
            Kaydet
          </button>
        </div>
      </td>

      {/* İŞLEMLER */}
      <td className="px-6 py-4">
        <button
          onClick={() =>
            handleAction(
              () => toggleProductOnSale(storeProductId, !isOnSale),
              isOnSale ? "Satış kapatıldı." : "Satışa açıldı."
            )
          }
          disabled={!hasCoverage}
          title={!hasCoverage ? "Satışa açmak için hizmet bölgesi tanımlayın." : ""}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm ${
            !hasCoverage
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          {isOnSale ? "Satışı Kapat" : "Satışa Aç"}
        </button>
      </td>
    </>
  );
};

export default ProductRow;
