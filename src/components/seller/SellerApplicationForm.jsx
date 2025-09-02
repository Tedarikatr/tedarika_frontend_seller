import React, { useMemo, useState } from "react";
import { applySeller } from "@/api/sellerService";
import { toast } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import TaxOfficeSelect from "@/components/seller/TaxOfficeSelect";

// API string enum’ları (Swagger ile uyumlu)
const COMPANY_TYPES = [
  { value: "SoleProprietorship", label: "Şahıs" },
  { value: "Limited", label: "Limited Şirket" },
  { value: "JointStock", label: "Anonim Şirket" },
  { value: "Cooperative", label: "Kooperatif" },
  { value: "BranchOffice", label: "Şube" },
  { value: "ForeignCompany", label: "Yabancı Şirket" },
  { value: "Other", label: "Diğer" },
];

const PRODUCT_CONDITIONS = [
  { value: "Branded", label: "Markalı" },
  { value: "Unbranded", label: "Markasız/Özel Üretim" },
];

const initial = {
  companyName: "",
  taxNumber: "",
  taxOffice: "",
  companyType: "SoleProprietorship",
  contactName: "",
  phoneNumber: "",
  email: "",
  productCategories: "",
  productCondition: "Branded",
  taxCertificateUrl: "",
  tradeRegistryGazetteUrl: "",
  signatureCircularUrl: "",
  ecommerceLinks: "",
  socialMediaLinks: "",
  kvkkApproved: false,
  contractApproved: false,
};

const SellerApplicationForm = () => {
  const [formData, setFormData] = useState(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValid = useMemo(() => {
    if (!formData.companyName?.trim()) return false;
    if (!formData.taxNumber?.trim()) return false;
    if (!formData.taxOffice?.trim()) return false;
    if (!formData.contactName?.trim()) return false;
    if (!formData.phoneNumber?.trim()) return false;
    if (!formData.email?.trim()) return false;
    if (!formData.productCategories?.trim()) return false;
    if (!formData.kvkkApproved || !formData.contractApproved) return false;
    return true;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Lütfen zorunlu alanları doldurun ve onay kutularını işaretleyin.");
      return;
    }

    setIsSubmitting(true);
    try {
      // payload doğrudan API ile uyumlu
      await applySeller({
        ...formData,
        companyName: formData.companyName.trim(),
        taxNumber: formData.taxNumber.trim(),
        taxOffice: formData.taxOffice.trim(),
        contactName: formData.contactName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        productCategories: formData.productCategories.trim(),
        ecommerceLinks: formData.ecommerceLinks.trim(),
        socialMediaLinks: formData.socialMediaLinks.trim(),
        taxCertificateUrl: formData.taxCertificateUrl.trim(),
        tradeRegistryGazetteUrl: formData.tradeRegistryGazetteUrl.trim(),
        signatureCircularUrl: formData.signatureCircularUrl.trim(),
      });

      toast.success("✅ Başvurunuz alınmıştır, en kısa sürede sizinle iletişime geçilecektir.");
      setFormData(initial);
    } catch (err) {
      const msg = err?.message || "❌ Beklenmeyen bir hata oluştu, lütfen tekrar deneyin.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#002d2f] text-white">
      {/* Sol Tanıtım Alanı */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-10 py-20 space-y-8 bg-gradient-to-br from-[#003e3f] via-[#004b49] to-[#005c5a]">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          Tedarika Satıcı Başvuru
        </h2>
        <p className="text-[#b8dedb] max-w-md text-sm leading-relaxed">
          Satıcı olarak başvurarak ürünlerinizi Tedarika Marketplace'e taşıyın, potansiyelinizi büyütün.
        </p>
        <ul className="space-y-3 text-sm">
          {["Hızlı başvuru süreci", "Belgelerinizi dijital olarak sunun", "Onay sonrası anında mağaza açın"].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sağ Başvuru Formu */}
      <div className="w-full md:w-1/2 bg-white text-[#003636] flex items-center justify-center py-16 px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
          <h3 className="text-3xl font-bold text-center mb-6">Başvuru Formu</h3>

          {/* Şirket Bilgileri */}
          <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Şirket Adı *" required />
          <Input name="taxNumber" value={formData.taxNumber} onChange={handleChange} placeholder="Vergi Numarası *" required />

          {/* Vergi Dairesi — JSON'dan select */}
          <TaxOfficeSelect value={formData.taxOffice} onChange={handleChange} required />

          {/* Şirket Türü — string enum */}
          <Select
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            options={COMPANY_TYPES}
            placeholder="Şirket Türü Seçin"
          />

          {/* İletişim */}
          <Input name="contactName" value={formData.contactName} onChange={handleChange} placeholder="İrtibat Kişisi *" required />
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-posta *" required />
          <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Telefon *" required />

          {/* Ürün Bilgileri */}
          <Input name="productCategories" value={formData.productCategories} onChange={handleChange} placeholder="Ürün Kategorileri * (örn: Ofis, Kırtasiye...)" required />
          <Select
            name="productCondition"
            value={formData.productCondition}
            onChange={handleChange}
            options={PRODUCT_CONDITIONS}
            placeholder="Ürün Durumu"
          />

          {/* Opsiyonel Belgeler & Linkler */}
          <Input name="taxCertificateUrl" value={formData.taxCertificateUrl} onChange={handleChange} placeholder="Vergi Sertifikası Linki" />
          <Input name="tradeRegistryGazetteUrl" value={formData.tradeRegistryGazetteUrl} onChange={handleChange} placeholder="Ticaret Sicil Gazetesi Linki" />
          <Input name="signatureCircularUrl" value={formData.signatureCircularUrl} onChange={handleChange} placeholder="İmza Sirküsü Linki" />
          <Input name="ecommerceLinks" value={formData.ecommerceLinks} onChange={handleChange} placeholder="E-Ticaret Linkleri (virgülle ayırın)" />
          <Input name="socialMediaLinks" value={formData.socialMediaLinks} onChange={handleChange} placeholder="Sosyal Medya Linkleri (virgülle ayırın)" />

          {/* Onaylar */}
          <div className="flex items-center gap-2">
            <input type="checkbox" name="kvkkApproved" checked={formData.kvkkApproved} onChange={handleChange} id="kvkkApproved" />
            <label htmlFor="kvkkApproved" className="text-sm">KVKK metnini onaylıyorum *</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="contractApproved" checked={formData.contractApproved} onChange={handleChange} id="contractApproved" />
            <label htmlFor="contractApproved" className="text-sm">Satıcı sözleşmesini kabul ediyorum *</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full mt-4 bg-gradient-to-r from-[#00d18c] to-[#00a980] hover:opacity-90 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {isSubmitting ? "Gönderiliyor..." : "Başvuru Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Basit kontrollerle sade Input
const Input = ({ name, value, onChange, placeholder, type = "text", required = false }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full border border-[#bde7e3] rounded-lg px-4 py-2 text-sm placeholder-[#7aa5a2] focus:outline-none focus:ring-2 ring-[#00d18c] bg-[#f0fdfa] text-[#003636] transition"
  />
);

const Select = ({ name, value, onChange, options, placeholder }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full border border-[#bde7e3] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 ring-[#00d18c] bg-[#f8fdfc] text-[#003636] transition"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

export default SellerApplicationForm;
