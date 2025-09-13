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

  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setChecking(true);

      // Bu path’ler için kontrol yapmayalım (serbest rotalar)
      if (passPaths.has(loc.pathname)) {
        setChecking(false);
        return;
      }

      try {
        // Şirket var mı?
        const companyExists = await hasCompany();

        if (!companyExists && !cancelled) {
          // Şirket yoksa company/create’e at
          setRedirect("/seller/company/create");
          return;
        }

        // (Ek yönlendirmeler varsa burada yapılırdı – kaldırıldı)
      } finally {
        if (!cancelled) setChecking(false);
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

  if (checking) {
    return <div className="p-10 text-gray-600">Kontrol ediliyor…</div>;
  }

  // Bu sayfalar layout’suz render edilir (özellikle /seller/company/create)
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
