import { useEffect, useState } from "react";
import { getMyCompany, updateCompany } from "@/api/sellerCompanyService";

const CompanyUpdate = () => {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getMyCompany();
        setForm(data);
      } catch (err) {
        setMessage("❌ Şirket bilgileri alınamadı.");
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await updateCompany(form);
      setMessage("✅ Şirket bilgileri başarıyla güncellendi.");
    } catch (err) {
      setMessage("❌ Güncelleme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="p-6">Şirket bilgileri yükleniyor...</div>;

  const fields = [
    { name: "name", label: "Şirket Adı" },
    { name: "taxNumber", label: "Vergi No" },
    { name: "taxOffice", label: "Vergi Dairesi" },
    { name: "companyNumber", label: "Şirket Sicil No" },
    { name: "industry", label: "Sektör" },
    { name: "country", label: "Ülke" },
    { name: "city", label: "Şehir" },
    { name: "address", label: "Adres" },
    { name: "email", label: "E-Posta" },
    { name: "phone", label: "Telefon" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-[#003636] text-center">
        Şirket Bilgilerini Güncelle
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700 font-medium">
              {field.label}
            </label>
            <input
              name={field.name}
              value={form[field.name] ?? ""}
              onChange={handleChange}
              placeholder={field.label}
              className="p-2 border border-gray-300 rounded-md text-sm text-[#003636] focus:outline-none focus:ring-2 focus:ring-[#004848]"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Güncelleniyor..." : "Güncelle"}
          </button>
        </div>

        {message && (
          <div
            className={`md:col-span-2 text-center mt-4 text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyUpdate;
