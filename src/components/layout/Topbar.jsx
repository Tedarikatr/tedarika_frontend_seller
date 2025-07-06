// src/components/layout/Topbar.jsx
import { useEffect, useState } from "react";

const Topbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      setUser({
        email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        sellerId: payload["SellerUserId"],
        name: payload["UserType"], // İsim yoksa UserType gösterilir
      });
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
    }
  }, []);

  const initials = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <header className="bg-white/70 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-sm border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800">Satıcı Paneli</h1>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
          {initials}
        </div>
        {user?.email || "Yükleniyor..."}
      </div>
    </header>
  );
};

export default Topbar;
