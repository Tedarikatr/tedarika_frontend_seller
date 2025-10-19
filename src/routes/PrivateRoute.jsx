import { Navigate } from "react-router-dom";
import { getDecodedSellerPayload } from "@/utils/auth";

const PrivateRoute = ({ children }) => {
  const payload = getDecodedSellerPayload();

  if (!payload) {
    return <Navigate to="/seller/login" replace state={{ sessionExpired: true }} />;
  }

  const isAuthenticated =
    payload?.userType === "Seller" || payload?.UserType === "Seller";

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" replace state={{ sessionExpired: true }} />;
  }

  return children;
};

export default PrivateRoute;
