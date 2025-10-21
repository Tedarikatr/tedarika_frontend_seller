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

// 🧩 Yardımcı Fonksiyonlar
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

// 🧱 Mini UI bileşenleri
const Input = ({ value, onChange, placeholder, className, ...props }) => (
  <input
    value={safeNumberInput(value)}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${className}`}
    {...props}
  />
);

const Button = ({ children, variant = "gray", className, ...props }) => {
  const base =
    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    gray: "bg-gray-700 hover:bg-gray-800 text-white",
    ghost: "border border-gray-300 hover:bg-gray-100 text-gray-700",
    soft: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Tag = ({ children, color = "gray" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-700 border border-gray-300",
    green: "bg-green-100 text-green-700 border border-green-300",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
};

// 🧾 Ürün Satırı
const ProductRow = ({ product, onRefresh, onFeedback, hasCoverage }) => {
  const nav = useNavigate();

  const [price, setPrice] = useState(product.unitPrice);
  const [minQty, setMinQty] = useState(product.minOrderQuantity);
  const [maxQty, setMaxQty] = useState(product.maxOrderQuantity);
  const [stock, setStock] = useState(product.stockQuantity ?? 0);
  const [images, setImages] = useState(
    (product.storeProductImagesUrls?.length
      ? product.storeProductImagesUrls
      : product.productImageUrls || []
    ).map((u) => ({ url: u }))
  );

  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [buster, setBuster] = useState(Date.now());
  const tempBlobs = useRef([]);

  const storeProductId = product.storeProductId ?? product.id;
  const isOnSale = product.isOnSale ?? false;

  useEffect(() => {
    const urls =
      product.storeProductImagesUrls?.length
        ? product.storeProductImagesUrls
        : product.productImageUrls || [];
    setImages(urls.map((u) => ({ url: u })));
    setBuster(Date.now());
  }, [product.id]);

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
    if (!selectedFiles?.length) return;
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

  const cover =
    images?.[0]?.url ||
    product.storeProductImageUrl ||
    product.imageUrl ||
    "/placeholder.png";

  return (
    <>
      {/* ÜRÜN */}
      <td className="px-6 py-4 border-t border-gray-300">
        <div className="flex items-center gap-3">
          <img
            src={withBuster(cover, buster)}
            alt={product.name || "Ürün görseli"}
            className="w-12 h-12 object-cover rounded-md border border-gray-300 bg-white"
          />
          <div>
            <div className="font-semibold text-gray-800">{product.name}</div>
            <div className="text-[11px] text-gray-500">#{storeProductId}</div>
          </div>
        </div>
      </td>

      {/* KATEGORİ */}
      <td className="px-6 py-4 border-t border-gray-300">
        <div className="inline-flex flex-wrap items-center gap-2">
          <Tag>{product.categoryName}</Tag>
          <Tag>{product.categorySubName}</Tag>
        </div>
      </td>

      {/* FİYAT */}
      <td className="px-6 py-4 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 text-center"
          />
          <Button onClick={() =>
            handleAction(
              () => updateProductPrice(storeProductId, price),
              "Fiyat güncellendi."
            )
          }>Kaydet</Button>
        </div>
      </td>

      {/* LİMİT */}
      <td className="px-6 py-4 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
            className="w-16 text-center"
          />
          <Input
            type="number"
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value)}
            className="w-16 text-center"
          />
          <Button
            variant="soft"
            onClick={() =>
              handleAction(
                () => updateProductQuantityLimits(storeProductId, minQty, maxQty),
                "Limit güncellendi."
              )
            }
          >
            Kaydet
          </Button>
        </div>
      </td>

      {/* GÖRSELLER */}
      <td className="px-6 py-4 border-t border-gray-300">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex -space-x-2">
            {images.slice(0, 3).map((t, i) => (
              <img
                key={t.key || t.url || i}
                src={withBuster(t.url, buster)}
                alt=""
                className="w-8 h-8 rounded-md border border-gray-300 object-cover bg-white"
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => nav(`/seller/products/${storeProductId}/images`)}
            >
              <div className="flex items-center gap-1.5 text-gray-700">
                <Images size={14} />
                Yönet
                <ChevronRight size={14} className="-mr-0.5" />
              </div>
            </Button>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-dashed border-gray-400 text-gray-600 bg-white cursor-pointer hover:border-gray-600">
              <ImagePlus size={14} />
              Dosya Seç
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
            </label>

            <Button
              variant="gray"
              onClick={handleUpload}
              disabled={uploading || !selectedFiles?.length}
            >
              {uploading ? "Yükleniyor..." : "Yükle"}
            </Button>
          </div>
        </div>
      </td>

      {/* DURUM */}
      <td className="px-6 py-4 border-t border-gray-300">
        <Tag color={isOnSale ? "green" : "gray"}>
          {isOnSale ? "Satışta" : "Pasif"}
        </Tag>
      </td>

      {/* STOK */}
      <td className="px-6 py-4 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-20 text-center"
          />
          <Button
            variant="soft"
            onClick={() =>
              handleAction(
                () => updateProductStock(storeProductId, stock),
                "Stok güncellendi."
              )
            }
          >
            Kaydet
          </Button>
        </div>
      </td>

      {/* İŞLEMLER */}
      <td className="px-6 py-4 border-t border-gray-300">
        <Button
          variant="gray"
          disabled={!hasCoverage}
          onClick={() =>
            handleAction(
              () => toggleProductOnSale(storeProductId, !isOnSale),
              isOnSale ? "Satış kapatıldı." : "Satışa açıldı."
            )
          }
        >
          {isOnSale ? "Satışı Kapat" : "Satışa Aç"}
        </Button>
      </td>
    </>
  );
};

export default ProductRow;
