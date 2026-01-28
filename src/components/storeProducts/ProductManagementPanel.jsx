// =============================
// ProductManagementPanel.jsx - Ultra Modern & Beautiful 🎨
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
import { 
  X, 
  ImagePlus, 
  Images, 
  ChevronRight, 
  Plus, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Save,
  Sparkles,
  Layers,
  Box
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
  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
    <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Icon size={18} />
          </div>
        )}
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-5">
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
      onFeedback("✅ Fiyat başarıyla eklendi!", "success");
      setShowAddPrice(false);
      setNewPrice({ currencyCode: "", unitPrice: "" });
      await loadProductPrices();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      onFeedback("❌ Fiyat eklenemedi!", "error");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Fixed blur overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-all"
        onClick={onClose}
      />
      
      {/* Panel - Centered and scrollable */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl overflow-hidden animate-[slideIn_0.35s_ease-out] flex flex-col">
        
        {/* ============ Ultra Modern Header ============ */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white p-6 shadow-xl flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:rotate-90"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Ürün Yönetimi</h2>
              <p className="text-emerald-100 text-sm">Detaylı düzenleme ve ayarlar</p>
            </div>
          </div>
        </div>

        {/* ============ Main Content ============ */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
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
            {showAddPrice && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-5 mb-4 space-y-4">
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
                <div className="flex gap-2 pt-2">
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
                      className="flex items-center justify-between bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:shadow-md transition-all"
                    >
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
                      <Badge variant="success">Aktif</Badge>
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

          {/* 📸 Ürün Görselleri */}
          <SectionCard title="Ürün Görselleri" icon={Images}>
            <div className="space-y-4">
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(0, 4).map((url, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={`${url}?v=${buster}`}
                        alt={`${product?.name || 'Ürün'} görseli ${i + 1}`}
                        className="w-full aspect-square rounded-xl object-cover border-2 border-gray-200 shadow-sm group-hover:shadow-lg transition-all"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">#{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 flex-wrap">
                <label className="flex-1 min-w-[150px]">
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
};

export default ProductManagementPanel;
