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
        email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        sellerId: payload["SellerUserId"],
        name: payload["UserType"], // İstersen backend'den gelen "name" alanına göre değiştirebilirsin
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded transition"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Başlık */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-tight">
          Satıcı Paneli
        </h1>

        {/* Kullanıcı Bilgisi ve Başvuru */}
        <div className="flex items-center gap-3 text-sm text-gray-700">
          {/* Başvuru yapmamış kullanıcılar için buton */}
          {!user?.sellerId && (
            <a
              href="/seller/apply"
              className="text-sm bg-yellow-400 text-black font-medium px-3 py-1 rounded hover:bg-yellow-500 transition"
            >
              Başvuru Yap
            </a>
          )}

          {/* Kullanıcı avatarı ve bilgileri */}
          {user && (
            <>
              <div
                className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-inner"
                title={user?.email || ""}
              >
                {initials}
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-medium text-gray-800">
                  {user?.name || "..."}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.email || "Yükleniyor..."}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
