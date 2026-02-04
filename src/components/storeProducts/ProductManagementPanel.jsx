// =============================
// ProductManagementPanel.jsx - Ultra Modern & Beautiful 🎨
// =============================
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  toggleProductOnSale,
  updateProductQuantityLimits,
  uploadProductImages,
  updateProductStock,
  updateProductUnitType,
} from "@/api/sellerStoreService";
import {
  addProductPrice,
  getAllProductPrices,
  updateProductPrice,
  deleteProductPrice,
} from "@/api/sellerStoreProductPricesService";
import {
  X,
  ImagePlus,
  Images,
  ChevronRight,
  ChevronLeft,
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  Save,
  Sparkles,
  Layers,
  Box,
  Play,
  Pause,
  Pencil,
  Trash2,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductPriceTiers from "@/components/storeProducts/ProductPriceTiers";
import { UNIT_TYPE_OPTIONS } from "@/constants/unitTypes";
import { CURRENCY_OPTIONS, CURRENCY_CODES } from "@/constants/currencyCode";

// ============ Ultra Modern UI Components ============

// Şık Input Bileşeni
const Input = ({ value, onChange, placeholder, className = "", icon: Icon, ...props }) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
        <Icon size={16} />
      </div>
    )}
    <input
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-gray-300 ${className}`}
      {...props}
    />
  </div>
);

// Modern Button Bileşeni
const Button = ({ children, variant = "primary", size = "md", className = "", icon: Icon, ...props }) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300",
    ghost: "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200",
    danger: "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300",
    success: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  
  return (
    <button 
      className={`${sizeClasses[size]} font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Güzel Badge Bileşeni
const Badge = ({ children, variant = "default", size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };
  
  const variants = {
    default: "bg-gray-100 text-gray-700 border border-gray-200",
    success: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200",
    warning: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200",
    info: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200",
  };
  
  return (
    <span className={`${sizeClasses[size]} ${variants[variant]} rounded-full font-medium inline-flex items-center gap-1.5`}>
      {children}
    </span>
  );
};

// Section Card Bileşeni
const SectionCard = ({ title, icon: Icon, children, action }) => (
  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
    <div className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {Icon && (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 flex-shrink-0">
            <Icon size={16} />
          </div>
        )}
        <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-4 sm:p-5">
      {children}
    </div>
  </div>
);

