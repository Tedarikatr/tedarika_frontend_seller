import React, { useEffect, useState } from "react";
import { getSellerProfile } from "@/api/sellerAuthService";
import { UserCircle } from "lucide-react";

// Status badge bileşeni
const StatusBadge = ({ status, labels = ["Hayır", "Evet"], activeColor = "bg-green-100 text-green-700", passiveColor = "bg-red-100 text-red-700" }) => {
  const label = status ? labels[1] : labels[0];
  const color = status ? activeColor : passiveColor;

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}>
      {label}
    </span>
  );
};

// Tek satır gösterimi için Field bileşeni
const Field = ({ label, value, children }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm font-medium mb-1">{label}</span>
    {children || <span className="text-gray-800">{value || "-"}</span>}
  </div>
);

// Ana bileşen
const SellerInfoCard = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    getSellerProfile()
      .then(setInfo)
      .catch((err) => console.error("Satıcı bilgisi alınamadı", err));
  }, []);

  if (!info) return null;

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full">
      {/* Başlık */}
      <div className="mb-6 border-b pb-4 flex items-center gap-2">
        <UserCircle className="w-6 h-6 text-sky-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Satıcı Bilgileri</h2>
          <p className="text-sm text-gray-500 mt-1">Hesabınıza bağlı temel satıcı bilgileriniz.</p>
        </div>
      </div>

      {/* Bilgi alanları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm text-gray-700">
        <Field label="Ad Soyad" value={`${info.name} ${info.lastName}`} />
        <Field label="E-posta" value={info.email} />
        <Field label="Telefon" value={info.phone} />
        <Field label="Şirket Kaydı">
          <StatusBadge status={info.hasCompany} labels={["Yok", "Var"]} />
        </Field>
        <Field label="Mağaza Kaydı">
          <StatusBadge status={info.hasStore} labels={["Yok", "Var"]} />
        </Field>
        <Field label="Abonelik Durumu">
          <StatusBadge status={info.subscriptionActive} labels={["Pasif", "Aktif"]} activeColor="bg-blue-100 text-blue-700" />
        </Field>
      </div>
    </div>
  );
};

export default SellerInfoCard;
