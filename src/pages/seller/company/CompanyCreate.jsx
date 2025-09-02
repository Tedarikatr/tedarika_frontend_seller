import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany, hasCompany } from "@/api/sellerCompanyService";
import { Building2, CheckCircle, Info } from "lucide-react";
import TaxOfficeSelect from "@/components/seller/TaxOfficeSelect";

// Numeric → API string enum map (Swagger örneği: "SoleProprietorship")
const COMPANY_TYPE_NUM2STR = {
  1: "SoleProprietorship",
  2: "Limited",
  3: "JointStock",
  4: "Cooperative",
  5: "BranchOffice",
  6: "ForeignCompany",
  99: "Other",
};

// Türkçe seçenekler (UI)
const companyTypeOptions = [
  { value: 1, label: "Şahıs" },
  { value: 2, label: "Limited Şirket" },
  { value: 3, label: "Anonim Şirket" },
  { value: 4, label: "Kooperatif" },
  { value: 5, label: "Şube" },
  { value: 6, label: "Yabancı Şirket" },
  { value: 99, label: "Diğer" },
];

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    taxNumber: "",
    taxOffice: "",
    country: "",
    province: "",
    address: "",
    type: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Kaydediliyor...");

    // API string enum kabul ediyor ise numeric → string çeviriyoruz
    const num = Number(form.type);
    const apiType = Number.isNaN(num) ? form.type : (COMPANY_TYPE_NUM2STR[num] ?? form.type);

    const payload = {
      ...form,
      name: form.name.trim(),
      taxNumber: form.taxNumber.trim(),
      taxOffice: form.taxOffice.trim(),
      country: form.country.trim(),
      province: form.province.trim(),
      address: form.address.trim(),
      type: apiType, // <- string enum
    };

    try {
      await createCompany(payload);
      const confirmed = await hasCompany();
      if (confirmed) {
        navigate("/seller/subscription");
      } else {
        setMessage("Sistemsel hata: şirket oluşturuldu ancak görünmüyor.");
      }
    } catch (err) {
      console.error("Şirket oluşturma hatası:", err);
      setMessage("❌ " + (err.message || "Sunucu hatası."));
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1a2b] flex items-center justify-center px-4 py-10 text-white">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-[#13263d] rounded-3xl overflow-hidden shadow-2xl">

        {/* Sol Bilgi Alanı */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-b from-[#003b4a] to-[#00292f] w-full md:w-1/2 p-10 text-white">
          <h2 className="text-3xl font-bold mb-6">Tedarika’da Şirketinizi Oluşturun</h2>
          <ul className="space-y-4 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-emerald-400 w-5 h-5 mt-1" />
              <span><strong>Güvenilir işletme profili</strong> ile öne çıkın</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-emerald-400 w-5 h-5 mt-1" />
              <span><strong>Veri güvenliği</strong> ile içiniz rahat olsun</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-emerald-400 w-5 h-5 mt-1" />
              <span><strong>Tek seferlik giriş</strong>, her yerde geçerli</span>
            </li>
          </ul>
        </div>

        {/* Sağ Form Alanı */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 bg-white text-[#003032] p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={26} className="text-[#003636]" />
            <h2 className="text-xl sm:text-2xl font-bold">Şirket Bilgileri</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Şirket Adı" required className="input" />
            <input name="taxNumber" value={form.taxNumber} onChange={handleChange} placeholder="Vergi Numarası" required className="input" />

            {/* 🔽 Vergi Dairesi Select */}
            <TaxOfficeSelect value={form.taxOffice} onChange={handleChange} required />

            <input name="country" value={form.country} onChange={handleChange} placeholder="Ülke" required className="input" />
            <input name="province" value={form.province} onChange={handleChange} placeholder="Şehir" required className="input" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Adres" required className="input md:col-span-2" />

            <select name="type" value={form.type} onChange={handleChange} required className="input bg-[#f8fdfc] text-[#002222] placeholder-[#5a7d7c]">
              <option value="">Şirket Türü Seçin</option>
              {companyTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex items-start gap-2 text-sm text-emerald-900 bg-[#f0fdfa] px-4 py-3 rounded-lg border border-emerald-300">
            <Info className="w-5 h-5 mt-0.5 text-emerald-600" />
            <span>Bilgileriniz sadece doğrulama amacıyla kullanılacaktır.</span>
          </div>

          <button type="submit" className="mt-6 w-full bg-gradient-to-r from-[#00555a] to-[#007e87] hover:brightness-110 text-white font-semibold py-3 rounded-xl transition duration-200">
            Kaydet ve Devam Et
          </button>

          {message && (
            <div className={`mt-4 text-center text-sm font-medium ${message.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanyCreate;
