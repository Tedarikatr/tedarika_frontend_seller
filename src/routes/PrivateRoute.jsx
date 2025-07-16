import { Navigate } from "react-router-dom";

const getDecodedSellerPayload = () => {
  const raw = localStorage.getItem("sellerToken");
  if (!raw) return null;

  try {
    return JSON.parse(atob(raw.split(".")[1]));
  } catch {
    return null;
  }
};

const PrivateRoute = ({ children }) => {
  const payload = getDecodedSellerPayload();

  if (!payload) return <Navigate to="/seller/login" replace />;

  const isAuthenticated =
    payload?.userType === "Seller" || payload?.UserType === "Seller";

  const isSubscribed =
    payload?.subscriptionActive === true ||
    payload?.subscriptionActive === "true" ||
    payload?.SubscriptionActive === true ||
    payload?.SubscriptionActive === "true";

  if (!isAuthenticated) return <Navigate to="/seller/login" replace />;
  if (!isSubscribed) return <Navigate to="/seller/subscription" replace />;

  return children;
};

export default PrivateRoute;
