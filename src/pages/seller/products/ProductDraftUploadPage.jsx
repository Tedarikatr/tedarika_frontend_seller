import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  addProductJson, 
  addProductExcel, 
  addProductXml, 
  addProductXmlFromUrl,
  addProductManual,
  fetchProductDrafts
} from "@/api/sellerProductDraftService";
import { getCategoriesWithSubCategories } from "@/api/categoryService";
import { getBrandList } from "@/api/brandservice";
import { UNIT_TYPE_OPTIONS } from "@/constants/unitTypes";
import { getUploadProgress } from "@/utils/getUploadProgress";
import { useProductUploadNotifications } from "@/hooks/useProductUploadNotifications";
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
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

// Tedarika_Urun_Yukleme_Sablon_guncel.xlsx ile birebir aynı sıralama
const EXCEL_TEMPLATE_HEADERS = [
  "UrunAdi*", "Sku", "Ean", "Gtip", "Marka", "MarkaAdi", "MarkaId", "Aciklama",
  "KategoriId", "KategoriSubId", "HazirlamaSuresiGun", "SonKullanmaTarihi",
  "Gorsel1Url", "Gorsel2Url", "Gorsel3Url", "Gorsel4Url",
  "BirimTipi", "StokAdedi", "MinSiparisAdedi", "MaxSiparisAdedi",
  "BirimFiyat", "ParaBirimi", "AnaUrunKodu", "StokKodu", "KritikStok",
  "Genislik", "Uzunluk", "Yukseklik", "Agirlik", "HacimAgirlik", "RenkVaryantlari"
];

const EXCEL_TEMPLATE_PATH = "/templates/Tedarika_Urun_Yukleme_Sablon_guncel.xlsx";

const BG_UPLOAD_MSG = "İşlem arka planda devam ediyor. Lütfen sayfayı kapatmayın.";

// API limitleri (SellerProductDraftController dokümantasyonu)
const EXCEL_MAX_SIZE_MB = 50;
const EXCEL_ALLOWED_EXT = [".xlsx", ".xls"];
const EXCEL_FORBIDDEN_EXT = [".xlsm", ".xla"]; // Makro içeren
const XML_MAX_SIZE_MB = 30;
const JSON_MAX_CHARS = 2_000_000;
const JSON_MAX_ROWS = 10_000;

const ProductDraftUploadPage = () => {
  const navigate = useNavigate();
  const toast = useToast(); // Sayfa yükleme hataları (kategori, marka) için
  const {
    notifySuccess,
    notifyError,
    notifyValidationError,
    notifyInfo,
    notifyManualResult,
    notifySingleProductError,
  } = useProductUploadNotifications();
  const mountedRef = useRef(true);
  const [activeTab, setActiveTab] = useState("manual"); // manual, excel, json, xml, xml-url
  const [showHistory, setShowHistory] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  // Ortak yükleme state - tek state ile progress bar ve buton kontrolü
  const [uploadState, setUploadState] = useState({ active: false, type: null }); // type: 'excel'|'xml'|'json'|'xml-url'|null
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100, process bar
  const isUploading = uploadState.active;
  const uploadType = uploadState.type;
  const [loadingManual, setLoadingManual] = useState(false);
  const [uploadSuccessModal, setUploadSuccessModal] = useState(null); // { type, productCount?, message }

  useEffect(() => () => { mountedRef.current = false; }, []);
  
  // Category State
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Brand State
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Excel State
  const [excelFile, setExcelFile] = useState(null);
  const [excelUploadName, setExcelUploadName] = useState("");
  const [excelResetKey, setExcelResetKey] = useState(0);

  // JSON State
  const [jsonText, setJsonText] = useState("");

  // XML File State
  const [xmlFile, setXmlFile] = useState(null);
  const [xmlUploadName, setXmlUploadName] = useState("");
  const [xmlResetKey, setXmlResetKey] = useState(0);

  // XML URL State (API: sadece xmlUrl ve uploadName)
  const [xmlUrl, setXmlUrl] = useState("");
  const [xmlUrlUploadName, setXmlUrlUploadName] = useState("");

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
        stockQuantity: "",
        minOrderQuantity: "",
        maxOrderQuantity: "",
        unitPrice: "",
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
      images: [], // File array - görseller dosya olarak yüklenecek
      colorVariants: [],
    },
  ]);

  const handleDownloadCsvTemplate = () => {
    const BOM = "\uFEFF";
    const headerRow = EXCEL_TEMPLATE_HEADERS.join("\t");
    const csvContent = BOM + headerRow + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tedarika_Urun_Yukleme_Sablon.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Ortak yükleme handler - Excel, XML, JSON, XML URL için tek yapı
  const runBulkUpload = async ({ type, apiCall, onErrorReset }) => {
    setUploadState({ active: true, type });
    setUploadProgress(getUploadProgress("validating"));
    if (type !== "json") notifyInfo({ message: BG_UPLOAD_MSG });

    try {
      setUploadProgress(getUploadProgress("uploading", 50)); // fetch ile gerçek progress yok
      const response = await apiCall();
      setUploadProgress(getUploadProgress("processing"));
      // API response: { count, message, draftId, approvalStats }
      const productCount = response?.count ?? response?.productCount ?? response?.processedCount ?? response?.totalProcessed;
      const successMessage = response?.message ?? (productCount != null ? `${productCount} ürün başarıyla yüklendi.` : "Yükleme tamamlandı.");

      if (mountedRef.current) {
        setUploadSuccessModal({ type, productCount, message: successMessage });
        notifySuccess({
          message: successMessage,
          productCount,
          draftId: response?.draftId,
          uploadType: type,
        });
      }
      setUploadProgress(getUploadProgress("done"));
    } catch (err) {
      setUploadProgress(getUploadProgress("error"));
      setUploadState({ active: false, type: null });
      if (onErrorReset) onErrorReset();
      const msg = err?.message || "Beklenmeyen hata";
      const errorMessage = type === "excel" ? `Excel yüklenemedi: ${msg}` :
        type === "xml" ? `XML yüklenemedi: ${msg}` :
        type === "xml-url" ? `XML URL işlenemedi: ${msg}` :
        err instanceof SyntaxError ? "Geçersiz JSON formatı" : `JSON gönderilemedi: ${msg}`;
      notifyError({ message: errorMessage, uploadType: type, errorDetail: msg });
      console.error(`${type} yükleme hatası:`, err);
    } finally {
      setUploadState({ active: false, type: null });
      setUploadProgress(0);
    }
  };

  const handleExcelUpload = () => {
    if (!excelFile) {
      notifyValidationError({ message: "Lütfen bir Excel dosyası seçin", uploadType: "excel", field: "file" });
      return;
    }
    // API validasyonu: 50MB, sadece .xlsx/.xls, makro (.xlsm/.xla) reddet
    const maxSize = EXCEL_MAX_SIZE_MB * 1024 * 1024;
    if (excelFile.size > maxSize) {
      notifyValidationError({ message: `Excel dosyası boyutu ${EXCEL_MAX_SIZE_MB} MB limitini aşıyor.`, uploadType: "excel", field: "size" });
      return;
    }
    const ext = "." + (excelFile.name.split(".").pop() || "").toLowerCase();
    if (EXCEL_FORBIDDEN_EXT.includes(ext)) {
      notifyValidationError({ message: "Makro içeren Excel dosyaları kabul edilmiyor.", uploadType: "excel", field: "format" });
      return;
    }
    if (!EXCEL_ALLOWED_EXT.includes(ext)) {
      notifyValidationError({ message: "Desteklenmeyen Excel dosya formatı. İzin verilen: .xlsx, .xls", uploadType: "excel", field: "format" });
      return;
    }
    runBulkUpload({
      type: "excel",
      apiCall: async () => {
        const formData = new FormData();
        formData.append("ExcelFile", excelFile);
        if (excelUploadName) formData.append("UploadName", excelUploadName);
        return addProductExcel(formData);
      },
      onErrorReset: () => {
        setExcelFile(null);
        setExcelUploadName("");
        setExcelResetKey((k) => k + 1);
      },
    });
  };

  const handleJsonUpload = () => {
    if (!jsonText.trim()) {
      notifyValidationError({ message: "Lütfen JSON içeriğini girin", uploadType: "json", field: "content" });
      return;
    }
    // API validasyonu: 2M karakter, kök dizi, 10000 satır
    if (jsonText.length > JSON_MAX_CHARS) {
      notifyValidationError({ message: `JSON gövdesi ${(JSON_MAX_CHARS / 1_000_000).toFixed(0)}.000.000 karakter limitini aşıyor.`, uploadType: "json", field: "size" });
      return;
    }
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch {
      notifyValidationError({ message: "Geçersiz JSON formatı.", uploadType: "json", field: "format" });
      return;
    }
    if (!Array.isArray(parsedJson)) {
      notifyValidationError({ message: "JSON kökü bir dizi olmalıdır.", uploadType: "json", field: "structure" });
      return;
    }
    if (parsedJson.length > JSON_MAX_ROWS) {
      notifyValidationError({ message: `Toplu yükleme ${JSON_MAX_ROWS} satır sınırını aşıyor.`, uploadType: "json", field: "rows" });
      return;
    }
    runBulkUpload({
      type: "json",
      apiCall: () => addProductJson(parsedJson),
    });
  };

  const handleXmlUpload = () => {
    if (!xmlFile) {
      notifyValidationError({ message: "Lütfen bir XML dosyası seçin", uploadType: "xml", field: "file" });
      return;
    }
    // API validasyonu: 30MB, sadece .xml
    const maxSize = XML_MAX_SIZE_MB * 1024 * 1024;
    if (xmlFile.size > maxSize) {
      notifyValidationError({ message: `XML dosyası boyutu ${XML_MAX_SIZE_MB} MB limitini aşıyor.`, uploadType: "xml", field: "size" });
      return;
    }
    const ext = "." + (xmlFile.name.split(".").pop() || "").toLowerCase();
    if (ext !== ".xml") {
      notifyValidationError({ message: "Yalnızca XML uzantılı dosyalar kabul edilir.", uploadType: "xml", field: "format" });
      return;
    }
    runBulkUpload({
      type: "xml",
      apiCall: async () => {
        const formData = new FormData();
        formData.append("XmlFile", xmlFile);
        if (xmlUploadName) formData.append("UploadName", xmlUploadName);
        return addProductXml(formData);
      },
      onErrorReset: () => {
        setXmlFile(null);
        setXmlUploadName("");
        setXmlResetKey((k) => k + 1);
      },
    });
  };

  const handleXmlUrlUpload = () => {
    if (!xmlUrl.trim()) {
      notifyValidationError({ message: "Lütfen XML URL'i girin", uploadType: "xml-url", field: "url" });
      return;
    }
    runBulkUpload({
      type: "xml-url",
      apiCall: () => addProductXmlFromUrl({
        xmlUrl: xmlUrl.trim(),
        uploadName: xmlUrlUploadName?.trim() || undefined,
      }),
    });
  };

  const handleManualUpload = async () => {
    // Validate products
    const validProducts = products.filter((p) => {
      // API dokümantasyonuna göre zorunlu alanlar: Name, Store.UnitType, Store.StockQuantity, Store.MinOrderQuantity, Store.UnitPrice, Store.CurrencyCode
      return (
        p.name?.trim() &&
        p.store.unitType &&
        p.store.unitType > 0 &&
        p.store.stockQuantity &&
        p.store.stockQuantity > 0 &&
        p.store.minOrderQuantity !== "" &&
        p.store.minOrderQuantity !== null &&
        p.store.minOrderQuantity !== undefined &&
        p.store.minOrderQuantity >= 0 &&
        p.store.unitPrice &&
        p.store.unitPrice > 0 &&
        p.store.currencyCode?.trim()
      );
    });

    if (validProducts.length === 0) {
      notifyValidationError({ message: "En az bir geçerli ürün bilgisi gereklidir. Zorunlu alanları kontrol edin.", uploadType: "manual", field: "products" });
      return;
    }

    // Görsel validasyonu (en fazla 10 görsel, max 10MB/dosya)
    for (const product of validProducts) {
      if (product.images && product.images.length > 10) {
        notifyValidationError({ message: `Ürün "${product.name}" için en fazla 10 görsel gönderebilirsiniz.`, uploadType: "manual", field: "images" });
        return;
      }
      if (product.images) {
        for (const imageFile of product.images) {
          const maxSize = 10 * 1024 * 1024; // 10 MB
          if (imageFile.size > maxSize) {
            notifyValidationError({ message: `Görsel "${imageFile.name}" 10 MB limitini aşıyor.`, uploadType: "manual", field: "imageSize" });
            return;
          }
          // Format kontrolü
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
          const fileName = imageFile.name.toLowerCase();
          const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
          if (!hasValidExtension) {
            notifyValidationError({ message: `Görsel "${imageFile.name}" desteklenmiyor. İzin verilen: .jpg, .jpeg, .png, .gif, .webp`, uploadType: "manual", field: "imageFormat" });
            return;
          }
        }
      }
    }

    setLoadingManual(true);
    try {
      // API dokümantasyonuna göre her ürün ayrı ayrı gönderilmeli (tek ürün endpoint'i)
      // Ancak kullanıcı deneyimi için tüm ürünleri sırayla gönderelim
      let successCount = 0;
      let errorCount = 0;

      for (const product of validProducts) {
        try {
          // API 7.3: product JSON serialize edilmiş, Files, DraftName
          const productPayload = {
            name: product.name.trim(),
            store: {
              unitType: Number(product.store.unitType) || 0,
              stockQuantity: Number(product.store.stockQuantity) || 0,
              minOrderQuantity: Number(product.store.minOrderQuantity) ?? 0,
              maxOrderQuantity: product.store.maxOrderQuantity !== "" && product.store.maxOrderQuantity != null
                ? Number(product.store.maxOrderQuantity) : undefined,
              unitPrice: Number(product.store.unitPrice) || 0,
              currencyCode: (product.store.currencyCode || "TRY").trim(),
              mainProductCode: product.store.mainProductCode?.trim() || undefined,
              stockCode: product.store.stockCode?.trim() || undefined,
              criticalStock: product.store.criticalStock !== "" && product.store.criticalStock != null
                ? Number(product.store.criticalStock) : undefined,
              width: product.store.width !== "" && product.store.width != null ? Number(product.store.width) : undefined,
              length: product.store.length !== "" && product.store.length != null ? Number(product.store.length) : undefined,
              height: product.store.height !== "" && product.store.height != null ? Number(product.store.height) : undefined,
              weight: product.store.weight !== "" && product.store.weight != null ? Number(product.store.weight) : undefined,
              volumeWeight: product.store.volumeWeight !== "" && product.store.volumeWeight != null ? Number(product.store.volumeWeight) : undefined,
            },
            sku: product.sku?.trim() || undefined,
            ean: product.ean?.trim() || undefined,
            brandId: product.brandId?.trim() || undefined,
            brandName: product.brandName?.trim() || undefined,
            categoryId: product.categoryId ? Number(product.categoryId) : undefined,
            categorySubId: product.categorySubId ? Number(product.categorySubId) : undefined,
            gtip: product.gtip?.trim() || undefined,
            description: product.description?.trim() || undefined,
            preparationTime: product.preparationTime ? new Date(product.preparationTime).toISOString() : undefined,
            expirationDate: product.expirationDate ? new Date(product.expirationDate).toISOString() : undefined,
            colorVariants: product.colorVariants?.filter((c) => c?.trim()).length ? product.colorVariants.filter((c) => c?.trim()) : undefined,
          };

          const formData = new FormData();
          formData.append("product", JSON.stringify(productPayload));
          if (draftName?.trim()) formData.append("DraftName", draftName.trim());
          if (product.images?.length) {
            product.images.forEach((f) => formData.append("Files", f));
          }

          await addProductManual(formData);
          successCount++;
        } catch (err) {
          console.error(`Ürün "${product.name}" yüklenemedi:`, err);
          errorCount++;
          notifySingleProductError({ productName: product.name, message: err?.message || err });
        }
      }

      if (successCount > 0) {
        notifyManualResult({
          successCount,
          errorCount,
          message: `${successCount} ürün başarıyla yüklendi!${errorCount > 0 ? ` ${errorCount} ürün yüklenemedi.` : ""}`,
        });
        navigate("/seller/products/drafts");
      } else {
        notifyManualResult({ successCount: 0, errorCount, message: "Hiçbir ürün yüklenemedi." });
      }
    } catch (err) {
      console.error("Manuel yükleme başarısız:", err);
      notifyError({ message: `Ürünler yüklenemedi: ${err?.message || err}`, uploadType: "manual", errorDetail: err?.message });
    } finally {
      setLoadingManual(false);
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
          stockQuantity: "",
          minOrderQuantity: "",
          maxOrderQuantity: "",
          unitPrice: "",
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
        images: [],
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

  const handleImageChange = (productIndex, event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const updated = [...products];
    if (!updated[productIndex].images) {
      updated[productIndex].images = [];
    }
    updated[productIndex].images = [...updated[productIndex].images, ...files];
    setProducts(updated);
  };

  const removeImage = (productIndex, imageIndex) => {
    const updated = [...products];
    updated[productIndex].images = updated[productIndex].images.filter((_, i) => i !== imageIndex);
    setProducts(updated);
  };

  const handleImageDrop = (productIndex, event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    const updated = [...products];
    if (!updated[productIndex].images) {
      updated[productIndex].images = [];
    }
    updated[productIndex].images = [...updated[productIndex].images, ...files];
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

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await getCategoriesWithSubCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Kategoriler yüklenemedi:", err);
        toast.error("Kategoriler yüklenemedi");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      setLoadingBrands(true);
      try {
        const data = await getBrandList();
        setBrands(data || []);
      } catch (err) {
        console.error("Markalar yüklenemedi:", err);
        toast.error("Markalar yüklenemedi");
      } finally {
        setLoadingBrands(false);
      }
    };
    loadBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                          SKU
                        </label>
                        <input
                          type="text"
                          value={product.sku}
                          onChange={(e) => updateProduct(productIndex, "sku", e.target.value)}
                          placeholder="SKU-001"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                          Marka
                        </label>
                        <select
                          value={product.brandId || ""}
                          onChange={(e) => {
                            const selectedBrandId = e.target.value;
                            const selectedBrand = brands.find(b => b.id === selectedBrandId);
                            updateProduct(productIndex, "brandId", selectedBrandId || "");
                            // Marka seçildiğinde marka adını otomatik doldur
                            if (selectedBrand) {
                              updateProduct(productIndex, "brandName", selectedBrand.name || "");
                            } else {
                              updateProduct(productIndex, "brandName", "");
                            }
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                          disabled={loadingBrands}
                        >
                          <option value="">Marka Seçiniz</option>
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                        {loadingBrands && (
                          <p className="text-xs text-gray-500 mt-1">Markalar yükleniyor...</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Marka Adı
                        </label>
                        <input
                          type="text"
                          value={product.brandName}
                          onChange={(e) => {
                            const brandName = e.target.value;
                            updateProduct(productIndex, "brandName", brandName);
                            // Manuel marka adı girildiğinde marka ID'yi temizle (yeni marka oluşturuluyor olabilir)
                            if (brandName && product.brandId) {
                              const selectedBrand = brands.find(b => b.id === product.brandId);
                              if (selectedBrand && selectedBrand.name !== brandName) {
                                updateProduct(productIndex, "brandId", "");
                              }
                            }
                          }}
                          placeholder="Markanız yoksa markanızı buraya yazınız"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Açıklama
                        </label>
                        <textarea
                          value={product.description}
                          onChange={(e) => updateProduct(productIndex, "description", e.target.value)}
                          placeholder="Ürün açıklaması (detaylı bilgi, özellikler, kullanım alanları vb.)"
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Ana Kategori
                        </label>
                        <select
                          value={product.categoryId || ""}
                          onChange={(e) => {
                            const selectedCategoryId = e.target.value ? parseInt(e.target.value) : "";
                            updateProduct(productIndex, "categoryId", selectedCategoryId);
                            // Ana kategori değiştiğinde alt kategoriyi sıfırla
                            if (selectedCategoryId !== product.categoryId) {
                              updateProduct(productIndex, "categorySubId", "");
                            }
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                          disabled={loadingCategories}
                        >
                          <option value="">Kategori Seçiniz</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {loadingCategories && (
                          <p className="text-xs text-gray-500 mt-1">Kategoriler yükleniyor...</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Alt Kategori
                        </label>
                        <select
                          value={product.categorySubId || ""}
                          onChange={(e) => updateProduct(productIndex, "categorySubId", e.target.value ? parseInt(e.target.value) : "")}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                          disabled={!product.categoryId || loadingCategories}
                        >
                          <option value="">Alt Kategori Seçiniz</option>
                          {product.categoryId && categories
                            .find((cat) => cat.id === parseInt(product.categoryId))
                            ?.subCategories?.map((subCategory) => (
                              <option key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                              </option>
                            ))}
                        </select>
                        {!product.categoryId && (
                          <p className="text-xs text-gray-500 mt-1">Önce ana kategori seçiniz</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          GTIP Kodu
                        </label>
                        <input
                          type="text"
                          value={product.gtip}
                          onChange={(e) => updateProduct(productIndex, "gtip", e.target.value)}
                          placeholder="GTIP kodu (gümrük tarife kodu)"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Hazırlık Tarihi
                        </label>
                        <input
                          type="datetime-local"
                          value={product.preparationTime}
                          onChange={(e) => updateProduct(productIndex, "preparationTime", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Son Kullanma Tarihi
                        </label>
                        <input
                          type="datetime-local"
                          value={product.expirationDate}
                          onChange={(e) => updateProduct(productIndex, "expirationDate", e.target.value)}
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
                            <select
                              value={product.store.unitType || ""}
                              onChange={(e) => updateProduct(productIndex, "store.unitType", parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                              required
                            >
                              <option value="">Birim Türü Seçiniz</option>
                              {UNIT_TYPE_OPTIONS.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Stok Miktarı *
                            </label>
                            <input
                              type="number"
                              value={product.store.stockQuantity === 0 ? "" : product.store.stockQuantity || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                updateProduct(productIndex, "store.stockQuantity", value === "" ? "" : parseInt(value) || "");
                              }}
                              placeholder="Stok miktarı"
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
                              min="0"
                              value={product.store.minOrderQuantity === "" ? "" : (product.store.minOrderQuantity ?? "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  updateProduct(productIndex, "store.minOrderQuantity", "");
                                } else {
                                  const numValue = parseInt(value, 10);
                                  if (!isNaN(numValue) && numValue >= 0) {
                                    updateProduct(productIndex, "store.minOrderQuantity", numValue);
                                  }
                                }
                              }}
                              placeholder="Minimum sipariş miktarı"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Max. Sipariş
                            </label>
                            <input
                              type="number"
                              value={product.store.maxOrderQuantity}
                              onChange={(e) => updateProduct(productIndex, "store.maxOrderQuantity", e.target.value ? parseInt(e.target.value) : "")}
                              placeholder="Maksimum sipariş miktarı"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Birim Fiyat *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.store.unitPrice === 0 ? "" : product.store.unitPrice || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                updateProduct(productIndex, "store.unitPrice", value === "" ? "" : parseFloat(value) || "");
                              }}
                              placeholder="Birim fiyat"
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
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Ana Ürün Kodu
                            </label>
                            <input
                              type="text"
                              value={product.store.mainProductCode}
                              onChange={(e) => updateProduct(productIndex, "store.mainProductCode", e.target.value)}
                              placeholder="Ana ürün kodu"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Stok Kodu
                            </label>
                            <input
                              type="text"
                              value={product.store.stockCode}
                              onChange={(e) => updateProduct(productIndex, "store.stockCode", e.target.value)}
                              placeholder="Stok kodu"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Kritik Stok
                            </label>
                            <input
                              type="number"
                              value={product.store.criticalStock}
                              onChange={(e) => updateProduct(productIndex, "store.criticalStock", e.target.value ? parseInt(e.target.value) : "")}
                              placeholder="Kritik stok seviyesi"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Boyut ve Ağırlık Bilgileri */}
                      <div className="md:col-span-2 border-t pt-4 mt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Boyut ve Ağırlık Bilgileri</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Genişlik (cm)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.store.width}
                              onChange={(e) => updateProduct(productIndex, "store.width", e.target.value ? parseFloat(e.target.value) : "")}
                              placeholder="Genişlik"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Uzunluk (cm)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.store.length}
                              onChange={(e) => updateProduct(productIndex, "store.length", e.target.value ? parseFloat(e.target.value) : "")}
                              placeholder="Uzunluk"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Yükseklik (cm)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.store.height}
                              onChange={(e) => updateProduct(productIndex, "store.height", e.target.value ? parseFloat(e.target.value) : "")}
                              placeholder="Yükseklik"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Ağırlık (kg)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.store.weight}
                              onChange={(e) => updateProduct(productIndex, "store.weight", e.target.value ? parseFloat(e.target.value) : "")}
                              placeholder="Ağırlık"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Hacim Ağırlığı (kg)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.store.volumeWeight}
                              onChange={(e) => updateProduct(productIndex, "store.volumeWeight", e.target.value ? parseFloat(e.target.value) : "")}
                              placeholder="Hacim ağırlığı"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Image Files */}
                      <div className="md:col-span-2 border-t pt-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            Ürün Görselleri
                          </label>
                          <span className="text-xs text-gray-500">
                            {product.images?.length || 0} görsel seçildi
                          </span>
                        </div>
                        
                        {/* Drag & Drop Area */}
                        <div
                          onDrop={(e) => handleImageDrop(productIndex, e)}
                          onDragOver={(e) => e.preventDefault()}
                          onDragLeave={(e) => e.preventDefault()}
                          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors bg-gray-50"
                        >
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Görselleri buraya sürükle-bırak
                          </p>
                          <p className="text-xs text-gray-500 mb-3">veya</p>
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            Dosya Seç
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleImageChange(productIndex, e)}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-gray-400 mt-2">
                            JPG, PNG, GIF, WebP formatları desteklenir. En fazla 10 görsel, her biri max 10 MB.
                          </p>
                        </div>

                        {/* Image Preview Grid */}
                        {product.images && product.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            {product.images.map((imageFile, imageIndex) => (
                              <div key={imageIndex} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                                  <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt={`Preview ${imageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(productIndex, imageIndex)}
                                  className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <p className="text-xs text-gray-600 mt-1 truncate" title={imageFile.name}>
                                  {imageFile.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
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
                disabled={loadingManual || products.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loadingManual ? (
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
                  Excel (.xlsx, .xls) formatında toplu ürün bilgilerinizi yükleyin
                </p>
              </div>

              <div className="flex items-start gap-2 text-amber-800 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Önemli:</strong> Yükleme işlemi arka planda devam eder. Diğer sayfalara gidebilirsiniz ancak <strong>işlem tamamlanana kadar sayfayı kapatmayın</strong>.
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
                        href={EXCEL_TEMPLATE_PATH}
                        download="Tedarika_Urun_Yukleme_Sablon_guncel.xlsx"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        Excel Şablonu İndir
                      </a>
                      <button
                        onClick={handleDownloadCsvTemplate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        CSV Şablonu İndir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm text-emerald-900 font-semibold mb-2">
                  Güncel başlıklar (sıralama birebir aynı olmalı):
                </p>
                <p className="text-xs text-emerald-800 font-mono break-words">
                  {EXCEL_TEMPLATE_HEADERS.join("\t")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Excel Dosyası *
                </label>
                <input
                  key={excelResetKey}
                  type="file"
                  accept=".xlsx,.xls"
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

              {uploadType === "excel" && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    {uploadProgress >= 100 ? "Tamamlandı" : "Yükleniyor..."} {uploadProgress > 0 && uploadProgress < 100 && `${Math.round(uploadProgress)}%`}
                  </p>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 ${uploadProgress > 0 && uploadProgress < 100 ? "" : "progress-indeterminate w-full"}`}
                      style={uploadProgress > 0 && uploadProgress < 100 ? { width: `${uploadProgress}%` } : {}}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleExcelUpload}
                disabled={isUploading || !excelFile}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isUploading ? (
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

              {uploadType === "json" && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    {uploadProgress >= 100 ? "Tamamlandı" : "Gönderiliyor..."} {uploadProgress > 0 && uploadProgress < 100 && `${Math.round(uploadProgress)}%`}
                  </p>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ${uploadProgress > 0 && uploadProgress < 100 ? "" : "progress-indeterminate w-full"}`}
                      style={uploadProgress > 0 && uploadProgress < 100 ? { width: `${uploadProgress}%` } : {}}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleJsonUpload}
                disabled={isUploading || !jsonText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isUploading ? (
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

              <div className="flex items-start gap-2 text-amber-800 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Önemli:</strong> Yükleme işlemi arka planda devam eder. Diğer sayfalara gidebilirsiniz ancak <strong>işlem tamamlanana kadar sayfayı kapatmayın</strong>.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  XML Dosyası *
                </label>
                <input
                  key={xmlResetKey}
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

              {uploadType === "xml" && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    {uploadProgress >= 100 ? "Tamamlandı" : "Yükleniyor..."} {uploadProgress > 0 && uploadProgress < 100 && `${Math.round(uploadProgress)}%`}
                  </p>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300 ${uploadProgress > 0 && uploadProgress < 100 ? "" : "progress-indeterminate w-full"}`}
                      style={uploadProgress > 0 && uploadProgress < 100 ? { width: `${uploadProgress}%` } : {}}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleXmlUpload}
                disabled={isUploading || !xmlFile}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isUploading ? (
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

              <div className="flex items-start gap-2 text-amber-800 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Önemli:</strong> Yükleme işlemi arka planda devam eder. Diğer sayfalara gidebilirsiniz ancak <strong>işlem tamamlanana kadar sayfayı kapatmayın</strong>.
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

              {uploadType === "xml-url" && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    {uploadProgress >= 100 ? "Tamamlandı" : "İşleniyor..."} {uploadProgress > 0 && uploadProgress < 100 && `${Math.round(uploadProgress)}%`}
                  </p>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 ${uploadProgress > 0 && uploadProgress < 100 ? "" : "progress-indeterminate w-full"}`}
                      style={uploadProgress > 0 && uploadProgress < 100 ? { width: `${uploadProgress}%` } : {}}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleXmlUrlUpload}
                disabled={isUploading || !xmlUrl.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isUploading ? (
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

      {/* Tamamlandı - Full Screen Success Modal */}
      {uploadSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-[fadeInDown_0.3s_ease-out]">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-8 py-10 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Tamamlandı</h2>
              <p className="text-emerald-100 text-lg">{uploadSuccessModal.message}</p>
              <p className="text-emerald-200 text-sm mt-2">Ürünleriniz onaya gönderildi.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                <p className="text-sm text-amber-800">
                  <strong>Zaman aşımı hakkında:</strong> Çok sayıda ürün (örn. 1700) yüklerken sadece bir kısmı (örn. 307) yüklendiyse, bu genellikle <strong>sunucu tarafı zaman aşımı</strong>ndan kaynaklanır. Frontend 45 dk bekler; sunucu (IIS/Kestrel/nginx) genelde 2-5 dk ile sınırlıdır. Backend timeout ayarlarını artırmanız veya asenkron işleme geçmeniz gerekebilir.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setUploadSuccessModal(null);
                    navigate("/seller/products/drafts");
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg transition-all"
                >
                  Taslakları Görüntüle
                </button>
                <button
                  onClick={() => setUploadSuccessModal(null)}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    {EXCEL_TEMPLATE_HEADERS.map((field, idx) => (
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
            <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-2 border-t">
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Kapat
              </button>
              <div className="flex flex-wrap gap-2">
                <a
                  href={EXCEL_TEMPLATE_PATH}
                  download="Tedarika_Urun_Yukleme_Sablon_guncel.xlsx"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Excel Şablonu İndir
                </a>
                <button
                  onClick={handleDownloadCsvTemplate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  <Download className="w-4 h-4" />
                  CSV Şablonu İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDraftUploadPage;
