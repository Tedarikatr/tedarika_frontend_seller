import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCompany } from "@/api/sellerCompanyService";
import { Briefcase } from "lucide-react";

const CompanyView = () => {
  const [company, setCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getMyCompany();
        setCompany(data);
      } catch (err) {
        console.error("Şirket bilgileri alınamadı:", err);
      }
    };
    fetchCompany();
  }, []);

  if (!company) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-gray-600 animate-pulse">Şirket bilgileri yükleniyor...</span>
      </div>
    );
  }

  const fields = [
    { label: "Şirket Adı", value: company.name },
    { label: "Vergi No", value: company.taxNumber },
    { label: "Vergi Dairesi", value: company.taxOffice },
    { label: "Şirket Sicil No", value: company.companyNumber },
    { label: "Sektör", value: company.industry },
    { label: "Ülke", value: company.country },
    { label: "Şehir", value: company.city },
    { label: "Adres", value: company.address },
    { label: "E-posta", value: company.email },
    { label: "Telefon", value: company.phone },
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-3xl p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <Briefcase size={32} className="text-[#003636]" />
          <h2 className="text-3xl font-extrabold text-[#003636]">Şirket Bilgileriniz</h2>
        </div>

        {/* Grid alanı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
          {fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-[#005e5e] mb-1">{field.label}</label>
              <div
                className="bg-[#f5fefd] text-[#003636] text-sm px-4 py-2 rounded-xl border border-[#c4e4e2] select-none cursor-default"
              >
                {field.value || "-"}
              </div>
            </div>
          ))}
        </div>

        {/* Buton */}
        <div className="flex justify-end mt-10">
          <button
            onClick={() => navigate("/seller/company-profile")}
            className="bg-gradient-to-r from-[#003636] to-[#005e5e] hover:brightness-110 text-white font-semibold py-2 px-6 rounded-xl transition"
          >
            Bilgileri Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyView;
