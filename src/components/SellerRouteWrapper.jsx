// src/components/SellerRouteWrapper.jsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SellerLayout from "@/components/layout/SellerLayout";
import { hasCompany } from "@/api/sellerCompanyService";

// Kontrolden muaf rotalar (doğrudan girilebilir)
const passPaths = new Set([
  "/seller/company/create",
  "/seller/profile/extra-info",
  "/seller/company-documents",
  "/seller/subscription",
]);

// Layout KULLANMAYACAK rotalar
const noLayoutPaths = new Set([
  "/seller/company/create",
  // gerekirse başkalarını ekleyebilirsin
]);

const SellerRouteWrapper = () => {
  const nav = useNavigate();
  const loc = useLocation();

  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Bu path’ler için kontrol yapmayalım (serbest rotalar)
      if (passPaths.has(loc.pathname)) return;

      try {
        const companyExists = await hasCompany();

        if (!companyExists && !cancelled) {
          setRedirect("/seller/company/create");
        }
      } catch (err) {
        console.error("Şirket kontrolü başarısız:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loc.pathname]);

  useEffect(() => {
    if (redirect && loc.pathname !== redirect) {
      nav(redirect, { replace: true });
      setRedirect("");
    }
  }, [redirect, nav, loc.pathname]);

  // Layout’suz sayfalar doğrudan render edilir
  if (noLayoutPaths.has(loc.pathname)) {
    return <Outlet />;
  }

  // Diğer tüm sayfalar SellerLayout içinde render edilir
  return (
    <SellerLayout>
      <Outlet />
    </SellerLayout>
  );
};

export default SellerRouteWrapper;
