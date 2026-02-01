// src/pages/CampaignDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SellerCampaignService from "@/api/sellerCampaignService";
import StepPreview from "@/components/campaignWizard/StepPreview";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  // Kampanya verisini getir
  useEffect(() => {
    if (!id) return;
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await SellerCampaignService.getById(id);
      setData(res);
    } catch {
      alert("Kampanya verisi alınamadı.");
    }
  };

  // Kaydetme işlemi
  const save = async () => {
    if (!data) return;

    const payload = {
      basics: {
        name: data.basics?.name || "",
        kind: data.basics?.kind || "BasketAmountOff",
        startsAt: data.basics?.startsAt,
        endsAt: data.basics?.endsAt,
        requiresCoupon: !!data.basics?.requiresCoupon,
        couponCode: data.basics?.couponCode || "",
        priority: Number(data.basics?.priority ?? 0),
        status: data.basics?.status || "Draft",
      },
      targeting: {
        scope: data.targeting?.scope || "AllProducts",
        items:
          data.targeting?.items?.map((i) => ({
            id: i.id,
            productId: i.productId,
            categoryId: i.categoryId ?? 0,
          })) || [],
      },
      criteria: {
        amountOff: Number(data.criteria?.amountOff ?? 0),
        percentOff: Number(data.criteria?.percentOff ?? 0),
        currency: data.criteria?.currency || "TRY",
        perOrderRepeatLimit: Number(data.criteria?.perOrderRepeatLimit ?? 0),
        totalOrderUsageLimit: Number(data.criteria?.totalOrderUsageLimit ?? 0),
        premiumOnly: !!data.criteria?.premiumOnly,
        perCustomerOnce: !!data.criteria?.perCustomerOnce,
        advancedCriterias:
          data.criteria?.advancedCriterias?.map((r) => ({
            id: r.id,
            minRequiredQuantity: Number(r.minRequiredQuantity ?? 0),
            chargedQuantity: Number(r.chargedQuantity ?? 0),
            nthItemIndex: Number(r.nthItemIndex ?? 0),
            criteriaAmountOff: Number(r.criteriaAmountOff ?? 0),
            criteriaPercentOff: Number(r.criteriaPercentOff ?? 0),
            appliesPerLine: !!r.appliesPerLine,
          })) || [],
      },
    };

    // Kupon zorunluluğu kontrolü
    if (payload.basics.requiresCoupon && !payload.basics.couponCode) {
      alert("Kupon kodu zorunludur!");
      return;
    }

    try {
      setSaving(true);
      console.log("PUT gönderilen veri:", payload);
      await SellerCampaignService.update(id, payload);
      await fetchCampaign(); // 🔥 Güncel veriyi yeniden çek
      alert("Kampanya başarıyla güncellendi!");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert(err?.response?.data?.message || "Kampanya güncellenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  // Durum değiştirme işlemi
  const changeStatus = async (status) => {
    try {
      await SellerCampaignService.updateStatus(id, status);
      setData((prev) => ({
        ...prev,
        basics: { ...prev.basics, status },
      }));
      alert(`Durum ${status} olarak güncellendi.`);
    } catch {
      alert("Durum değiştirilemedi.");
    }
  };

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-500 text-sm">
        Kampanya verisi yükleniyor...
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8 md:space-y-10 animate-fadeIn">
      {/* Üst Başlık */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">
            {data?.basics?.name || "Kampanya Detayı"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kampanyayı görüntüleyebilir, düzenleyebilir veya durumunu değiştirebilirsiniz.
          </p>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <ActionButton
            label="Yayınla"
            color="green"
            onClick={() => changeStatus("Active")}
          />
          <ActionButton
            label="Durdur"
            color="yellow"
            onClick={() => changeStatus("Paused")}
          />
          <ActionButton
            label="Bitir"
            color="red"
            onClick={() => changeStatus("Ended")}
          />
          <button
            onClick={save}
            disabled={saving}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg font-medium shadow hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-70"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Önizleme Alanı */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <StepPreview data={data} prev={() => {}} submit={save} />
      </div>
    </div>
  );
}

/* 🔧 Alt bileşen: Aksiyon Butonu */
function ActionButton({ label, color, onClick }) {
  const colorMap = {
    green: "border-green-500 text-green-600 hover:bg-green-50",
    yellow: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    red: "border-red-500 text-red-600 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`border px-4 py-2 rounded-lg font-medium transition ${colorMap[color]}`}
    >
      {label}
    </button>
  );
}
