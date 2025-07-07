import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { hasCompany } from "@/api/sellerCompanyService";

const SellerLayout = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const exemptPaths = ["/seller/company", "/seller/logout"];

  useEffect(() => {
    const verifyCompany = async () => {
      const currentPath = location.pathname;

      if (exemptPaths.includes(currentPath)) {
        setChecking(false);
        return;
      }

      try {
        const exists = await hasCompany();
        if (!exists) {
          navigate("/seller/company");
        }
      } catch (err) {
        console.error("Şirket kontrolü sırasında hata:", err);
      } finally {
        setChecking(false);
      }
    };

    verifyCompany();
  }, [location.pathname, navigate]);

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center text-[#003636] text-lg">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-6 bg-white/70 backdrop-blur-xl rounded-tl-3xl shadow-lg">
          <Outlet /> {/* 🔁 Burası nested route'ları gösterir */}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
