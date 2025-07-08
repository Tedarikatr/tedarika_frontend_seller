import { Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "@/pages/seller/RegisterPage";
import LoginPage from "@/pages/seller/LoginPage";
import DashboardPage from "@/pages/seller/DashboardPage";
import SellerLandingPage from "@/pages/seller/SellerLandingPage";

import {
  CompanyCreate,
  CompanyUpdate,
  CompanyView,
} from "@/pages/seller/company";

import {
  StoreCreate,
  StoreUpdate,
  StorePage,
} from "@/pages/seller/store";

import SellerLayout from "@/components/layout/SellerLayout";
import PrivateRoute from "@/routes/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* 🎯 Tanıtım sayfası */}
      <Route path="/seller" element={<SellerLandingPage />} />

      {/* Herkese açık seller sayfaları */}
      <Route path="/seller/register" element={<RegisterPage />} />
      <Route path="/seller/login" element={<LoginPage />} />
      <Route path="/seller/company" element={<CompanyCreate />} />

      {/* 🔒 Giriş gerektiren seller layout'lu alanlar */}
      <Route
        path="/seller"
        element={
          <PrivateRoute>
            <SellerLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="company-profile" element={<CompanyUpdate />} />
        <Route path="company-view" element={<CompanyView />} />
        <Route path="store" element={<StorePage />} />
        <Route path="store/create" element={<StoreCreate />} />
        <Route path="store/update" element={<StoreUpdate />} />
      </Route>

      {/* Tüm bilinmeyen yollar tanıtım sayfasına yönlensin */}
      <Route path="*" element={<Navigate to="/seller" replace />} />
    </Routes>
  );
}

export default App;
