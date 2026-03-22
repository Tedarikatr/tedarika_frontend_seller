import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import UserMenu from "./UserMenu";
import { getMyStore } from "@/api/sellerStoreService";

const Topbar = ({ onMenuClick }) => {
  const [user, setUser] = useState(null);
  const [storeLogo, setStoreLogo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        email:
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ],
        sellerId: payload["SellerUserId"],
        name: payload["UserType"],
      });
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
    }
  }, []);

  // Mağaza logosunu yükle
  useEffect(() => {
    const loadStoreLogo = async () => {
      try {
        const store = await getMyStore();
        if (store?.logoUrl) {
          setStoreLogo(store.logoUrl);
        }
      } catch (err) {
        // Mağaza bulunamadı veya logo yok, sessizce devam et
        console.debug("Mağaza logosu yüklenemedi:", err);
      }
    };

    if (user?.sellerId) {
      loadStoreLogo();
    }
  }, [user?.sellerId]);

  const initials =
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <header className="sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,0px)] bg-gradient-to-r from-[#003131] via-[#004040] to-[#003131] border-b-2 border-emerald-500/30 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4">
        {/* Sol Menü Butonu */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 p-2 rounded-lg transition-all duration-300 hover:scale-110 flex-shrink-0 touch-manipulation"
            aria-label="Menü"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 items-center justify-center shadow-lg flex-shrink-0 hover:scale-110 transition-transform duration-300 cursor-pointer group">
              <span className="text-white font-extrabold text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300">T</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight select-none drop-shadow-lg bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent truncate">
                Satıcı Paneli
              </h1>
              <p className="hidden md:block text-xs text-emerald-200/80 font-medium mt-0.5">
                Profesyonel Satış Yönetimi
              </p>
            </div>
          </div>
        </div>

        {/* Sağ Taraf */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          {!user?.sellerId && (
            <a
              href="/seller/apply"
              className="text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
            >
              Başvuru Yap
            </a>
          )}

          {user && (
            <>
              {/* Bildirimler */}
              <div className="flex-shrink-0">
                <NotificationDropdown />
              </div>

              {/* Kullanıcı Bilgisi */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="hidden lg:flex flex-col leading-tight text-right">
                  <span className="font-bold text-white text-sm md:text-base">
                    {user?.name || "Kullanıcı"}
                  </span>
                  <span className="text-xs text-emerald-200/80 font-medium">
                    {user?.email || ""}
                  </span>
                </div>
                {/* User Menu */}
                <div className="flex-shrink-0">
                  <UserMenu user={user} storeLogo={storeLogo} initials={initials} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
