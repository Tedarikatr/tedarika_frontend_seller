// src/pages/seller/company/CompanyCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany, hasCompany } from "@/api/sellerCompanyService";

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
      console.log("📤 Gönderilen veri:", trimmedForm);
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
    <div className="min-h-screen bg-[#002c2c] flex justify-center items-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-[#003636] mb-6 text-center">Şirket Kaydı</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ name, label }) => (
            <input
              key={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={label}
              required
              className="p-2 border border-gray-300 rounded-md text-sm text-[#003636]"
            />
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-2 rounded-lg transition"
        >
          Kaydet
        </button>

        {message && (
          <div className="mt-4 text-center text-sm font-medium text-red-600">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyCreate;
