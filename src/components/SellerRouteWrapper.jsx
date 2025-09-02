// src/components/SellerRouteWrapper.jsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SellerLayout from "@/components/layout/SellerLayout";

import { hasCompany } from "@/api/sellerCompanyService";

// Bu sayfalar kontrol dışında kalsın (kendilerine gidilebilir)
const passPaths = new Set([
  "/seller/company/create",
  "/seller/profile/extra-info",
  "/seller/company-documents",
  "/seller/subscription",
]);

const SellerRouteWrapper = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setChecking(true);

      // Abonelik sayfasını kontrol etmiyoruz
      if (loc.pathname === "/seller/subscription") {
        setChecking(false);
        return;
      }

      try {
        // 1) Şirket kontrolü (devam eder)
        const companyExists = await hasCompany();
        if (!companyExists) {
          if (!passPaths.has(loc.pathname) && !cancelled) {
            setRedirect("/seller/company/create");
          }
          return;
        }

        // 2) ❌ Extra Info yönlendirmesi KALDIRILDI
        // 3) ❌ Belgeler yönlendirmesi KALDIRILDI
        //    (Eksikler profil sayfasında uyarı + butonlarla gösteriliyor)

      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loc.pathname, nav]);

  useEffect(() => {
    if (redirect && loc.pathname !== redirect) {
      nav(redirect, { replace: true });
      setRedirect("");
    }
  }, [redirect, nav, loc.pathname]);

  if (checking) return <div className="p-10 text-gray-600">Kontrol ediliyor…</div>;

  return (
    <SellerLayout>
      <Outlet />
    </SellerLayout>
  );
};

export default SellerRouteWrapper;
