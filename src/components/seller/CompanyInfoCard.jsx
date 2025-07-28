import React, { useEffect, useState } from "react";
import { getMyCompany } from "@/api/sellerCompanyService";
import { useNavigate } from "react-router-dom";

// Türkçe CompanyType eşleştirmesi (string key'lerle)
const companyTypeOptions = {
  SoleProprietorship: "Şahıs",
  Limited: "Limited Şirket",
  JointStock: "Anonim Şirket",
  Cooperative: "Kooperatif",
  BranchOffice: "Şube",
  ForeignCompany: "Yabancı Şirket",
  Other: "Diğer",
};

// Rozet bileşeni
const StatusBadge = ({
  status,
  labels = ["Pasif", "Aktif"],
  activeColor = "bg-green-100 text-green-700",
  passiveColor = "bg-gray-100 text-gray-600",
}) => {
  const className = status ? activeColor : passiveColor;
  const label = status ? labels[1] : labels[0];
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
};

// Field bileşeni
const Field = ({ label, value, children }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm font-medium mb-1">{label}</span>
    {children || <span className="text-gray-800">{value || "-"}</span>}
  </div>
);

// Ana bileşen
const CompanyInfoCard = () => {
  const [company, setCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyCompany()
      .then(setCompany)
      .catch((err) => console.error("Şirket bilgisi alınamadı", err));
  }, []);

  if (!company) return null;

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full">
      <div className="mb-6 border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Şirket Bilgileri</h2>
          <p className="text-sm text-gray-500 mt-1">
            Şirket profilinizde kayıtlı olan bilgiler aşağıda listelenmiştir.
          </p>
        </div>

        <button
          onClick={() => navigate("/seller/company-profile")}
          className="bg-gradient-to-r from-[#003636] to-[#006666] hover:brightness-110 text-white font-semibold text-sm py-2 px-5 rounded-lg shadow-md transition"
        >
          Bilgileri Güncelle
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm text-gray-700">
        <Field label="Şirket Adı" value={company.name} />
        <Field label="Vergi No" value={company.taxNumber} />
        <Field label="Vergi Dairesi" value={company.taxOffice} />
        <Field label="Ülke" value={company.country} />
        <Field label="Şehir" value={company.province} />
        <Field label="Adres" value={company.address} />
        <Field label="Şirket No" value={company.companyNumber} />
        <Field label="Şirket Türü" value={companyTypeOptions[company.type] || company.type} />

        <Field label="Doğrulama Durumu">
          <StatusBadge
            status={company.isVerified}
            labels={["Bekliyor", "Doğrulandı"]}
            activeColor="bg-blue-100 text-blue-700"
            passiveColor="bg-yellow-100 text-yellow-700"
          />
        </Field>

        <Field label="Şirket Durumu">
          <StatusBadge
            status={company.isActive}
            labels={["Pasif", "Aktif"]}
            activeColor="bg-green-100 text-green-700"
            passiveColor="bg-red-100 text-red-700"
          />
        </Field>
      </div>
    </div>
  );
};

export default CompanyInfoCard;
