import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  FileWarning,
  UserCircle,
  Building2,
  Store,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import useSellerSetupStatus from "@/hooks/useSellerSetupStatus";
import { DOC_LABELS } from "@/constants/companyDocuments";

import SellerInfoCard from "@/components/seller/SellerInfoCard";
import StoreInfoCard from "@/components/seller/StoreInfoCard";
import CompanyInfoCard from "@/components/seller/CompanyInfoCard";
import SubscriptionInfoCard from "@/components/seller/SubscriptionInfoCard";
import SellerFinanceInfoCard from "@/components/seller/SellerFinanceInfoCard";

const TABS = [
  { key: "seller", label: "Satıcı", icon: <UserCircle className="w-5 h-5" /> },
  { key: "company", label: "Şirket", icon: <Building2 className="w-5 h-5" /> },
  { key: "store", label: "Mağaza", icon: <Store className="w-5 h-5" /> },
  { key: "subscription", label: "Abonelik", icon: <ShieldCheck className="w-5 h-5" /> },
  { key: "finance", label: "Ödeme", icon: <CreditCard className="w-5 h-5" /> },
];

const SellerProfilePage = () => {
  const [activeTab, setActiveTab] = useState("seller");
  const nav = useNavigate();
  const { loading, hasExtraInfo, missingDocs } = useSellerSetupStatus();

  const renderActiveCard = () => {
    switch (activeTab) {
      case "seller":
        return <SellerInfoCard />;
      case "company":
        return <CompanyInfoCard />;
      case "store":
        return <StoreInfoCard />;
      case "subscription":
        return <SubscriptionInfoCard />;
      case "finance":
        return <SellerFinanceInfoCard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafa] px-4 sm:px-6 lg:px-16 py-10">
      {/* Üst uyarılar */}
      <div className="max-w-6xl mx-auto space-y-3 mb-8">
        {!loading && !hasExtraInfo && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold">Ekstra şirket bilgileri eksik</div>
              <p className="text-sm mt-0.5">
                KEP adresi, yetkili kişi ve yetkili telefon bilgilerini eklemeniz gerekir.
              </p>
            </div>
            <button
              onClick={() => nav("/seller/profile/extra-info")}
              className="shrink-0 px-3 py-2 rounded-lg bg-amber-600 text-white text-sm hover:brightness-110"
            >
              Bilgileri Ekle
            </button>
          </div>
        )}

        {!loading && missingDocs.length > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800">
            <FileWarning className="w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold">Zorunlu belgeler eksik</div>
              <p className="text-sm mt-0.5">
                Eksikler: {missingDocs.map((t) => DOC_LABELS[t] || t).join(", ")}
              </p>
            </div>
            <button
              onClick={() => nav("/seller/company-documents")}
              className="shrink-0 px-3 py-2 rounded-lg bg-rose-600 text-white text-sm hover:brightness-110"
            >
              Belge Yükle
            </button>
          </div>
        )}
      </div>

      {/* Hero Başlık + Sekmeler */}
      <header className="mb-12 relative bg-gradient-to-r from-[#e9f0ee] to-[#f3f8f7] rounded-2xl shadow px-6 py-12 sm:px-12 text-center">
        <h1 className="text-5xl font-extrabold text-[#003636] tracking-tight mb-3">
          Satıcı Profil Paneli
        </h1>
        <p className="text-gray-600 text-base max-w-2xl mx-auto">
          Tedarika satıcı hesabınıza ait tüm bilgileri modern ve sezgisel bir arayüzle görüntüleyin.
        </p>

        <nav className="mt-8 flex justify-center flex-wrap gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab.key
                    ? "bg-[#003636] text-white border-[#003636] shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
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
