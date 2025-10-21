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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between w-full px-6 py-3">
        {/* Sol Menü Butonu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-md transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-xl md:text-2xl font-semibold text-[#003636] tracking-tight select-none">
            Satıcı Paneli
          </h1>
        </div>

        {/* Sağ Taraf */}
        <div className="flex items-center gap-4">
          {!user?.sellerId && (
            <a
              href="/seller/apply"
              className="text-sm bg-[#ffc107] text-black font-medium px-4 py-1.5 rounded-md hover:bg-[#ffca2c] transition shadow-sm"
            >
              Başvuru Yap
            </a>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center bg-[#003636] text-white rounded-full font-semibold shadow-inner"
                title={user?.email || ""}
              >
                {initials}
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-medium text-gray-800">
                  {user?.name || "Kullanıcı"}
                </span>
                <span className="text-xs text-gray-500">
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
