import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  addProductJson, 
  addProductExcel, 
  addProductXml, 
  addProductXmlFromUrl 
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
} from "lucide-react";

const ProductDraftUploadPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("excel"); // excel, json, xml, xml-url
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
      JSON.parse(jsonText);
      
      await addProductJson(jsonText);
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

  const tabs = [
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
          <button
            onClick={() => navigate("/seller/products/drafts")}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
            Geri Dön
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Upload size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                Toplu Ürün Yükleme
                <Sparkles size={24} className="text-yellow-300" />
              </h1>
              <p className="text-emerald-100 text-sm">
                Excel, JSON veya XML ile ürünlerinizi sisteme ekleyin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
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
          {/* Excel Upload */}
          {activeTab === "excel" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileSpreadsheet className="w-20 h-20 mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Excel Dosyası Yükle</h2>
                <p className="text-gray-600">
                  Excel formatında toplu ürün bilgilerinizi yükleyin
                </p>
              </div>

              {/* Download Template Button */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Örnek Şablon</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Ürün bilgilerinizi doğru formatta yüklemek için örnek Excel şablonunu indirin veya önizleyin
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
                        href="/templates/Tedarika_Urun_Sablon.xlsx"
                        download="Tedarika_Urun_Sablon.xlsx"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        İndir
                      </a>
                    </div>
                  </div>
                </div>
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
                  <p className="text-gray-600 mb-4">Excel şablonu aşağıdaki alanları içerir:</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left mb-6 max-w-4xl mx-auto">
                    {[
                      "İşlem Türü", "Ürün Kodu", "SKU", "Barkod", "Ürün Adı", "Açıklama",
                      "Kategori Yolu", "Marka", "Para Birimi", "Liste Fiyatı", "Satış Fiyatı", "KDV Oranı",
                      "Stok Adedi", "Stok Kodu", "Kargo Desi", "Ağırlık (Kg)", "En (Cm)", "Boy (Cm)",
                      "Yükseklik (Cm)", "Ana Görsel URL", "Ek Görsel URL (1-5)", "Varyant Özellikleri",
                      "Varyant Sıralama", "Garanti Süresi (Ay)", "Menşei", "Teslimat Süresi (Gün)",
                      "Minimum Sipariş Adedi", "Durum"
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
                href="/templates/Tedarika_Urun_Sablon.xlsx"
                download="Tedarika_Urun_Sablon.xlsx"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Download className="w-4 h-4" />
                Şablonu İndir
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDraftUploadPage;
