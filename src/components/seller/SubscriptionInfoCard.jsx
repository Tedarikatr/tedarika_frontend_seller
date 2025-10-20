import React, { useEffect, useState } from "react";
import { getMySubscriptions } from "@/api/sellerSubscriptionService";
import { ShieldCheck } from "lucide-react";

// ✅ Enum mapping
const SUBSCRIPTION_LABELS = {
  Pending: "Beklemede",
  Active: "Aktif",
  Cancelled: "İptal Edildi",
  Expired: "Süresi Doldu",
};

// Field bileşeni
const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm font-medium mb-1">{label}</span>
    <span className="text-gray-800">{value || "-"}</span>
  </div>
);

const SubscriptionInfoCard = () => {
  const [activeSub, setActiveSub] = useState(null);

  useEffect(() => {
    getMySubscriptions()
      .then((data) => {
        // ✅ API’den gelen status değerine göre aktif aboneliği seçiyoruz
        const active = data.find((sub) => sub.status === "Active");
        setActiveSub(active || null);
      })
      .catch((err) => console.error("Abonelik bilgileri alınamadı", err));
  }, []);

  if (!activeSub) return null;

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full">
      {/* Başlık */}
      <div className="mb-6 border-b pb-4 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-emerald-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Abonelik Bilgileri</h2>
          <p className="text-sm text-gray-500 mt-1">
            Şu anda kullandığınız abonelik paketinizin detayları aşağıda yer alır.
          </p>
        </div>
      </div>

      {/* İçerik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm text-gray-700">
        <Field label="Paket Adı" value={activeSub.packageName} />
        <Field label="Durum" value={SUBSCRIPTION_LABELS[activeSub.status]} />
        <Field label="Dönem" value={activeSub.period} />
        <Field
          label="Başlangıç Tarihi"
          value={new Date(activeSub.startDate).toLocaleDateString("tr-TR")}
        />
        <Field
          label="Bitiş Tarihi"
          value={new Date(activeSub.endDate).toLocaleDateString("tr-TR")}
        />
        <Field label="Kalan Gün" value={`${activeSub.remainingDays} gün`} />
        <Field label="Ödeme Referansı" value={activeSub.paymentReference} />
      </div>
    </div>
  );
};

export default SubscriptionInfoCard;
