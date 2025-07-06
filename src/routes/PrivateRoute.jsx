// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { isSellerAuthenticated } from "@/utils/auth";

const PrivateRoute = ({ children }) => {
  return isSellerAuthenticated() ? children : <Navigate to="/seller/login" replace />;
};

export default PrivateRoute;
