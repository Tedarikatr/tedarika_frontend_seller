import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SellerLayout from "@/components/layout/SellerLayout";
import { hasCompany } from "@/api/sellerCompanyService";

const passPaths = new Set([
  "/seller/company/create",
  "/seller/profile/extra-info",
  "/seller/company-documents",
]);

const noLayoutPaths = new Set(["/seller/company/create"]);

const SellerRouteWrapper = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (passPaths.has(loc.pathname)) return;

    (async () => {
      try {
        const companyExists = await hasCompany();
        if (!companyExists && !cancelled)
          setRedirect("/seller/company/create");
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

  if (noLayoutPaths.has(loc.pathname)) return <Outlet />;

  return (
    <SellerLayout>
      <div className="relative min-h-screen">
        <Outlet />
      </div>
    </SellerLayout>
  );
};

export default SellerRouteWrapper;
