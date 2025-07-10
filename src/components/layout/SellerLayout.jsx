import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { hasCompany } from "@/api/sellerCompanyService";

const SellerLayout = () => {
  const [checking, setChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const exemptPaths = ["/seller/company", "/seller/logout"];

  useEffect(() => {
    const verifyCompany = async () => {
      if (exemptPaths.includes(location.pathname)) {
        setChecking(false);
        return;
      }
      try {
        const exists = await hasCompany();
        if (!exists) navigate("/seller/company");
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
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-white/70 backdrop-blur-xl rounded-tl-3xl shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
