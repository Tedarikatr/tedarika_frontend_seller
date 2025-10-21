import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  const [user, setUser] = useState(null);

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

  const initials =
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#003131] border-b border-white/10 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between w-full px-5 py-3">
        {/* Sol Menü Butonu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-md transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-xl md:text-2xl font-semibold text-emerald-300 tracking-tight select-none drop-shadow">
            Satıcı Paneli
          </h1>
        </div>

        {/* Sağ Taraf */}
        <div className="flex items-center gap-5">
          {!user?.sellerId && (
            <a
              href="/seller/apply"
              className="text-sm bg-emerald-400/90 text-[#003131] font-semibold px-4 py-1.5 rounded-md hover:bg-emerald-300 transition-all shadow-sm"
            >
              Başvuru Yap
            </a>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-full font-semibold shadow-inner border border-emerald-300/40"
                title={user?.email || ""}
              >
                {initials}
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-medium text-white">
                  {user?.name || "Kullanıcı"}
                </span>
                <span className="text-xs text-emerald-200/70">
                  {user?.email || ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
