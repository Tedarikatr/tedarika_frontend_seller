import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SellerLayout from "@/components/layout/SellerLayout";
import { hasCompany } from "@/api/sellerCompanyService";
import { getDecodedSellerPayload } from "@/utils/auth";

const passPaths = new Set([
  "/seller/company/create",
  "/seller/profile/extra-info",
  "/seller/company-documents",
  "/seller/subscription",
]);

const noLayoutPaths = new Set(["/seller/company/create"]);

const SellerRouteWrapper = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const [redirect, setRedirect] = useState("");

  const payload = getDecodedSellerPayload();

  // ✅ Doğru alan ismi: "isthesystemactive"
  const isSubscribed =
    payload?.subscriptionActive === true ||
    payload?.subscriptionActive === "true" ||
    localStorage.getItem("sellerSubscriptionActive") === "true";

  const isSystemActive =
    payload?.isthesystemactive === true ||
    payload?.isthesystemactive === "true" ||
    localStorage.getItem("sellerSystemActive") === "true";

  const isBlurred = !isSystemActive || !isSubscribed;

  console.log("🟢 Satıcı aktiflik durumu:", {
    isthesystemactive: isSystemActive,
    subscriptionActive: isSubscribed,
  });

  useEffect(() => {
    let cancelled = false;
    if (passPaths.has(loc.pathname)) return;

    (async () => {
      try {
        const companyExists = await hasCompany();
        if (!companyExists && !cancelled) setRedirect("/seller/company/create");
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

  if (noLayoutPaths.has(loc.pathname)) {
    return <Outlet />;
  }

  return (
    <SellerLayout>
      <div className="relative min-h-screen">
        {/* Sayfalar */}
        <div
          className={
            isBlurred && loc.pathname !== "/seller/profile"
              ? "pointer-events-none opacity-50 blur-sm"
              : ""
          }
        >
          <Outlet />
        </div>

        {/* Erişim Kısıtlama Overlay */}
        {isBlurred && loc.pathname !== "/seller/profile" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
            <div className="bg-white shadow-lg p-5 rounded-lg text-center max-w-md">
              <p className="font-semibold text-gray-800">
                Erişiminiz şu anda kısıtlı.
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Profilinizi tamamlayın veya aboneliğinizi aktif edin.
              </p>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerRouteWrapper;
