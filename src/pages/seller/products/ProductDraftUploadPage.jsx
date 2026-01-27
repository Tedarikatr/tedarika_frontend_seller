import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  addProductJson, 
  addProductExcel, 
  addProductXml, 
  addProductXmlFromUrl,
  addProductManual
} from "@/api/sellerProductDraftService";
import { useToast } from "@/contexts/ToastContext";
import {
  ArrowLeft,
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
} from "lucide-react";

const ProductDraftUploadPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("excel"); // excel, json, xml, xml-url, manual
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

  const tabs = [
    { key: "excel", label: "Excel", icon: FileSpreadsheet, color: "green" },
    { key: "json", label: "JSON", icon: FileCode, color: "blue" },
    { key: "xml", label: "XML Dosya", icon: FileText, color: "purple" },
    { key: "xml-url", label: "XML URL", icon: LinkIcon, color: "orange" },
    { key: "manual", label: "Manuel", icon: Package, color: "emerald" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <button
          onClick={() => navigate("/seller/products/drafts")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 text-sm"
        >
          <ArrowLeft size={16} />
          Geri Dön
        </button>
        <h1 className="text-xl font-bold text-gray-900">Ürün Yükleme</h1>
        <p className="text-gray-600 text-sm mt-1">
          Excel, JSON, XML veya manuel olarak ürünlerinizi yükleyin
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4">
        {/* Info Card */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-semibold mb-1">Önemli:</p>
              <ul className="space-y-0.5">
                <li>• Yüklenen ürünler önce incelemeye alınır</li>
                <li>• Onaylanan ürünler otomatik olarak mağazanıza eklenir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {/* Excel Upload */}
          {activeTab === "excel" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Excel Dosyası Yükle</h2>
                <p className="text-gray-600 text-sm">
                  Excel/CSV formatında ürün bilgilerinizi yükleyin
                </p>
              </div>

              {/* Download Template Button */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">Örnek Şablon</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => setShowTemplatePreview(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition"
                      >
                        <Eye className="w-3 h-3" />
                        Önizle
                      </button>
                      <a
                        href="/templates/Tedarika_Urun_Sablon.csv"
                        download="Tedarika_Urun_Sablon.csv"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-white rounded text-xs font-medium hover:bg-gray-800 transition"
                      >
                        <Download className="w-3 h-3" />
                        CSV İndir
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Excel Dosyası *
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                />
                {excelFile && (
                  <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {excelFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Yükleme Adı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={excelUploadName}
                  onChange={(e) => setExcelUploadName(e.target.value)}
                  placeholder="Örn: Ocak 2025 Ürünleri"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                />
              </div>

              <button
                onClick={handleExcelUpload}
                disabled={loading || !excelFile}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Excel Yükle
                  </>
                )}
              </button>
            </div>
          )}

          {/* JSON Upload */}
          {activeTab === "json" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">JSON Formatı</h2>
                <p className="text-gray-600 text-sm">
                  JSON formatında ürün bilgilerinizi girin
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  JSON İçeriği *
                </label>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='{"name": "Ürün Adı", "brand": "Marka", ...}'
                  rows={10}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 font-mono text-xs"
                />
              </div>

              <button
                onClick={handleJsonUpload}
                disabled={loading || !jsonText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    JSON Gönder
                  </>
                )}
              </button>
            </div>
          )}

          {/* XML File Upload */}
          {activeTab === "xml" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">XML Dosyası Yükle</h2>
                <p className="text-gray-600 text-sm">
                  XML formatında ürün bilgilerinizi yükleyin
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  XML Dosyası *
                </label>
                <input
                  type="file"
                  accept=".xml"
                  onChange={(e) => setXmlFile(e.target.files[0])}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                />
                {xmlFile && (
                  <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {xmlFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Yükleme Adı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={xmlUploadName}
                  onChange={(e) => setXmlUploadName(e.target.value)}
                  placeholder="Örn: Ocak 2025 Ürünleri"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                />
              </div>

              <button
                onClick={handleXmlUpload}
                disabled={loading || !xmlFile}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    XML Yükle
                  </>
                )}
              </button>
            </div>
          )}

          {/* XML URL Upload */}
          {activeTab === "xml-url" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">XML URL ile Yükle</h2>
                <p className="text-gray-600 text-sm">
                  XML dosyanızın URL'ini girerek yükleyin
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  XML URL *
                </label>
                <input
                  type="url"
                  value={xmlUrl}
                  onChange={(e) => setXmlUrl(e.target.value)}
                  placeholder="https://example.com/products.xml"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Yükleme Adı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={xmlUrlUploadName}
                  onChange={(e) => setXmlUrlUploadName(e.target.value)}
                  placeholder="Örn: API Entegrasyonu"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kullanıcı Adı (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={xmlUsername}
                    onChange={(e) => setXmlUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Şifre (Opsiyonel)
                  </label>
                  <input
                    type="password"
                    value={xmlPassword}
                    onChange={(e) => setXmlPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleXmlUrlUpload}
                disabled={loading || !xmlUrl.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    XML URL İşle
                  </>
                )}
              </button>
            </div>
          )}

          {/* Manual Upload */}
          {activeTab === "manual" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Manuel Ürün Yükleme</h2>
                <p className="text-gray-600 text-sm">
                  Excel, JSON veya XML olmadan doğrudan ürün bilgilerinizi girin
                </p>
              </div>

              {/* Draft Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Yükleme Adı (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Örn: Ocak 2025 Ürünleri"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                />
              </div>

              {/* Products */}
              <div className="space-y-4">
                {products.map((product, productIndex) => (
                  <div key={productIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">Ürün {productIndex + 1}</h3>
                      {products.length > 1 && (
                        <button
                          onClick={() => removeProduct(productIndex)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Basic Info */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Ürün Adı *
                        </label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(productIndex, "name", e.target.value)}
                          placeholder="Ürün adı"
                          className="w-full px-2.5 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          SKU *
                        </label>
                        <input
                          type="text"
                          value={product.sku}
                          onChange={(e) => updateProduct(productIndex, "sku", e.target.value)}
                          placeholder="SKU-001"
                          className="w-full px-2.5 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          EAN
                        </label>
                        <input
                          type="text"
                          value={product.ean}
                          onChange={(e) => updateProduct(productIndex, "ean", e.target.value)}
                          placeholder="1234567890123"
                          className="w-full px-2.5 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Marka Adı
                        </label>
                        <input
                          type="text"
                          value={product.brandName}
                          onChange={(e) => updateProduct(productIndex, "brandName", e.target.value)}
                          placeholder="Marka adı"
                          className="w-full px-2.5 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Açıklama
                        </label>
                        <textarea
                          value={product.description}
                          onChange={(e) => updateProduct(productIndex, "description", e.target.value)}
                          placeholder="Ürün açıklaması"
                          rows={2}
                          className="w-full px-2.5 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                        />
                      </div>

                      {/* Store Info */}
                      <div className="sm:col-span-2 border-t pt-3 mt-3">
                        <h4 className="text-xs font-semibold text-gray-900 mb-2">Mağaza Bilgileri</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Birim Türü *
                            </label>
                            <input
                              type="number"
                              value={product.store.unitType}
                              onChange={(e) => updateProduct(productIndex, "store.unitType", parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Stok *
                            </label>
                            <input
                              type="number"
                              value={product.store.stockQuantity}
                              onChange={(e) => updateProduct(productIndex, "store.stockQuantity", parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Min. Sipariş *
                            </label>
                            <input
                              type="number"
                              value={product.store.minOrderQuantity}
                              onChange={(e) => updateProduct(productIndex, "store.minOrderQuantity", parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Birim Fiyat *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.store.unitPrice}
                              onChange={(e) => updateProduct(productIndex, "store.unitPrice", parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Para Birimi *
                            </label>
                            <input
                              type="text"
                              value={product.store.currencyCode}
                              onChange={(e) => updateProduct(productIndex, "store.currencyCode", e.target.value)}
                              placeholder="TRY"
                              className="w-full px-2 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Image URLs */}
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-medium text-gray-700">
                            Görsel URL'leri
                          </label>
                          <button
                            type="button"
                            onClick={() => addImageUrl(productIndex)}
                            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Ekle
                          </button>
                        </div>
                        {product.imageUrls && product.imageUrls.map((url, urlIndex) => (
                          <div key={urlIndex} className="flex gap-1.5 mb-1.5">
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => updateImageUrl(productIndex, urlIndex, e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="flex-1 px-2 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => removeImageUrl(productIndex, urlIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Color Variants */}
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-medium text-gray-700">
                            Renk Varyantları
                          </label>
                          <button
                            type="button"
                            onClick={() => addColorVariant(productIndex)}
                            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Ekle
                          </button>
                        </div>
                        {product.colorVariants && product.colorVariants.map((variant, variantIndex) => (
                          <div key={variantIndex} className="flex gap-1.5 mb-1.5">
                            <input
                              type="text"
                              value={variant}
                              onChange={(e) => updateColorVariant(productIndex, variantIndex, e.target.value)}
                              placeholder="Renk Beyaz"
                              className="flex-1 px-2 py-1.5 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => removeColorVariant(productIndex, variantIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
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
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
              >
                <Plus className="w-4 h-4" />
                Yeni Ürün Ekle
              </button>

              {/* Submit Button */}
              <button
                onClick={handleManualUpload}
                disabled={loading || products.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Ürünleri Yükle
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {showTemplatePreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-white" />
                <h2 className="text-base font-semibold text-white">Örnek Şablon</h2>
              </div>
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4">
              <div className="mb-3 bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-xs text-blue-800">
                  <strong>Not:</strong> Bu şablonda örnek ürün verileri bulunmaktadır. Kendi ürünlerinizin bilgilerini aynı format ile doldurarak yükleyebilirsiniz.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="bg-white rounded p-4 text-center">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Tedarika Ürün Şablonu</h3>
                  <p className="text-gray-600 text-sm mb-3">Şablon aşağıdaki alanları içerir:</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left mb-4">
                    {[
                      "UrunAdi*", "Aciklama", "SKU*", "EAN*", "MarkaId", "MarkaAdi",
                      "KategoriId", "AltKategoriId", "GTIP", "Gorsel1Url", "Gorsel2Url", "Gorsel3Url",
                      "Gorsel4Url", "BirimTipi*", "StokAdedi*", "MinSiparisAdedi", "MaxSiparisAdedi",
                      "BirimFiyat*", "ParaBirimi*"
                    ].map((field, idx) => (
                      <div key={idx} className="bg-gray-50 px-2 py-1.5 rounded text-xs text-gray-700 border border-gray-200">
                        ✓ {field}
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-left">
                    <p className="text-xs text-yellow-800">
                      <strong>💡 İpucu:</strong> Şablonu indirdikten sonra Excel ile açın ve örnek verileri inceleyerek kendi ürünlerinizi ekleyin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="px-3 py-1.5 text-gray-700 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Kapat
              </button>
              <a
                href="/templates/Tedarika_Urun_Sablon.csv"
                download="Tedarika_Urun_Sablon.csv"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition"
              >
                <Download className="w-3.5 h-3.5" />
                CSV İndir
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDraftUploadPage;
