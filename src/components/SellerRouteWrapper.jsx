import { Navigate, Outlet } from "react-router-dom";
import { useSellerAuth } from "@/context/SellerAuthContext"; // senin context yoluna göre değiştir
import SellerLayout from "@/components/layout/SellerLayout"; // varsa özel satıcı layout

const SellerRouteWrapper = () => {
  const { user, loading } = useSellerAuth();

  if (loading) return <div className="p-10 text-gray-600">Yükleniyor...</div>;

  // Giriş yapılmamışsa login sayfasına gönder
  if (!user) return <Navigate to="/seller/login" replace />;

  // Rol kontrolü: sadece Seller kullanıcıları girebilir
  if (user.role !== "Seller") return <Navigate to="/unauthorized" replace />;

  // Abonelik kontrolü: aktif değilse abonelik sayfasına yönlendir
  if (!user.subscriptionActive) return <Navigate to="/seller/subscription" replace />;

  return (
    <SellerLayout>
      <Outlet />
    </SellerLayout>
  );
};

export default SellerRouteWrapper;
