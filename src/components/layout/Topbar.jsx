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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#003131] via-[#004040] to-[#003131] border-b-2 border-emerald-500/30 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between w-full px-5 py-4">
        {/* Sol Menü Butonu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden text-white/90 hover:text-white hover:bg-white/15 p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight select-none drop-shadow-lg bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
                Satıcı Paneli
              </h1>
              <p className="hidden md:block text-xs text-emerald-200/80 font-medium mt-0.5">
                Profesyonel Satış Yönetimi
              </p>
            </div>
          </div>
        </div>

        {/* Sağ Taraf */}
        <div className="flex items-center gap-4">
          {!user?.sellerId && (
            <a
              href="/seller/apply"
              className="text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Başvuru Yap
            </a>
          )}

          {user && (
            <>
              {/* Bildirimler */}
              <NotificationDropdown />

              {/* Kullanıcı Bilgisi */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col leading-tight text-right">
                  <span className="font-bold text-white text-base">
                    {user?.name || "Kullanıcı"}
                  </span>
                  <span className="text-xs text-emerald-200/80 font-medium">
                    {user?.email || ""}
                  </span>
                </div>
                {/* User Menu */}
                <UserMenu user={user} storeLogo={storeLogo} initials={initials} />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