// ============ Main Component ============

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
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  
  // Yeni fiyat ekleme için state'ler
  const [showAddPrice, setShowAddPrice] = useState(false);
  const [newPrice, setNewPrice] = useState({
    currencyCode: "",
    unitPrice: "",
  });
  
  // Ürün fiyatları (para birimleri)
  const [productPrices, setProductPrices] = useState(product.prices || []);

  // Tek fiyat düzenleme (Yönet panelinde)
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editingPriceUnitPrice, setEditingPriceUnitPrice] = useState("");
  const [priceEditLoading, setPriceEditLoading] = useState(false);

  const storeProductId = product.storeProductId ?? product.id;
  const isOnSale = product.isOnSale ?? false;

  // Ürün fiyatlarını yükle
  useEffect(() => {
    if (!product.prices || product.prices.length === 0) {
      loadProductPrices();
    }
  }, [storeProductId]);

  // Ürün görselleri product prop ile senkronize
  useEffect(() => {
    const urls =
      product.storeProductImagesUrls?.length
        ? product.storeProductImagesUrls
        : product.productImageUrls || [];
    setImages(urls);
    setSlideshowIndex((i) => (i >= urls.length ? 0 : i));
  }, [product.storeProductImagesUrls, product.productImageUrls]);

  // Slayt gösterisi otomatik ilerleme
  useEffect(() => {
    if (!slideshowPlaying || images.length <= 1) return;
    const t = setInterval(() => {
      setSlideshowIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(t);
  }, [slideshowPlaying, images.length]);

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
    const num = parseFloat(newPrice.unitPrice);
    if (isNaN(num) || num <= 0) {
      onFeedback("Birim fiyat sıfırdan büyük olmalıdır.", "error");
      return;
    }
    try {
      await addProductPrice(storeProductId, {
        currencyCode: newPrice.currencyCode,
        unitPrice: num,
      });
      onFeedback("✅ Fiyat başarıyla eklendi!", "success");
      setShowAddPrice(false);
      setNewPrice({ currencyCode: "", unitPrice: "" });
      await loadProductPrices();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      const msg = err?.errors?.[0] ?? err?.message ?? "Fiyat eklenemedi.";
      onFeedback(msg, "error");
    }
  };

  const startEditPrice = (price) => {
    setEditingPriceId(price.id);
    setEditingPriceUnitPrice(String(price.unitPrice ?? ""));
  };

  const cancelEditPrice = () => {
    setEditingPriceId(null);
    setEditingPriceUnitPrice("");
  };

  const saveEditPrice = async () => {
    if (!editingPriceId || editingPriceUnitPrice === "") return;
    const num = parseFloat(editingPriceUnitPrice);
    if (isNaN(num) || num <= 0) {
      onFeedback("Birim fiyat pozitif olmalıdır.", "error");
      return;
    }
    setPriceEditLoading(true);
    try {
      await updateProductPrice(storeProductId, editingPriceId, { unitPrice: num });
      onFeedback("✅ Fiyat güncellendi!", "success");
      await loadProductPrices();
      onRefresh?.();
      cancelEditPrice();
    } catch (err) {
      const msg = err?.errors?.[0] ?? err?.message ?? "Fiyat güncellenemedi.";
      onFeedback(msg, "error");
    } finally {
      setPriceEditLoading(false);
    }
  };

  const handleDeletePrice = async (price) => {
    if (price.currencyCode === "TRY") {
      onFeedback("TRY fiyatı silinemez; zorunlu para birimidir. Tabloda güncelleyebilirsiniz.", "error");
      return;
    }
    if (!window.confirm(`${price.currencyCode} fiyatını kaldırmak istediğinize emin misiniz?`)) return;
    try {
      await deleteProductPrice(storeProductId, price.id);
      onFeedback("✅ Fiyat kaldırıldı.", "success");
      await loadProductPrices();
      onRefresh?.();
    } catch (err) {
      const msg = err?.errors?.[0] ?? err?.message ?? "Fiyat kaldırılamadı.";
      onFeedback(msg, "error");
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles?.length) return;
    setUploading(true);
    try {
      await uploadProductImages(storeProductId, Array.from(selectedFiles));
      onFeedback("✅ Görseller yüklendi!", "success");
      setBuster(Date.now());
      onRefresh?.();
    } finally {
      setUploading(false);
    }
  };

  const panelContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop - Tüm sayfayı kaplayan blur overlay (header dahil) */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-all"
        onClick={onClose}
      />
      
      {/* Panel - Centered and scrollable */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-[slideIn_0.35s_ease-out] flex flex-col">
        
        {/* ============ Ultra Modern Header ============ */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white p-4 sm:p-6 shadow-xl flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 pr-10 sm:pr-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold truncate">Ürün Yönetimi</h2>
              <p className="text-emerald-100 text-xs sm:text-sm truncate">Detaylı düzenleme ve ayarlar</p>
            </div>
          </div>
        </div>

        {/* ============ Main Content ============ */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          
          {/* ============ FİYAT İŞLEMLERİ ============ */}
          
          {/* 💰 Para Birimi Fiyatları */}
          <SectionCard 
            title="Para Birimi Fiyatları" 
            icon={DollarSign}
            action={
              <Button 
                variant="success" 
                size="sm" 
                icon={Plus}
                onClick={() => setShowAddPrice(!showAddPrice)}
              >
                Yeni Ekle
              </Button>
            }
          >
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <span className="text-amber-600">ℹ️</span>
              <p>
                <strong>Tabloda</strong> varsayılan olarak <strong>TRY</strong> fiyatı güncellenir. Diğer para birimleri (EUR, USD vb.) burada eklenir ve yönetilir.
              </p>
            </div>
            {showAddPrice && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 sm:p-5 mb-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                    <DollarSign size={14} className="text-emerald-600" />
                    Para Birimi
                  </label>
                  <select
                    value={newPrice.currencyCode}
                    onChange={(e) =>
                      setNewPrice({ ...newPrice, currencyCode: e.target.value })
                    }
                    className="w-full px-4 py-3 text-sm border border-emerald-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="">💱 Seçiniz...</option>
                    {CURRENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                    <TrendingUp size={14} className="text-emerald-600" />
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
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button variant="primary" onClick={handleAddPrice} icon={Save}>
                    Kaydet
                  </Button>
                  <Button
                    variant="secondary"
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
            {productPrices.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                  <Sparkles size={12} />
                  Tanımlı Fiyatlar ({productPrices.length})
                </p>
                <div className="space-y-2">
                  {productPrices.map((price) => (
                    <div
                      key={price.id}
                      className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:shadow-md transition-all"
                    >
                      {editingPriceId === price.id ? (
                        <div className="flex flex-wrap items-center gap-2 w-full">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                            {price.currencyCode}
                          </div>
                          <input
                            type="number"
                            step="0.0001"
                            min="0.01"
                            value={editingPriceUnitPrice}
                            onChange={(e) => setEditingPriceUnitPrice(e.target.value)}
                            className="flex-1 min-w-[80px] px-3 py-2 text-sm border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            placeholder="Birim fiyat"
                            disabled={priceEditLoading}
                          />
                          <span className="text-xs text-gray-500">{CURRENCY_CODES[price.currencyCode]?.symbol || price.currencyCode}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={saveEditPrice}
                              disabled={priceEditLoading}
                              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                              title="Kaydet"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditPrice}
                              disabled={priceEditLoading}
                              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                              title="İptal"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {price.currencyCode}
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">
                                {CURRENCY_OPTIONS.find(c => c.value === price.currencyCode)?.label?.split(' - ')[1] || price.currencyCode}
                              </div>
                              <div className="text-sm font-bold text-gray-800">
                                {price.unitPrice} {CURRENCY_CODES[price.currencyCode]?.symbol || price.currencyCode}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="success">Aktif</Badge>
                            <button
                              type="button"
                              onClick={() => startEditPrice(price)}
                              className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                              title="Fiyatı düzenle"
                            >
                              <Pencil size={14} />
                            </button>
                            {price.currencyCode !== "TRY" && (
                              <button
                                type="button"
                                onClick={() => handleDeletePrice(price)}
                                className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                                title="Fiyatı kaldır"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <DollarSign size={32} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Henüz fiyat eklenmemiş</p>
                <p className="text-xs text-gray-400 mt-1">Yukarıdan yeni fiyat ekleyebilirsiniz</p>
              </div>
            )}
            
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-blue-600 text-lg">ℹ️</span>
              <p className="text-xs text-blue-700">
                Fiyat ekleyebilmek için önce o ülkede hizmet vermelisiniz.
              </p>
            </div>
          </SectionCard>

          {/* 🧮 Fiyat Merdivenleri */}
          <ProductPriceTiers
            storeProductId={storeProductId}
            productPrices={productPrices}
            onFeedback={onFeedback}
          />

          {/* 📦 Birim Tipi */}
          <SectionCard title="Birim Tipi" icon={Box}>
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-700 block">
                Satış birimi seçiniz
              </label>
              <div className="flex gap-2">
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl text-sm px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all bg-white"
                >
                  <option value="">Birim Tipi Seçiniz</option>
                  {UNIT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="primary"
                  onClick={() =>
                    handleAction(
                      () => updateProductUnitType(storeProductId, unitType),
                      "✅ Birim tipi güncellendi!"
                    )
                  }
                  disabled={!unitType}
                  icon={Save}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* ============ SİPARİŞ İŞLEMLERİ ============ */}
          
          {/* 🔢 Sipariş Limitleri */}
          <SectionCard title="Sipariş Limitleri" icon={Layers}>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  Minimum Adet
                </label>
                <Input
                  type="number"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  placeholder="Min"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  Maksimum Adet
                </label>
                <Input
                  type="number"
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                  placeholder="Max"
                />
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() =>
                  handleAction(
                    () =>
                      updateProductQuantityLimits(
                        storeProductId,
                        minQty,
                        maxQty
                      ),
                    "✅ Limitler güncellendi!"
                  )
                }
                icon={Save}
              >
                Kaydet
              </Button>
            </div>
          </SectionCard>

          {/* ============ STOK İŞLEMLERİ ============ */}
          
          {/* Stok */}
          <SectionCard title="Stok Miktarı" icon={Package}>
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-700 block">
                Mevcut stok adedi
              </label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stok"
              />
              <Button
                variant="primary"
                className="w-full"
                onClick={() =>
                  handleAction(
                    () => updateProductStock(storeProductId, stock),
                    "✅ Stok güncellendi!"
                  )
                }
                icon={Save}
              >
                Kaydet
              </Button>
            </div>
          </SectionCard>

          {/* 📸 Ürün Görselleri - Slayt Gösterisi */}
          <SectionCard title="Ürün Görselleri" icon={Images}>
            <div className="space-y-4">
              {images.length > 0 && (
                <div className="relative overflow-hidden rounded-xl bg-gray-100 border-2 border-gray-200">
                  {/* Ana slayt alanı */}
                  <div className="relative aspect-[4/3] sm:aspect-video bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={`${images[slideshowIndex]}?v=${buster}`}
                      alt={`${product?.name || "Ürün"} görseli ${slideshowIndex + 1}`}
                      className="w-full h-full object-contain transition-opacity duration-300"
                    />
                    {/* Önceki / Sonraki butonları */}
                    <button
                      type="button"
                      onClick={() =>
                        setSlideshowIndex((i) => (i - 1 + images.length) % images.length)
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-all"
                      aria-label="Önceki"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSlideshowIndex((i) => (i + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-all"
                      aria-label="Sonraki"
                    >
                      <ChevronRight size={24} />
                    </button>
                    {/* Otomatik oynatma butonu */}
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSlideshowPlaying(!slideshowPlaying)}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 text-white text-sm font-medium flex items-center gap-2"
                      >
                        {slideshowPlaying ? (
                          <>
                            <Pause size={16} />
                            Durdur
                          </>
                        ) : (
                          <>
                            <Play size={16} />
                            Slayt Gösterisi
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {/* Nokta göstergeleri */}
                  <div className="flex items-center justify-center gap-1.5 py-3 px-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSlideshowIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === slideshowIndex
                            ? "bg-emerald-600 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Görsel ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-gray-500 pb-2">
                    {slideshowIndex + 1} / {images.length}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 flex-wrap">
                <label className="flex-1 min-w-0 sm:min-w-[150px]">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 bg-white cursor-pointer hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                    <ImagePlus size={16} />
                    {selectedFiles?.length ? `${selectedFiles.length} dosya seçildi` : 'Dosya Seç'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                  />
                </label>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={uploading || !selectedFiles?.length}
                  icon={uploading ? null : Save}
                >
                  {uploading ? "Yükleniyor..." : "Yükle"}
                </Button>
              </div>
              
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  nav(`/seller/products/${storeProductId}/images`)
                }
                icon={Images}
              >
                Tüm Görselleri Yönet
                <ChevronRight size={16} />
              </Button>
            </div>
          </SectionCard>

          {/* 🟢 Satış Durumu */}
          <SectionCard title="Satış Durumu" icon={Settings}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${isOnSale ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'} flex items-center justify-center text-white shadow-lg`}>
                  <Package size={24} />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {isOnSale ? "Satışta" : "Pasif Durumda"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isOnSale ? "Ürün aktif olarak satılıyor" : "Ürün müşterilere görünmüyor"}
                  </div>
                </div>
              </div>
              <Button
                variant={isOnSale ? "danger" : "success"}
                disabled={!hasCoverage}
                onClick={() =>
                  handleAction(
                    () => toggleProductOnSale(storeProductId, !isOnSale),
                    isOnSale ? "🔴 Satış kapatıldı!" : "🟢 Satışa açıldı!"
                  )
                }
              >
                {isOnSale ? "Satışı Kapat" : "Satışa Aç"}
              </Button>
            </div>
            {!hasCoverage && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-amber-600 text-lg">⚠️</span>
                <p className="text-xs text-amber-700">
                  Satışa açmak için önce hizmet vereceğiniz bölgeleri tanımlamalısınız.
                </p>
              </div>
            )}
          </SectionCard>

        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: scale(0.95) translateY(-20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );

  return createPortal(panelContent, document.body);
};

export default ProductManagementPanel;
