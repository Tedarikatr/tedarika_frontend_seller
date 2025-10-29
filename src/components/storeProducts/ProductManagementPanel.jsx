// =============================
// ProductManagementPanel.jsx (Final + Unit Types + Fiyat Merdivenleri)
// =============================
import React, { useState } from "react";
import {
  updateProductPrice,
  toggleProductOnSale,
  updateProductQuantityLimits,
  uploadProductImages,
  updateProductStock,
  updateProductUnitType,
} from "@/api/sellerStoreService";
import { X, ImagePlus, Images, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductPriceTiers from "@/components/storeProducts/ProductPriceTiers";
import { UNIT_TYPE_OPTIONS } from "@/constants/unitTypes"; // ✅ Yeni import

// Basit Input
const Input = ({ value, onChange, placeholder, className = "", ...props }) => (
  <input
    value={value ?? ""}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${className}`}
    {...props}
  />
);

// Modern Button
const Button = ({ children, variant = "gray", className = "", ...props }) => {
  const base =
    "px-3 py-2 text-sm font-medium rounded-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    gray: "bg-gray-800 hover:bg-gray-900 text-white",
    soft: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white",
    ghost:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Durum Etiketi
const Tag = ({ children, color = "gray" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-700 border border-gray-300",
    green: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[12px] font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
};

const ProductManagementPanel = ({
  product,
  onClose,
  onFeedback,
  onRefresh,
  hasCoverage,
}) => {
  const nav = useNavigate();
  const [price, setPrice] = useState(product.unitPrice);
  const [minQty, setMinQty] = useState(product.minOrderQuantity);
  const [maxQty, setMaxQty] = useState(product.maxOrderQuantity);
  const [stock, setStock] = useState(product.stockQuantity ?? 0);
  const [unitType, setUnitType] = useState(product.unitType || "");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [images, setImages] = useState(
    product.storeProductImagesUrls?.length
      ? product.storeProductImagesUrls
      : product.productImageUrls || []
  );
  const [buster, setBuster] = useState(Date.now());
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

  const handleUpload = async () => {
    if (!selectedFiles?.length) return;
    setUploading(true);
    try {
      await uploadProductImages(storeProductId, Array.from(selectedFiles));
      onFeedback("Görseller yüklendi.", "success");
      setBuster(Date.now());
      onRefresh?.();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50 bg-black/30 backdrop-blur-sm transition-all">
      <div className="w-full sm:w-[480px] bg-white h-full shadow-2xl overflow-y-auto p-6 relative animate-[slideIn_0.35s_ease-out] rounded-l-2xl">
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">Ürün Yönetimi</h2>

        {/* Ürün Bilgisi */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={
              product.storeProductImageUrl ||
              product.imageUrl ||
              "/placeholder.png"
            }
            alt=""
            className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
          />
          <div>
            <div className="font-semibold text-lg text-gray-800">
              {product.name}
            </div>
            <div className="text-sm text-gray-500">#{storeProductId}</div>
          </div>
        </div>

        <div className="space-y-8">
          {/* 💰 Fiyat Güncelle */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Fiyat Güncelle
            </h3>
            <div className="flex gap-2">
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Button
                variant="emerald"
                onClick={() =>
                  handleAction(
                    () => updateProductPrice(storeProductId, price),
                    "Fiyat güncellendi."
                  )
                }
              >
                Kaydet
              </Button>
            </div>
          </section>

          {/* 📦 Birim Tipi Güncelle */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Birim Tipi Güncelle
            </h3>
            <div className="flex gap-2">
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none w-full"
              >
                <option value="">Birim Tipi Seçiniz</option>
                {UNIT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button
                variant="soft"
                onClick={() =>
                  handleAction(
                    () => updateProductUnitType(storeProductId, unitType),
                    "Birim tipi güncellendi."
                  )
                }
                disabled={!unitType}
              >
                Kaydet
              </Button>
            </div>
          </section>

          {/* 🔢 Limitler */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Sipariş Limitleri
            </h3>
            <div className="flex gap-2">
              <Input
                type="number"
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
                placeholder="Min"
              />
              <Input
                type="number"
                value={maxQty}
                onChange={(e) => setMaxQty(e.target.value)}
                placeholder="Max"
              />
              <Button
                variant="soft"
                onClick={() =>
                  handleAction(
                    () =>
                      updateProductQuantityLimits(
                        storeProductId,
                        minQty,
                        maxQty
                      ),
                    "Limitler güncellendi."
                  )
                }
              >
                Kaydet
              </Button>
            </div>
          </section>

          {/* 🏷️ Stok Güncelle */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Stok Güncelle
            </h3>
            <div className="flex gap-2">
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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
          </section>

          {/* 📸 Ürün Görselleri */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Ürün Görselleri
            </h3>
            <div className="flex gap-3 flex-wrap mb-4">
              {images.slice(0, 4).map((url, i) => (
                <img
                  key={i}
                  src={`${url}?v=${buster}`}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                />
              ))}
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-dashed border-gray-400 text-gray-700 bg-white cursor-pointer hover:border-gray-600">
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
                variant="emerald"
                onClick={handleUpload}
                disabled={uploading || !selectedFiles?.length}
              >
                {uploading ? "Yükleniyor..." : "Yükle"}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  nav(`/seller/products/${storeProductId}/images`)
                }
              >
                <Images size={14} className="mr-1" />
                Görselleri Yönet
                <ChevronRight size={14} />
              </Button>
            </div>
          </section>

          {/* 🟢 Satış Durumu */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Satış Durumu
            </h3>
            <div className="flex items-center gap-3">
              <Tag color={isOnSale ? "green" : "gray"}>
                {isOnSale ? "Satışta" : "Pasif"}
              </Tag>
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
            </div>
          </section>

          {/* 🧮 Fiyat Merdivenleri */}
          <section>
            <ProductPriceTiers
              storeProductId={storeProductId}
              onFeedback={onFeedback}
            />
          </section>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0.4; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ProductManagementPanel;
