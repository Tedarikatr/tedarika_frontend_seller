import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  addProductJson, 
  addProductExcel, 
  addProductXml, 
  addProductXmlFromUrl,
  addProductManual,
  fetchProductDrafts
} from "@/api/sellerProductDraftService";
import { useToast } from "@/contexts/ToastContext";
import {
  FileSpreadsheet,
  FileCode,
  Upload,
  Loader2,
  Link as LinkIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Download,
  Eye,
  Plus,
  X,
  Package,
  ChevronRight,
} from "lucide-react";

const ProductDraftUploadPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("manual"); // manual, excel, json, xml, xml-url
  const [showHistory, setShowHistory] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);

  // Excel State
  const [excelFile, setExcelFile] = useState(null);
  const [excelUploadName, setExcelUploadName] = useState("");

  // JSON State
  const [jsonText, setJsonText] = useState("");

  // XML File State
  const [xmlFile, setXmlFile] = useState(null);
  const [xmlUploadName, setXmlUploadName] = useState("");

  // XML URL State
  const [xmlUrl, setXmlUrl] = useState("");
  const [xmlUrlUploadName, setXmlUrlUploadName] = useState("");
  const [xmlUsername, setXmlUsername] = useState("");
  const [xmlPassword, setXmlPassword] = useState("");

  // Manual State
  const [draftName, setDraftName] = useState("");
  const [products, setProducts] = useState([
    {
      name: "",
      sku: "",
      ean: "",
      brandId: "",
      brandName: "",
      categoryId: "",
      categorySubId: "",
      gtip: "",
      description: "",
      preparationTime: "",
      expirationDate: "",
      store: {
        unitType: 0,
        stockQuantity: 0,
        minOrderQuantity: 1,
        maxOrderQuantity: "",
        unitPrice: 0,
        currencyCode: "TRY",
        mainProductCode: "",
        stockCode: "",
        criticalStock: "",
        width: "",
        length: "",
        height: "",
        weight: "",
        volumeWeight: "",
      },
      imageUrls: [],
      colorVariants: [],
    },
  ]);

  const handleExcelUpload = async () => {
    if (!excelFile) {
      toast.error("Lütfen bir Excel dosyası seçin");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ExcelFile", excelFile);
      if (excelUploadName) formData.append("UploadName", excelUploadName);

      await addProductExcel(formData);
      toast.success("Excel dosyası başarıyla yüklendi!");
      navigate("/seller/products/drafts");
    } catch (err) {
      console.error("Excel yüklenemedi:", err);
      toast.error(`Excel yüklenemedi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleJsonUpload = async () => {
    if (!jsonText.trim()) {
      toast.error("Lütfen JSON içeriğini girin");
      return;
    }

    setLoading(true);
    try {
      // Validate JSON
      const parsedJson = JSON.parse(jsonText);

      await addProductJson(parsedJson);
      toast.success("JSON başarıyla gönderildi!");
      navigate("/seller/products/drafts");
    } catch (err) {
      console.error("JSON gönderilemedi:", err);
      if (err instanceof SyntaxError) {
        toast.error("Geçersiz JSON formatı");
      } else {
        toast.error(`JSON gönderilemedi: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleXmlUpload = async () => {
    if (!xmlFile) {
      toast.error("Lütfen bir XML dosyası seçin");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("XmlFile", xmlFile);
      if (xmlUploadName) formData.append("UploadName", xmlUploadName);

      await addProductXml(formData);
      toast.success("XML dosyası başarıyla yüklendi!");
      navigate("/seller/products/drafts");
    } catch (err) {
      console.error("XML yüklenemedi:", err);
      toast.error(`XML yüklenemedi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleXmlUrlUpload = async () => {
    if (!xmlUrl.trim()) {
      toast.error("Lütfen XML URL'i girin");
      return;
    }

    setLoading(true);
    try {
      await addProductXmlFromUrl({
        xmlUrl,
        uploadName: xmlUrlUploadName || undefined,
        username: xmlUsername || undefined,
        password: xmlPassword || undefined,
      });
      toast.success("XML URL başarıyla işlendi!");
      navigate("/seller/products/drafts");
    } catch (err) {
      console.error("XML URL işlenemedi:", err);
      toast.error(`XML URL işlenemedi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualUpload = async () => {
    // Validate products
    const validProducts = products.filter(
      (p) => p.name && p.sku && p.store.stockQuantity > 0 && p.store.unitPrice > 0
    );

    if (validProducts.length === 0) {
      toast.error("En az bir geçerli ürün bilgisi gereklidir.");
      return;
    }

    setLoading(true);
    try {
      // Clean up empty fields
      const cleanedProducts = validProducts.map((product) => {
        const cleaned = { ...product };
        
        // Clean store object
        const cleanedStore = { ...cleaned.store };
        if (cleanedStore.maxOrderQuantity === "") delete cleanedStore.maxOrderQuantity;
        if (cleanedStore.mainProductCode === "") delete cleanedStore.mainProductCode;
        if (cleanedStore.stockCode === "") delete cleanedStore.stockCode;
        if (cleanedStore.criticalStock === "") delete cleanedStore.criticalStock;
        if (cleanedStore.width === "") delete cleanedStore.width;
        if (cleanedStore.length === "") delete cleanedStore.length;
        if (cleanedStore.height === "") delete cleanedStore.height;
        if (cleanedStore.weight === "") delete cleanedStore.weight;
        if (cleanedStore.volumeWeight === "") delete cleanedStore.volumeWeight;
        
        cleaned.store = cleanedStore;
        
        // Remove empty optional fields
        if (!cleaned.ean) delete cleaned.ean;
        if (!cleaned.brandId) delete cleaned.brandId;
        if (!cleaned.brandName) delete cleaned.brandName;
        if (!cleaned.categoryId) delete cleaned.categoryId;
        if (!cleaned.categorySubId) delete cleaned.categorySubId;
        if (!cleaned.gtip) delete cleaned.gtip;
        if (!cleaned.description) delete cleaned.description;
        if (!cleaned.preparationTime) delete cleaned.preparationTime;
        if (!cleaned.expirationDate) delete cleaned.expirationDate;
        if (!cleaned.imageUrls || cleaned.imageUrls.length === 0) delete cleaned.imageUrls;
        if (!cleaned.colorVariants || cleaned.colorVariants.length === 0) delete cleaned.colorVariants;
        
        return cleaned;
      });

      const payload = {
        ...(draftName && { draftName }),
        products: cleanedProducts,
      };

      await addProductManual(payload);
      toast.success("Ürünler başarıyla yüklendi!");
      navigate("/seller/products/drafts");
    } catch (err) {
      console.error("Manuel yükleme başarısız:", err);
      toast.error(`Ürünler yüklenemedi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        name: "",
        sku: "",
        ean: "",
        brandId: "",
        brandName: "",
        categoryId: "",
        categorySubId: "",
        gtip: "",
        description: "",
        preparationTime: "",
        expirationDate: "",
        store: {
          unitType: 0,
          stockQuantity: 0,
          minOrderQuantity: 1,
          maxOrderQuantity: "",
          unitPrice: 0,
          currencyCode: "TRY",
          mainProductCode: "",
          stockCode: "",
          criticalStock: "",
          width: "",
          length: "",
          height: "",
          weight: "",
          volumeWeight: "",
        },
        imageUrls: [],
        colorVariants: [],
      },
    ]);
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index, field, value) => {
    const updated = [...products];
    if (field.startsWith("store.")) {
      const storeField = field.replace("store.", "");
      updated[index].store[storeField] = value;
    } else {
      updated[index][field] = value;
    }
    setProducts(updated);
  };

  const addImageUrl = (productIndex) => {
    const updated = [...products];
    if (!updated[productIndex].imageUrls) {
      updated[productIndex].imageUrls = [];
    }
    updated[productIndex].imageUrls.push("");
    setProducts(updated);
  };

  const updateImageUrl = (productIndex, imageIndex, value) => {
    const updated = [...products];
    updated[productIndex].imageUrls[imageIndex] = value;
    setProducts(updated);
  };

  const removeImageUrl = (productIndex, imageIndex) => {
    const updated = [...products];
    updated[productIndex].imageUrls = updated[productIndex].imageUrls.filter((_, i) => i !== imageIndex);
    setProducts(updated);
  };

  const addColorVariant = (productIndex) => {
    const updated = [...products];
    if (!updated[productIndex].colorVariants) {
      updated[productIndex].colorVariants = [];
    }
    updated[productIndex].colorVariants.push("");
    setProducts(updated);
  };

  const updateColorVariant = (productIndex, variantIndex, value) => {
    const updated = [...products];
    updated[productIndex].colorVariants[variantIndex] = value;
    setProducts(updated);
  };

  const removeColorVariant = (productIndex, variantIndex) => {
    const updated = [...products];
    updated[productIndex].colorVariants = updated[productIndex].colorVariants.filter((_, i) => i !== variantIndex);
    setProducts(updated);
  };

  const loadDrafts = async () => {
    setLoadingDrafts(true);
    try {
      const data = await fetchProductDrafts();
      setDrafts(data || []);
    } catch (err) {
      console.error("Yüklemeler yüklenemedi:", err);
    } finally {
      setLoadingDrafts(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      loadDrafts();
    }
  }, [showHistory]);

  const tabs = [
    { key: "manual", label: "Manuel", icon: Package, color: "emerald" },
    { key: "excel", label: "Excel", icon: FileSpreadsheet, color: "green" },
    { key: "json", label: "JSON", icon: FileCode, color: "blue" },
    { key: "xml", label: "XML Dosya", icon: FileText, color: "purple" },
    { key: "xml-url", label: "XML URL", icon: LinkIcon, color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Upload size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                  Ürün Yükleme
                  <Sparkles size={24} className="text-yellow-300" />
                </h1>
                <p className="text-emerald-100 text-sm">
                  Excel, JSON, XML veya manuel olarak ürünlerinizi sisteme ekleyin
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition-all border border-white/30"
            >
              <FileText className="w-5 h-5" />
              Geçmiş Yüklemeler
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Geçmiş Yüklemeler Bölümü */}
        {showHistory && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Geçmiş Yüklemeler</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {loadingDrafts ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Yükleniyor...</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm mb-4">Henüz yükleme yok</p>
                <button
                  onClick={() => navigate("/seller/products/drafts")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                >
                  Tüm Yüklemeleri Görüntüle
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {drafts.slice(0, 5).map((draft) => (
                  <div
                    key={draft.id}
                    onClick={() => navigate(`/seller/products/drafts/${draft.id}`)}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {draft.name || "İsimsiz Yükleme"}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>{draft.productCount} ürün</span>
                          <span>•</span>
                          <span>{new Date(draft.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
                {drafts.length > 5 && (
                  <div className="pt-3 border-t">
                    <button
                      onClick={() => navigate("/seller/products/drafts")}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                    >
                      Tüm Yüklemeleri Görüntüle ({drafts.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Önemli Bilgiler</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Yüklenen ürünler önce incelemeye alınır</li>
                <li>• Onaylanan ürünler otomatik olarak mağazanıza eklenir</li>
                <li>• Geçersiz formatlar reddedilir ve size bildirilir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.key
                    ? `bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-700 text-white shadow-lg scale-105`
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-8">
          {/* Manual Upload - İlk sırada */}
          {activeTab === "manual" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Package className="w-20 h-20 mx-auto text-emerald-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Manuel Ürün Yükleme</h2>
                <p className="text-gray-600">
                  Excel, JSON veya XML olmadan doğrudan ürün bilgilerinizi girin
                </p>
              </div>

              {/* Draft Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Yükleme Adı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Örn: Ocak 2025 Ürünleri"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* Products */}
              <div className="space-y-6">
                {products.map((product, productIndex) => (
                  <div key={productIndex} className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Ürün {productIndex + 1}</h3>
                      {products.length > 1 && (
                        <button
                          onClick={() => removeProduct(productIndex)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Basic Info */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Ürün Adı *
                        </label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(productIndex, "name", e.target.value)}
                          placeholder="Ürün adı"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          SKU *
                        </label>
                        <input
                          type="text"
                          value={product.sku}
                          onChange={(e) => updateProduct(productIndex, "sku", e.target.value)}
                          placeholder="SKU-001"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          EAN
                        </label>
                        <input
                          type="text"
                          value={product.ean}
                          onChange={(e) => updateProduct(productIndex, "ean", e.target.value)}
                          placeholder="1234567890123"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Marka Adı
                        </label>
                        <input
                          type="text"
                          value={product.brandName}
                          onChange={(e) => updateProduct(productIndex, "brandName", e.target.value)}
                          placeholder="Marka adı"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Açıklama
                        </label>
                        <textarea
                          value={product.description}
                          onChange={(e) => updateProduct(productIndex, "description", e.target.value)}
                          placeholder="Ürün açıklaması"
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      {/* Store Info */}
                      <div className="md:col-span-2 border-t pt-4 mt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Mağaza Bilgileri</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Birim Türü *
                            </label>
                            <input
                              type="number"
                              value={product.store.unitType}
                              onChange={(e) => updateProduct(productIndex, "store.unitType", parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Stok Miktarı *
                            </label>
                            <input
                              type="number"
                              value={product.store.stockQuantity}
                              onChange={(e) => updateProduct(productIndex, "store.stockQuantity", parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Min. Sipariş *
                            </label>
                            <input
                              type="number"
                              value={product.store.minOrderQuantity}
                              onChange={(e) => updateProduct(productIndex, "store.minOrderQuantity", parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Birim Fiyat *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.store.unitPrice}
                              onChange={(e) => updateProduct(productIndex, "store.unitPrice", parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Para Birimi *
                            </label>
                            <input
                              type="text"
                              value={product.store.currencyCode}
                              onChange={(e) => updateProduct(productIndex, "store.currencyCode", e.target.value)}
                              placeholder="TRY"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Image URLs */}
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Görsel URL'leri
                          </label>
                          <button
                            type="button"
                            onClick={() => addImageUrl(productIndex)}
                            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Ekle
                          </button>
                        </div>
                        {product.imageUrls && product.imageUrls.map((url, urlIndex) => (
                          <div key={urlIndex} className="flex gap-2 mb-2">
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => updateImageUrl(productIndex, urlIndex, e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                            <button
                              type="button"
                              onClick={() => removeImageUrl(productIndex, urlIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Color Variants */}
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Renk Varyantları
                          </label>
                          <button
                            type="button"
                            onClick={() => addColorVariant(productIndex)}
                            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Ekle
                          </button>
                        </div>
                        {product.colorVariants && product.colorVariants.map((variant, variantIndex) => (
                          <div key={variantIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={variant}
                              onChange={(e) => updateColorVariant(productIndex, variantIndex, e.target.value)}
                              placeholder="Renk Beyaz"
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                            <button
                              type="button"
                              onClick={() => removeColorVariant(productIndex, variantIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Product Button */}
              <button
                onClick={addProduct}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition"
              >
                <Plus className="w-5 h-5" />
                Yeni Ürün Ekle
              </button>

              {/* Submit Button */}
              <button
                onClick={handleManualUpload}
                disabled={loading || products.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Ürünleri Yükle
                  </>
                )}
              </button>
            </div>
          )}

          {/* Excel Upload */}
          {activeTab === "excel" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileSpreadsheet className="w-20 h-20 mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Excel Dosyası Yükle</h2>
                <p className="text-gray-600">
                  Excel/CSV formatında toplu ürün bilgilerinizi yükleyin
                </p>
              </div>

              {/* Download Template Button */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Örnek Şablon</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Ürün bilgilerinizi doğru formatta yüklemek için örnek şablonu indirin veya önizleyin
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowTemplatePreview(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        Önizle
                      </button>
                      <a
                        href="/templates/Tedarika_Urun_Sablon.csv"
                        download="Tedarika_Urun_Sablon.csv"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        CSV İndir
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm text-emerald-900 font-semibold mb-2">
                  Güncel başlıklar (sıralama birebir aynı olmalı):
                </p>
                <p className="text-xs text-emerald-800 font-mono break-words">
                  UrunAdi*	Aciklama	SKU*	EAN*	MarkaId	MarkaAdi	KategoriId	AltKategoriId	GTIP	Gorsel1Url	Gorsel2Url	Gorsel3Url	Gorsel4Url	BirimTipi*	StokAdedi*	MinSiparisAdedi	MaxSiparisAdedi	BirimFiyat*	ParaBirimi*
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Excel Dosyası *
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                />
                {excelFile && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {excelFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Yükleme Adı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={excelUploadName}
                  onChange={(e) => setExcelUploadName(e.target.value)}
                  placeholder="Örn: Ocak 2025 Ürünleri"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                />
              </div>

              <button
                onClick={handleExcelUpload}
                disabled={loading || !excelFile}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Excel Yükle
                  </>
                )}
              </button>
            </div>
          )}

          {/* JSON Upload */}
          {activeTab === "json" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileCode className="w-20 h-20 mx-auto text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">JSON Formatı</h2>
                <p className="text-gray-600">
                  JSON formatında ürün bilgilerinizi girin
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  JSON İçeriği *
                </label>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='{"name": "Ürün Adı", "brand": "Marka", ...}'
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-mono text-sm"
                />
              </div>

              <button
                onClick={handleJsonUpload}
                disabled={loading || !jsonText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    JSON Gönder
                  </>
                )}
              </button>
            </div>
          )}

          {/* XML File Upload */}
          {activeTab === "xml" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-20 h-20 mx-auto text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">XML Dosyası Yükle</h2>
                <p className="text-gray-600">
                  XML formatında ürün bilgilerinizi yükleyin
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  XML Dosyası *
                </label>
                <input
                  type="file"
                  accept=".xml"
                  onChange={(e) => setXmlFile(e.target.files[0])}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                />
                {xmlFile && (
                  <p className="mt-2 text-sm text-purple-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {xmlFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Yükleme Adı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={xmlUploadName}
                  onChange={(e) => setXmlUploadName(e.target.value)}
                  placeholder="Örn: Ocak 2025 Ürünleri"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                />
              </div>

              <button
                onClick={handleXmlUpload}
                disabled={loading || !xmlFile}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    XML Yükle
                  </>
                )}
              </button>
            </div>
          )}

          {/* XML URL Upload */}
          {activeTab === "xml-url" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <LinkIcon className="w-20 h-20 mx-auto text-orange-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">XML URL ile Yükle</h2>
                <p className="text-gray-600">
                  XML dosyanızın URL'ini girerek yükleyin
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  XML URL *
                </label>
                <input
                  type="url"
                  value={xmlUrl}
                  onChange={(e) => setXmlUrl(e.target.value)}
                  placeholder="https://example.com/products.xml"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Yükleme Adı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={xmlUrlUploadName}
                  onChange={(e) => setXmlUrlUploadName(e.target.value)}
                  placeholder="Örn: API Entegrasyonu"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kullanıcı Adı (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={xmlUsername}
                    onChange={(e) => setXmlUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Şifre (Opsiyonel)
                  </label>
                  <input
                    type="password"
                    value={xmlPassword}
                    onChange={(e) => setXmlPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleXmlUrlUpload}
                disabled={loading || !xmlUrl.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    XML URL İşle
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {showTemplatePreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Örnek Şablon Önizleme</h2>
              </div>
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Not:</strong> Bu şablonda örnek ürün verileri bulunmaktadır. Kendi ürünlerinizin bilgilerini aynı format ile doldurarak yükleyebilirsiniz.
                </p>
              </div>

              <div className="overflow-x-auto bg-gray-50 p-6 rounded-lg">
                <div className="bg-white rounded-lg p-8 text-center">
                  <FileSpreadsheet className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tedarika Ürün Şablonu</h3>
                  <p className="text-gray-600 mb-4">Şablon aşağıdaki alanları içerir:</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left mb-6 max-w-4xl mx-auto">
                    {[
                      "UrunAdi*", "Aciklama", "SKU*", "EAN*", "MarkaId", "MarkaAdi",
                      "KategoriId", "AltKategoriId", "GTIP", "Gorsel1Url", "Gorsel2Url", "Gorsel3Url",
                      "Gorsel4Url", "BirimTipi*", "StokAdedi*", "MinSiparisAdedi", "MaxSiparisAdedi",
                      "BirimFiyat*", "ParaBirimi*"
                    ].map((field, idx) => (
                      <div key={idx} className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-700 border border-gray-200">
                        ✓ {field}
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 İpucu:</strong> Şablonu indirdikten sonra Excel ile açın ve örnek verileri inceleyerek kendi ürünlerinizi ekleyin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Kapat
              </button>
              <a
                href="/templates/Tedarika_Urun_Sablon.csv"
                download="Tedarika_Urun_Sablon.csv"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Download className="w-4 h-4" />
                CSV Şablonu İndir
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDraftUploadPage;
