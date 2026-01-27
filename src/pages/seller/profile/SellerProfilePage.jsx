import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  UserCircle,
  Building2,
  Store,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Award,
  CheckCircle,
  Mail,
  Truck,
} from "lucide-react";

import SellerInfoCard from "@/components/seller/SellerInfoCard";
import StoreInfoCard from "@/components/seller/StoreInfoCard";
import CompanyInfoCard from "@/components/seller/CompanyInfoCard";
import SellerFinanceInfoCard from "@/components/seller/SellerFinanceInfoCard";
import BulletinPreferencesCard from "@/components/seller/BulletinPreferencesCard";
import SubscriptionPlans from "@/components/seller/SubscriptionPlans"; // 👈 SubscriptionPage'den çıkarılıp component olarak kaydedilecek
import SellerGeliverIntegrationCard from "@/components/seller/SellerGeliverIntegrationCard";

const TABS = [
  { key: "seller", label: "Satıcı", icon: <UserCircle className="w-5 h-5" /> },
  { key: "company", label: "Şirket", icon: <Building2 className="w-5 h-5" /> },
  { key: "store", label: "Mağaza", icon: <Store className="w-5 h-5" /> },
  { key: "subscription", label: "Abonelik", icon: <ShieldCheck className="w-5 h-5" /> },
  { key: "finance", label: "Ödeme", icon: <CreditCard className="w-5 h-5" /> },
  { key: "cargo", label: "Kargo Entegrasyonu", icon: <Truck className="w-5 h-5" /> },
  { key: "notifications", label: "İletişim Tercihleri", icon: <Mail className="w-5 h-5" /> },
];

const SellerProfilePage = () => {
  const location = useLocation();
  const isSubscribed =
    localStorage.getItem("sellerSubscriptionActive") === "true";

  const [activeTab, setActiveTab] = useState(
    isSubscribed ? "seller" : "subscription"
  );

  // Hash'ten tab belirleme
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && TABS.some((tab) => tab.key === hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Custom event ile tab değiştirme (UserMenu'den gelen)
  useEffect(() => {
    const handleTabChange = (event) => {
      const tab = event.detail?.tab;
      if (tab && TABS.some((t) => t.key === tab)) {
        setActiveTab(tab);
      }
    };

    window.addEventListener("profile-tab-change", handleTabChange);
    return () => {
      window.removeEventListener("profile-tab-change", handleTabChange);
    };
  }, []);

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
      case "cargo":
        return <SellerGeliverIntegrationCard />;
      case "notifications":
        return <BulletinPreferencesCard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafa] px-4 sm:px-6 lg:px-16 py-10">
      {/* Hero Başlık */}
      <header className="mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl shadow-2xl px-8 py-12 sm:px-12 text-center overflow-hidden">
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
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto font-medium">
              Tedarika satıcı hesabınıza ait tüm bilgileri modern ve sezgisel bir arayüzle görüntüleyin.
            </p>          {/* Modern Tab Navigation */}
          <nav className="mt-10 flex justify-center flex-wrap gap-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  // Hash'i güncelle
                  window.history.replaceState(null, "", `/seller/profile#${tab.key}`);
                }}
                className={`group flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform
                  ${
                    activeTab === tab.key
                      ? "bg-white text-emerald-700 shadow-xl scale-105"
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
