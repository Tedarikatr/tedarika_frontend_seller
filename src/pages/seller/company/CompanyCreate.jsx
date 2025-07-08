import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany, hasCompany } from "@/api/sellerCompanyService";
import { Building2, CheckCircle } from "lucide-react";

const CompanyCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", taxNumber: "", taxOffice: "", companyNumber: "",
    industry: "", country: "", city: "", address: "", email: "", phone: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Kaydediliyor...");

    const trimmedForm = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim()])
    );

    try {
      await createCompany(trimmedForm);
      const confirmed = await hasCompany();

      if (confirmed) {
        navigate("/seller/dashboard");
      } else {
        setMessage("⚠️ Kaydedildi ama sistemde görünmüyor.");
      }
    } catch (err) {
      console.error("❌ Şirket oluşturma hatası:", err);
      setMessage("❌ " + (err.message || "Sunucu hatası."));
    }
  };

  const fields = [
    { name: "name", label: "Şirket Adı" },
    { name: "taxNumber", label: "Vergi No" },
    { name: "taxOffice", label: "Vergi Dairesi" },
    { name: "companyNumber", label: "Sicil No" },
    { name: "industry", label: "Sektör" },
    { name: "country", label: "Ülke" },
    { name: "city", label: "Şehir" },
    { name: "address", label: "Adres" },
    { name: "email", label: "E-posta" },
    { name: "phone", label: "Telefon" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">
      <div className="flex flex-col md:flex-row bg-[#1e293b] rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">
        {/* Sol Tanıtım Alanı */}
        <div className="hidden md:flex flex-col justify-center bg-[#003636] text-white w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold mb-6">Tedarika'da Şirket Oluştur</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-400 w-5 h-5 mt-1" />
              <span><strong>Doğrulanmış işletme profili</strong> ile güven verin</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-400 w-5 h-5 mt-1" />
              <span><strong>Güvenli altyapı</strong> ile verileriniz koruma altında</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-400 w-5 h-5 mt-1" />
              <span><strong>Yalnızca 1 kez doldur</strong>, tüm platformda kullan</span>
            </li>
          </ul>
        </div>

        {/* Sağ Form Alanı */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 bg-white text-[#003636] p-10"
        >
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={28} className="text-[#003636]" />
            <h2 className="text-2xl font-bold">Şirket Bilgileri</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ name, label }) => (
              <input
                key={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-[#003636] bg-[#f0fdfa] placeholder-[#7aa5a2] focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            ))}
          </div>

          <div className="mt-6 text-xs bg-[#f0fdfa] text-emerald-900 px-4 py-3 rounded-lg border border-emerald-300">
            📌 Bilgileriniz yalnızca doğrulama amaçlı kullanılacaktır.
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-[#003636] to-[#005e5e] hover:brightness-110 text-white font-semibold py-3 rounded-xl transition"
          >
            Kaydet ve Devam Et
          </button>

          {message && (
            <div
              className={`mt-4 text-center text-sm font-medium ${
                message.startsWith("❌") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanyCreate;
