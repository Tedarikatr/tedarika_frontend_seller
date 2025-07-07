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
    <div className="min-h-screen bg-[#002c2c] flex justify-center items-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#003636] mb-2">Şirket Bilgileri</h2>
          <p className="text-gray-600 text-sm">
            Satıcı paneline erişebilmeniz için şirket bilgilerinizi eksiksiz girmeniz gerekmektedir.
          </p>
        </div>

        <div className="bg-[#F0FDF9] border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm">
          📌 <strong>Not:</strong> Bilgileriniz yalnızca doğrulama amaçlı kullanılacak olup, üçüncü şahıslarla paylaşılmayacaktır.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ name, label }) => (
            <div key={name}>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-[#003636] focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-3 rounded-xl transition"
        >
          Kaydet ve Devam Et
        </button>

        {message && (
          <div
            className={`mt-3 text-center text-sm font-medium ${
              message.startsWith("❌") ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyCreate;
