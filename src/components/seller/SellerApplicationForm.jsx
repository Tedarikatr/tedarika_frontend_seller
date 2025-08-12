import React, { useState } from "react";
import { applySeller } from "@/api/sellerService";
import { toast } from "react-hot-toast";
import { CheckCircle } from "lucide-react";

const SellerApplicationForm = () => {
  const [formData, setFormData] = useState({
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await applySeller(formData);
      toast.success("✅ Başvurunuz alınmıştır, en kısa sürede sizinle iletişime geçilecektir.");
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
          {[
            "Hızlı başvuru süreci",
            "Belgelerinizi dijital olarak sunun",
            "Onay sonrası anında mağaza açın",
          ].map((item, i) => (
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

          <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Şirket Adı" required />
          <Input name="taxNumber" value={formData.taxNumber} onChange={handleChange} placeholder="Vergi Numarası" required />
          <Input name="taxOffice" value={formData.taxOffice} onChange={handleChange} placeholder="Vergi Dairesi" required />
          <Input name="contactName" value={formData.contactName} onChange={handleChange} placeholder="İrtibat Kişisi" required />
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-posta" required />
          <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Telefon" required />
          <Input name="productCategories" value={formData.productCategories} onChange={handleChange} placeholder="Ürün Kategorileri" required />
          <Input name="taxCertificateUrl" value={formData.taxCertificateUrl} onChange={handleChange} placeholder="Vergi Sertifikası Linki" />
          <Input name="tradeRegistryGazetteUrl" value={formData.tradeRegistryGazetteUrl} onChange={handleChange} placeholder="Ticaret Sicil Gazetesi Linki" />
          <Input name="signatureCircularUrl" value={formData.signatureCircularUrl} onChange={handleChange} placeholder="İmza Sirküsü Linki" />
          <Input name="ecommerceLinks" value={formData.ecommerceLinks} onChange={handleChange} placeholder="E-Ticaret Linkleri" />
          <Input name="socialMediaLinks" value={formData.socialMediaLinks} onChange={handleChange} placeholder="Sosyal Medya Linkleri" />

          <div className="flex items-center gap-2">
            <input type="checkbox" name="kvkkApproved" checked={formData.kvkkApproved} onChange={handleChange} />
            <label htmlFor="kvkkApproved" className="text-sm">KVKK metnini onaylıyorum.</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="contractApproved" checked={formData.contractApproved} onChange={handleChange} />
            <label htmlFor="contractApproved" className="text-sm">Satıcı sözleşmesini kabul ediyorum.</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-[#00d18c] to-[#00a980] hover:opacity-90 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {isSubmitting ? "Gönderiliyor..." : "Başvuru Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
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

export default SellerApplicationForm;