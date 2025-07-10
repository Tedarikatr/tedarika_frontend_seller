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
        name: payload["UserType"],
      });
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
    }
  }, []);

  const initials = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";

  return (
    <header className="bg-white/80 backdrop-blur-md px-4 md:px-6 py-3 flex items-center justify-between shadow-sm border-b border-gray-200">
      {/* Mobile Menu Button */}
      <button className="md:hidden p-2 text-gray-600" onClick={onMenuClick}>
        <Menu className="w-6 h-6" />
      </button>

      <h1 className="text-lg md:text-xl font-semibold text-gray-800">Satıcı Paneli</h1>

      <div className="flex items-center gap-3 text-sm text-gray-700">
        <div
          className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-inner"
          title={user?.email || ""}
        >
          {initials}
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="font-medium">{user?.name || "..."}</span>
          <span className="text-xs text-gray-500">{user?.email || "Yükleniyor..."}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
