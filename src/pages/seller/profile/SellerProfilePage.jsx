import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  FileWarning,
  UserCircle,
  Building2,
  Store,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Award,
  CheckCircle,
} from "lucide-react";

import useSellerSetupStatus from "@/hooks/useSellerSetupStatus";
import { DOC_LABELS } from "@/constants/companyDocuments";

import SellerInfoCard from "@/components/seller/SellerInfoCard";
import StoreInfoCard from "@/components/seller/StoreInfoCard";
import CompanyInfoCard from "@/components/seller/CompanyInfoCard";
import SellerFinanceInfoCard from "@/components/seller/SellerFinanceInfoCard";
import SubscriptionPlans from "@/components/seller/SubscriptionPlans"; // 👈 SubscriptionPage’den çıkarılıp component olarak kaydedilecek

const TABS = [
  { key: "seller", label: "Satıcı", icon: <UserCircle className="w-5 h-5" /> },
  { key: "company", label: "Şirket", icon: <Building2 className="w-5 h-5" /> },
  { key: "store", label: "Mağaza", icon: <Store className="w-5 h-5" /> },
  { key: "subscription", label: "Abonelik", icon: <ShieldCheck className="w-5 h-5" /> },
  { key: "finance", label: "Ödeme", icon: <CreditCard className="w-5 h-5" /> },
];

const SellerProfilePage = () => {
  const nav = useNavigate();
  const { loading, hasExtraInfo, missingDocs } = useSellerSetupStatus();
  const isSubscribed =
    localStorage.getItem("sellerSubscriptionActive") === "true";

  const [activeTab, setActiveTab] = useState(
    isSubscribed ? "seller" : "subscription"
  );

  const renderActiveCard = () => {
    switch (activeTab) {
      case "seller":
        return <SellerInfoCard />;
      case "company":
        return <CompanyInfoCard />;
      case "store":
        return <StoreInfoCard />;
      case "subscription":
        return <SubscriptionPlans />; // 👈 burada planlar gösteriliyor
      case "finance":
        return <SellerFinanceInfoCard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafa] px-4 sm:px-6 lg:px-16 py-10">
      {/* Uyarılar */}
      <div className="max-w-6xl mx-auto space-y-4 mb-8">
        {!loading && !hasExtraInfo && (
          <div className="flex items-start gap-4 p-5 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 pt-1">
              <div className="font-bold text-amber-900 text-lg mb-1">Ekstra Bilgiler Eksik</div>
              <p className="text-sm text-amber-800">
                KEP adresi, yetkili kişi ve yetkili telefon bilgilerini
                eklemeniz gerekir.
              </p>
            </div>
            <button
              onClick={() => nav("/seller/profile/extra-info")}
              className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Bilgileri Ekle
            </button>
          </div>
        )}

        {!loading && missingDocs.length > 0 && (
          <div className="flex items-start gap-4 p-5 rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-pink-50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <FileWarning className="w-6 h-6" />
            </div>
            <div className="flex-1 pt-1">
              <div className="font-bold text-rose-900 text-lg mb-1">Zorunlu Belgeler Eksik</div>
              <p className="text-sm text-rose-800">
                Eksikler: {missingDocs.map((t) => DOC_LABELS[t] || t).join(", ")}
              </p>
            </div>
            <button
              onClick={() => nav("/seller/company-documents")}
              className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Belge Yükle
            </button>
          </div>
        )}
      </div>

      {/* Hero Başlık */}
      <header className="mb-8 relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-3xl shadow-2xl px-8 py-12 sm:px-12 text-center overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight">
              Satıcı Profil Paneli
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto font-medium">
            Tedarika satıcı hesabınıza ait tüm bilgileri modern ve sezgisel bir arayüzle görüntüleyin.
          </p>

          {/* Modern Tab Navigation */}
          <nav className="mt-10 flex justify-center flex-wrap gap-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform
                  ${
                    activeTab === tab.key
                      ? "bg-white text-purple-700 shadow-xl scale-105"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105 hover:shadow-lg"
                  }`}
              >
                <div className={`transition-transform duration-300 ${activeTab === tab.key ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {tab.icon}
                </div>
                {tab.label}
                {activeTab === tab.key && (
                  <CheckCircle className="w-4 h-4 ml-1" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* İçerik */}
      <main className="max-w-6xl mx-auto">
        <section className="transition-opacity duration-300 ease-in-out">
          {renderActiveCard()}
        </section>
      </main>
    </div>
  );
};

export default SellerProfilePage;
