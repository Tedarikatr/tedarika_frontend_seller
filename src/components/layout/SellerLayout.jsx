import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { hasCompany } from "@/api/sellerCompanyService";
import { getMyStore } from "@/api/sellerStoreService";
import { AlertCircle, Lock } from "lucide-react";
import { getDecodedSellerPayload } from "@/utils/auth";

const SellerLayout = () => {
  const [checking, setChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStoreNotification, setShowStoreNotification] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const exemptPaths = [
    "/seller/company",
    "/seller/store/create",
    "/seller/logout",
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

  // 🔒 Abonelik kontrolü
  useEffect(() => {
    const payload = getDecodedSellerPayload();

    const isSubscribed =
      payload?.subscriptionActive === true ||
      payload?.subscriptionActive === "true" ||
      localStorage.getItem("sellerSubscriptionActive") === "true";

    const isSystemActive =
      payload?.isthesystemactive === true ||
      payload?.isthesystemactive === "true" ||
      localStorage.getItem("sellerSystemActive") === "true";

    setIsRestricted(!isSubscribed || !isSystemActive);
  }, []);

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

  // 🔹 Profil serbest, diğer sayfalar blur + uyarı
  const isProfilePage = location.pathname.startsWith("/seller/profile");
  const shouldShowOverlay = isRestricted && !isProfilePage;

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        disabled={shouldShowOverlay}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-white relative">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main
          className={`flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-white/60 backdrop-blur-2xl rounded-tl-3xl shadow-inner relative transition ${
            shouldShowOverlay ? "pointer-events-none opacity-40 blur-sm" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* 🔒 Abonelik Uyarısı */}
      {shouldShowOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[9999]">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl px-8 py-6 text-center max-w-md">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
                <Lock className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Erişiminiz Sınırlı
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Aboneliğiniz aktif değil. Profil sayfasından abonelik planınızı başlatabilirsiniz.
            </p>
            <button
              onClick={() => navigate("/seller/profile")}
              className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Profil Sayfasına Git
            </button>
          </div>
        </div>
      )}

      {/* 🔔 Mağaza Uyarısı */}
      {showStoreNotification && !isRestricted && (
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
