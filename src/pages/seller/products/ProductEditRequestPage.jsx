// =============================
// ProductEditRequestPage.jsx - Ürün Düzenleme Talebi
// Mevcut bilgiler | Talep edilen bilgiler ayrımı
// =============================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductOriginalInfo,
  createEditRequest,
} from "@/api/sellerProductEditRequestService";
import { getCategoriesWithSubCategories } from "@/api/categoryService";
import { getBrandList } from "@/api/brandservice";
import {
  ArrowLeft,
  FileEdit,
  Package,
  Save,
  Sparkles,
  CheckCircle,
  XCircle,
} from "lucide-react";

// GTIP regex: 6-12 hane
const GTIP_REGEX = /^\d{6}(\d{2}(\d{4})?)?$/;

const ProductEditRequestPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Talep edilen değişiklikler (sadece değiştirilmek istenen alanlar)
  const [requested, setRequested] = useState({
    name: "",
    description: "",
    brandId: "",
    productNumber: "",
    ean: "",
    sku: "",
    categoryId: "",
    categorySubId: "",
    isActive: "",
    requiresManualReview: "",
    gtipCode: "",
  });

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const [orig, cats, brds] = await Promise.all([
          getProductOriginalInfo(productId),
          getCategoriesWithSubCategories(),
          getBrandList(),
        ]);
        setOriginal(orig);
        setCategories(cats || []);
        setBrands(brds || []);
      } catch (err) {
        console.error("Veri yüklenemedi:", err);
        setFeedback({ message: err?.message || "Veri yüklenemedi.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  const updateRequested = (field, value) => {
    setRequested((prev) => ({ ...prev, [field]: value }));
  };

  const hasAnyChange = () => {
    const o = original || {};
    const r = requested;
    if (r.name && r.name.trim() !== (o.name || "").trim()) return true;
    if (r.description !== undefined && String(r.description).trim() !== String(o.description || "").trim()) return true;
    if (r.brandId && r.brandId !== (o.brandId || "")) return true;
    if (r.productNumber !== undefined && String(r.productNumber).trim() !== String(o.productNumber || "").trim()) return true;
    if (r.ean !== undefined && String(r.ean).trim() !== String(o.ean || "").trim()) return true;
    if (r.sku !== undefined && String(r.sku).trim() !== String(o.sku || "").trim()) return true;
    if (r.categoryId && Number(r.categoryId) !== Number(o.categoryId || 0)) return true;
    if (r.categorySubId && Number(r.categorySubId) !== Number(o.categorySubId || 0)) return true;
    if (r.isActive !== "" && (r.isActive === "true") !== (o.isActive ?? true)) return true;
    if (r.requiresManualReview !== "" && (r.requiresManualReview === "true") !== (o.requiresManualReview ?? false)) return true;
    if (r.gtipCode !== undefined && String(r.gtipCode).trim() !== String(o.gtipCode || "").trim()) return true;
    return false;
  };

  const buildPayload = () => {
    const o = original || {};
    const r = requested;
    const payload = { productId };

    if (r.name && r.name.trim() !== (o.name || "").trim()) payload.name = r.name.trim();
    if (r.description !== undefined && String(r.description).trim() !== String(o.description || "").trim()) payload.description = r.description.trim();
    if (r.brandId && r.brandId !== (o.brandId || "")) payload.brandId = r.brandId;
    if (r.productNumber !== undefined && String(r.productNumber).trim() !== String(o.productNumber || "").trim()) payload.productNumber = r.productNumber.trim();
    if (r.ean !== undefined && String(r.ean).trim() !== String(o.ean || "").trim()) payload.ean = r.ean.trim();
    if (r.sku !== undefined && String(r.sku).trim() !== String(o.sku || "").trim()) payload.sku = r.sku.trim();
    if (r.categoryId && Number(r.categoryId) !== Number(o.categoryId || 0)) payload.categoryId = Number(r.categoryId);
    if (r.categorySubId && Number(r.categorySubId) !== Number(o.categorySubId || 0)) payload.categorySubId = Number(r.categorySubId);
    if (r.isActive !== "" && (r.isActive === "true") !== (o.isActive ?? true)) payload.isActive = r.isActive === "true";
    if (r.requiresManualReview !== "" && (r.requiresManualReview === "true") !== (o.requiresManualReview ?? false)) payload.requiresManualReview = r.requiresManualReview === "true";
    if (r.gtipCode !== undefined && String(r.gtipCode).trim() !== String(o.gtipCode || "").trim()) {
      const gtip = r.gtipCode.trim();
      if (GTIP_REGEX.test(gtip)) payload.gtipCode = gtip;
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasAnyChange()) {
      showFeedback("En az bir alan değişikliği gönderilmelidir.", "error");
      return;
    }
    const payload = buildPayload();
    const keys = Object.keys(payload).filter((k) => k !== "productId");
    if (keys.length === 0) {
      showFeedback("En az bir alan değişikliği gönderilmelidir.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await createEditRequest(payload);
      showFeedback("Düzenleme talebi başarıyla gönderildi!", "success");
      setTimeout(() => navigate("/seller/products/my-store"), 1500);
    } catch (err) {
      showFeedback(err?.message || "Talep gönderilemedi.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const subCategories = categories.find((c) => c.id === Number(requested.categoryId))?.subCategories || [];

  if (!productId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ürün ID Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Düzenleme talebi için ürün bilgisi gereklidir.</p>
          <button
            onClick={() => navigate("/seller/products/my-store")}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Ürünlerime Dön
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4 animate-pulse shadow-xl">
            <Package size={40} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!original) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ürün Bilgisi Alınamadı</h2>
          <p className="text-gray-600 mb-6">{feedback?.message || "Ürün bulunamadı veya erişim yetkiniz yok."}</p>
          <button
            onClick={() => navigate("/seller/products/my-store")}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Ürünlerime Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <button
            onClick={() => navigate("/seller/products/my-store")}
            className="flex items-center gap-2 text-emerald-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Ürünlerime Dön</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <FileEdit size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                Ürün Düzenleme Talebi
                <Sparkles size={24} className="text-yellow-300" />
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                Mevcut bilgiler ile talep edilen değişiklikleri karşılaştırın
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-medium shadow-lg border-2 ${
              feedback.type === "success"
                ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-800"
                : "bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle size={20} className="flex-shrink-0" />
            ) : (
              <XCircle size={20} className="flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Sol: Mevcut Bilgiler */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-100 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Package size={20} className="text-slate-600" />
                  Mevcut Bilgiler
                </h2>
                <p className="text-xs text-gray-500 mt-1">Ürünün şu anki kayıtlı bilgileri</p>
              </div>
              <div className="p-6 space-y-4">
                <FieldRow label="Ürün Adı" value={original.name} />
                <FieldRow label="Açıklama" value={original.description} multiline />
                <FieldRow label="Marka" value={original.brandName} />
                <FieldRow label="Ürün No" value={original.productNumber} />
                <FieldRow label="EAN" value={original.ean} />
                <FieldRow label="SKU" value={original.sku} />
                <FieldRow label="Kategori" value={original.categoryName} />
                <FieldRow label="Alt Kategori" value={original.categorySubName} />
                <FieldRow label="Aktif" value={original.isActive ? "Evet" : "Hayır"} />
                <FieldRow label="Manuel İnceleme" value={original.requiresManualReview ? "Evet" : "Hayır"} />
                <FieldRow label="GTIP Kodu" value={original.gtipCode} />
              </div>
            </div>

            {/* Sağ: Talep Edilen Bilgiler */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b-2 border-emerald-200">
                <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                  <FileEdit size={20} className="text-emerald-600" />
                  Talep Edilen Bilgiler
                </h2>
                <p className="text-xs text-emerald-600/80 mt-1">Değiştirmek istediğiniz alanları doldurun</p>
              </div>
              <div className="p-6 space-y-4">
                <InputField
                  label="Ürün Adı"
                  value={requested.name}
                  onChange={(v) => updateRequested("name", v)}
                  placeholder={original.name}
                />
                <InputField
                  label="Açıklama (max 10000 karakter)"
                  value={requested.description}
                  onChange={(v) => updateRequested("description", v)}
                  placeholder={original.description}
                  multiline
                  maxLength={10000}
                />
                <SelectField
                  label="Marka"
                  value={requested.brandId}
                  onChange={(v) => updateRequested("brandId", v)}
                  options={brands.map((b) => ({ value: b.id ?? b.brandId ?? "", label: b.name ?? b.brandName ?? "" })).filter((o) => o.value)}
                  placeholder={original.brandName}
                />
                <InputField
                  label="Ürün No"
                  value={requested.productNumber}
                  onChange={(v) => updateRequested("productNumber", v)}
                  placeholder={original.productNumber}
                />
                <InputField
                  label="EAN (13 hane)"
                  value={requested.ean}
                  onChange={(v) => updateRequested("ean", v)}
                  placeholder={original.ean}
                  maxLength={13}
                />
                <InputField
                  label="SKU"
                  value={requested.sku}
                  onChange={(v) => updateRequested("sku", v)}
                  placeholder={original.sku}
                />
                <SelectField
                  label="Kategori"
                  value={requested.categoryId}
                  onChange={(v) => {
                    updateRequested("categoryId", v);
                    updateRequested("categorySubId", "");
                  }}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder={original.categoryName}
                />
                <SelectField
                  label="Alt Kategori"
                  value={requested.categorySubId}
                  onChange={(v) => updateRequested("categorySubId", v)}
                  options={subCategories.map((s) => ({ value: s.id, label: s.name }))}
                  placeholder={original.categorySubName}
                  disabled={!requested.categoryId}
                />
                <SelectField
                  label="Aktif"
                  value={requested.isActive}
                  onChange={(v) => updateRequested("isActive", v)}
                  options={[
                    { value: "", label: "Değiştirme" },
                    { value: "true", label: "Evet" },
                    { value: "false", label: "Hayır" },
                  ]}
                />
                <SelectField
                  label="Manuel İnceleme"
                  value={requested.requiresManualReview}
                  onChange={(v) => updateRequested("requiresManualReview", v)}
                  options={[
                    { value: "", label: "Değiştirme" },
                    { value: "true", label: "Evet" },
                    { value: "false", label: "Hayır" },
                  ]}
                />
                <InputField
                  label="GTIP Kodu (6-12 hane)"
                  value={requested.gtipCode}
                  onChange={(v) => updateRequested("gtipCode", v)}
                  placeholder={original.gtipCode}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate("/seller/products/my-store")}
              className="px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting || !hasAnyChange()}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:shadow-lg hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>Yükleniyor...</>
              ) : (
                <>
                  <Save size={18} />
                  Düzenleme Talebini Gönder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Yardımcı bileşenler
const FieldRow = ({ label, value, multiline }) => (
  <div>
    <span className="block text-xs font-semibold text-gray-500 mb-1">{label}</span>
    <span className={`block text-sm text-gray-800 ${multiline ? "whitespace-pre-wrap" : ""}`}>
      {value ?? "-"}
    </span>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, multiline, maxLength }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ? `Mevcut: ${String(placeholder).slice(0, 50)}...` : ""}
        className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        rows={4}
        maxLength={maxLength}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ? `Mevcut: ${placeholder}` : ""}
        className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        maxLength={maxLength}
      />
    )}
  </div>
);

const SelectField = ({ label, value, onChange, options, placeholder, disabled }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50"
    >
      <option value="">{placeholder ? `Mevcut: ${placeholder}` : "Değiştirme"}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default ProductEditRequestPage;
