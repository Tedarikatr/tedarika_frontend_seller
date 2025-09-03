import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { hasCompany } from "@/api/sellerCompanyService";
import { getMyStore } from "@/api/sellerStoreService";
import { AlertCircle } from "lucide-react";

const SellerLayout = () => {
  const [checking, setChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStoreNotification, setShowStoreNotification] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const exemptPaths = [
    "/seller/company",
    "/seller/store/create",
    "/seller/logout"
  ];

  useEffect(() => {
    const verifySellerState = async () => {
      if (exemptPaths.includes(location.pathname)) {
        setChecking(false);
        return;
      }

      try {
        const companyExists = await hasCompany();
        if (!companyExists) {
          navigate("/seller/company");
          return;
        }

        try {
          const store = await getMyStore();
          if (!store || !store.id) {
            setShowStoreNotification(true);
          }
        } catch {
          setShowStoreNotification(true);
        }

      } catch (err) {
        console.error("Yetkili durum kontrolünde hata:", err);
      } finally {
        setChecking(false);
      }
    };

    verifySellerState();
  }, [location.pathname, navigate]);

  const handleCreateStore = () => {
    setShowStoreNotification(false);
    navigate("/seller/store/create");
  };

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-white text-[#003636] text-lg font-semibold animate-pulse">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-white relative">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-white/60 backdrop-blur-2xl rounded-tl-3xl shadow-inner">
          <Outlet />
        </main>
      </div>

      {/* 🔔 Store Notification */}
      {showStoreNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-[90%] md:w-auto">
          <div className="bg-white border border-yellow-400 shadow-xl rounded-xl px-6 py-4 flex items-center gap-4 animate-fade-in-down backdrop-blur-lg bg-opacity-90">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <div className="text-sm text-gray-800 font-medium">
              Henüz bir mağazanız yok. Satışa başlayabilmek için bir mağaza oluşturmalısınız.
            </div>
            <button
              onClick={handleCreateStore}
              className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-1.5 rounded-md font-semibold transition duration-200"
            >
              Mağaza Oluştur
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerLayout;