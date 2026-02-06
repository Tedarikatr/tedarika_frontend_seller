import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
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
import ShippingSettingsCard from "@/components/seller/ShippingSettingsCard";

const TABS = [
  { key: "seller", label: "Satıcı", icon: <UserCircle className="w-5 h-5" /> },
  { key: "company", label: "Şirket", icon: <Building2 className="w-5 h-5" /> },
  { key: "store", label: "Mağaza", icon: <Store className="w-5 h-5" /> },
  { key: "subscription", label: "Abonelik", icon: <ShieldCheck className="w-5 h-5" /> },
  { key: "finance", label: "Ödeme", icon: <CreditCard className="w-5 h-5" /> },
  { key: "cargo", label: "Kargo Ayarları", icon: <Truck className="w-5 h-5" /> },
  { key: "notifications", label: "İletişim Tercihleri", icon: <Mail className="w-5 h-5" /> },
];

const SellerProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("seller");

  // Hash'ten tab belirleme
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && TABS.some((tab) => tab.key === hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Şirket güncellemeden yönlendirildiyse bildirim göster ve state temizle
  useEffect(() => {
    if (location.state?.companyUpdated) {
      toast.success("Şirket bilgileri başarıyla güncellendi.");
      setActiveTab("company");
      navigate("/seller/profile#company", { replace: true, state: {} });
    }
  }, [location.state?.companyUpdated, navigate]);

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
        return <ShippingSettingsCard />;
      case "notifications":
        return <BulletinPreferencesCard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafa] px-4 sm:px-6 lg:px-8 xl:px-16 py-6 sm:py-8 lg:py-10">
      {/* Hero Başlık */}
      <header className="mb-6 sm:mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-10 lg:py-12 text-center overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl hidden sm:block"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight">
              Satıcı Profil Paneli
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse hidden sm:block" />
            </div>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-medium px-2">
              Tedarika satıcı hesabınıza ait tüm bilgileri modern ve sezgisel bir arayüzle görüntüleyin.
            </p>          {/* Modern Tab Navigation */}
          <nav className="mt-6 sm:mt-8 lg:mt-10 flex justify-center flex-wrap gap-2 sm:gap-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  // Hash'i güncelle
                  window.history.replaceState(null, "", `/seller/profile#${tab.key}`);
                }}
                className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 transform
                  ${
                    activeTab === tab.key
                      ? "bg-white text-emerald-700 shadow-xl scale-105"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105 hover:shadow-lg"
                  }`}
              >
                <div className={`transition-transform duration-300 ${activeTab === tab.key ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {tab.icon}
                </div>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                {activeTab === tab.key && (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
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
