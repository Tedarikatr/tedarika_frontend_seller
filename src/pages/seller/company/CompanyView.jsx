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
    <div className="min-h-screen bg-[#f4f6f8] py-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto bg-white border border-gray-300 shadow-lg rounded-2xl p-8 sm:p-10">
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-10">
          <Briefcase size={30} className="text-[#003636]" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003636] tracking-tight">
            Şirket Bilgileriniz
          </h2>
        </div>

        {/* Bilgi Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          {fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-[#005e5e] mb-1">
                {field.label}
              </label>
              <div className="bg-[#e6f5f4] text-[#003636] text-sm px-4 py-2.5 rounded-lg border border-[#b8dedd] shadow-inner">
                {field.value || "-"}
              </div>
            </div>
          ))}
        </div>

        {/* Buton */}
        <div className="flex justify-end mt-12">
          <button
            onClick={() => navigate("/seller/company-profile")}
            className="bg-gradient-to-r from-[#003636] to-[#006666] hover:brightness-110 text-white font-semibold text-sm sm:text-base py-2.5 px-6 rounded-xl shadow-md transition"
          >
            Bilgileri Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyView;
