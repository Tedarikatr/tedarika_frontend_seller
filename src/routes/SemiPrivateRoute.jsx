import { Navigate } from "react-router-dom";

const getDecodedSellerPayload = () => {
  const raw =
    localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken");
  if (!raw) return null;

  try {
    const payload = JSON.parse(atob(raw.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("sellerToken");
      sessionStorage.removeItem("sellerToken");
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

const SemiPrivateRoute = ({ children }) => {
  const payload = getDecodedSellerPayload();

  if (!payload) return <Navigate to="/seller/login" replace state={{ sessionExpired: true }} />;

  const isAuthenticated =
    payload?.userType === "Seller" || payload?.UserType === "Seller";

  const isSubscribed =
    payload?.subscriptionActive === true ||
    payload?.subscriptionActive === "true" ||
    payload?.SubscriptionActive === true ||
    payload?.SubscriptionActive === "true";

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" replace state={{ sessionExpired: true }} />;
  }
  if (isSubscribed) return <Navigate to="/seller/dashboard" replace />;

  return children;
};

export default SemiPrivateRoute;
