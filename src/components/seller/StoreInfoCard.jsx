import React, { useEffect, useState } from "react";
import { getMyStore } from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";
import { StoreIcon, PlusCircle } from "lucide-react";

const StatusBadge = ({
  status,
  labels = ["Hayır", "Evet"],
  activeColor = "bg-green-100 text-green-700",
  passiveColor = "bg-red-100 text-red-700",
}) => {
  const className = status ? activeColor : passiveColor;
  const label = status ? labels[1] : labels[0];
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
};

const Field = ({ label, value, children }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm font-medium mb-1">{label}</span>
    {children || <span className="text-gray-800">{value || "-"}</span>}
  </div>
);

const StoreInfoCard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyStore()
      .then(setStore)
      .catch(() => setStore(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow text-center text-gray-500">
        Mağaza bilgileri yükleniyor...
      </div>
    );
  }

  if (!store) {
    return (
      <div className="bg-white border border-dashed border-gray-300 p-8 rounded-2xl text-center flex flex-col items-center justify-center shadow-sm">
        <div className="bg-[#e0f2f1] p-4 rounded-full mb-4 text-[#003636]">
          <StoreIcon size={32} />
        </div>
        <h3 className="text-lg font-semibold text-[#003636] mb-2">
          Henüz bir mağazanız bulunmuyor
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Platformda ürün yayınlamak için bir mağaza oluşturmanız gerekiyor.
        </p>
        <button
          onClick={() => navigate("/seller/store/create")}
          className="bg-[#003636] hover:bg-[#004848] text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Mağaza Oluştur
        </button>
      </div>
    );
  }

  const logoUrl = store.logoUrl || store.LogoUrl || "";
  const bannerUrl = store.bannerImageUrl || store.BannerImageUrl || "";

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full">
      <div className="mb-6 border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mağaza Bilgileri</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kayıtlı mağaza bilgileriniz aşağıda yer almaktadır.
          </p>
        </div>
        <button
          onClick={() => navigate("/seller/store/update")}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Bilgileri Güncelle
        </button>
      </div>

      {/* Banner Görseli */}
      {bannerUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
          <img
            src={bannerUrl}
            alt="Mağaza Banner"
            className="w-full h-48 sm:h-64 object-cover"
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Logo Görseli */}
        {logoUrl && (
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-emerald-200 shadow-lg">
              <label className="block text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">
                Mağaza Logosu
              </label>
              <div className="flex items-center justify-center bg-white rounded-xl p-4 border-2 border-emerald-200">
                <img
                  src={logoUrl}
                  alt="Mağaza Logosu"
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bilgiler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm text-gray-700 flex-1">
          <Field label="Mağaza Adı" value={store.storeName} />
          <Field label="Mağaza Açıklaması" value={store.storeDescription} />
          <Field label="Mağaza Konumu / No" value={store.storeNumber} />
          <Field label="Slug" value={store.storeSlug} />
          <Field label="Onaylı mı?">
            <StatusBadge
              status={store.isApproved}
              labels={["Onaysız", "Onaylı"]}
              activeColor="bg-blue-100 text-blue-700"
              passiveColor="bg-yellow-100 text-yellow-700"
            />
          </Field>
          <Field label="Aktif mi?">
            <StatusBadge
              status={store.isActive}
              activeColor="bg-green-100 text-green-700"
              passiveColor="bg-red-100 text-red-700"
            />
          </Field>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoCard;
