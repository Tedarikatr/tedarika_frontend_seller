// =============================
// ProductManagementPanel.jsx (Final + Unit Types + Fiyat Merdivenleri)
// =============================
import React, { useState, useEffect } from "react";
import {
  toggleProductOnSale,
  updateProductQuantityLimits,
  uploadProductImages,
  updateProductStock,
  updateProductUnitType,
} from "@/api/sellerStoreService";
import { addProductPrice, getAllProductPrices } from "@/api/sellerStoreProductPricesService";
import { X, ImagePlus, Images, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductPriceTiers from "@/components/storeProducts/ProductPriceTiers";
import { UNIT_TYPE_OPTIONS } from "@/constants/unitTypes";
import { CURRENCY_OPTIONS, CURRENCY_CODES } from "@/constants/currencyCode";

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
  
  // Yeni fiyat ekleme için state'ler
  const [showAddPrice, setShowAddPrice] = useState(false);
  const [newPrice, setNewPrice] = useState({
    currencyCode: "",
    unitPrice: "",
  });
  
  // Ürün fiyatları (para birimleri)
  const [productPrices, setProductPrices] = useState(product.prices || []);
  
  const storeProductId = product.storeProductId ?? product.id;
  const isOnSale = product.isOnSale ?? false;

  // Ürün fiyatlarını yükle
  useEffect(() => {
    if (!product.prices || product.prices.length === 0) {
      loadProductPrices();
    }
  }, [storeProductId]);

  const loadProductPrices = async () => {
    try {
      const response = await getAllProductPrices(storeProductId);
      setProductPrices(response || []);
    } catch (err) {
      console.error("Fiyatlar yüklenemedi:", err);
      setProductPrices([]);
    }
  };

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

  const handleAddPrice = async () => {
    if (!newPrice.currencyCode || !newPrice.unitPrice) {
      onFeedback("Lütfen tüm alanları doldurun!", "error");
      return;
    }
    
    try {
      await addProductPrice(storeProductId, {
        currencyCode: newPrice.currencyCode,
        unitPrice: parseFloat(newPrice.unitPrice),
      });
      onFeedback("Fiyat başarıyla eklendi!", "success");
      setShowAddPrice(false);
      setNewPrice({ currencyCode: "", unitPrice: "" });
      await loadProductPrices(); // Fiyatları yeniden yükle
      onRefresh?.();
    } catch (err) {
      console.error(err);
      onFeedback("Fiyat eklenemedi!", "error");
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
          {/* 💰 Para Birimi Fiyatları */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Para Birimi Fiyatları
              </h3>
              <Button
                variant="emerald"
                onClick={() => setShowAddPrice(!showAddPrice)}
                className="flex items-center gap-1 text-xs"
              >
                <Plus size={14} />
                Yeni Fiyat Ekle
              </Button>
            </div>

            {showAddPrice && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Para Birimi
                  </label>
                  <select
                    value={newPrice.currencyCode}
                    onChange={(e) =>
                      setNewPrice({ ...newPrice, currencyCode: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Seçiniz...</option>
                    {CURRENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Birim Fiyat
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newPrice.unitPrice}
                    onChange={(e) =>
                      setNewPrice({ ...newPrice, unitPrice: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="emerald" onClick={handleAddPrice}>
                    Ekle
                  </Button>
                  <Button
                    variant="soft"
                    onClick={() => {
                      setShowAddPrice(false);
                      setNewPrice({ currencyCode: "", unitPrice: "" });
                    }}
                  >
                    İptal
                  </Button>
                </div>
              </div>
            )}
            
            {/* Mevcut Fiyatlar */}
            {productPrices.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-600 mb-2">Mevcut Fiyatlar:</h4>
                <div className="space-y-2">
                  {productPrices.map((price) => (
                    <div
                      key={price.id}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-800">
                          {price.currencyCode}
                        </span>
                        <span className="text-xs text-gray-500">
                          {CURRENCY_OPTIONS.find(c => c.value === price.currencyCode)?.label || price.currencyCode}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">
                        {price.unitPrice} {CURRENCY_CODES[price.currencyCode]?.symbol || price.currencyCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-3">
              ℹ️ Not: Bir fiyat ekleyebilmek için önce o ülkede hizmete açmış olmanız gerekir.
            </p>
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
              productPrices={productPrices}
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
