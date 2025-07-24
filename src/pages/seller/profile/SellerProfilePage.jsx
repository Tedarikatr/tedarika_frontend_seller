import React, { useState } from "react";
import {
  UserCircle,
  Building2,
  Store,
  ShieldCheck,
} from "lucide-react";

import SellerInfoCard from "@/components/seller/SellerInfoCard";
import StoreInfoCard from "@/components/seller/StoreInfoCard";
import CompanyInfoCard from "@/components/seller/CompanyInfoCard";
import SubscriptionInfoCard from "@/components/seller/SubscriptionInfoCard";

const TABS = [
  { key: "seller", label: "Satıcı", icon: <UserCircle className="w-5 h-5" /> },
  { key: "company", label: "Şirket", icon: <Building2 className="w-5 h-5" /> },
  { key: "store", label: "Mağaza", icon: <Store className="w-5 h-5" /> },
  { key: "subscription", label: "Abonelik", icon: <ShieldCheck className="w-5 h-5" /> },
];

const SellerProfilePage = () => {
  const [activeTab, setActiveTab] = useState("seller");

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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafa] px-4 sm:px-6 lg:px-16 py-10">
      {/* Hero Başlık + Sekmeler */}
      <header className="mb-16 relative bg-[#e9f0ee] rounded-xl shadow-sm px-6 py-10 sm:px-12 text-center">
        <h1 className="text-5xl font-extrabold text-[#003636] tracking-tight mb-3">
          Satıcı Profil Paneli
        </h1>
        <p className="text-gray-600 text-base max-w-2xl mx-auto">
          Tedarika satıcı hesabınıza ait tüm bilgileri modern ve sezgisel bir arayüzle görüntüleyin.
        </p>

        {/* Sekme Butonları */}
        <nav className="mt-8 flex justify-center flex-wrap gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200
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

      {/* İçerik Alanı */}
      <main className="max-w-5xl mx-auto">
        <section className="transition-opacity duration-300 ease-in-out">
          {renderActiveCard()}
        </section>
      </main>
    </div>
  );
};

export default SellerProfilePage;
