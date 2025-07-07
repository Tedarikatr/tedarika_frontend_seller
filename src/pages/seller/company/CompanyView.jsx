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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
        <div className="flex items-center gap-3 mb-10">
          <Briefcase size={36} className="text-[#003636]" />
          <h2 className="text-3xl font-bold text-[#003636]">Şirket Bilgileri</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          {fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}:</label>
              <p className="text-base text-gray-900">{field.value || "-"}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={() => navigate("/seller/company-profile")}
            className="bg-[#003636] hover:bg-[#004848] text-white py-2 px-6 rounded-xl font-medium transition"
          >
            Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyView;
