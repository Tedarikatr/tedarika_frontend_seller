import { Navigate } from "react-router-dom";
import { getDecodedSellerPayload } from "@/utils/auth";

const SemiPrivateRoute = ({ children }) => {
  const payload = getDecodedSellerPayload();

  if (!payload)
    return <Navigate to="/seller/login" replace state={{ sessionExpired: true }} />;

  const isAuthenticated =
    payload?.userType === "Seller" || payload?.UserType === "Seller";

  const isSubscribed =
    payload?.subscriptionActive === true || payload?.subscriptionActive === "true";

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" replace state={{ sessionExpired: true }} />;
  }

  // Eğer zaten aboneliği varsa dashboard’a yönlendir
  if (isSubscribed) return <Navigate to="/seller/dashboard" replace />;

  return children;
};

export default SemiPrivateRoute;
