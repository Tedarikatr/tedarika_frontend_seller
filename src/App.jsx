import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import RegisterPage from "@/pages/seller/RegisterPage";
import LoginPage from "@/pages/seller/LoginPage";
import DashboardPage from "@/pages/seller/DashboardPage";

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
      {/* Herkese açık seller sayfaları */}
      <Route path="/seller/register" element={<RegisterPage />} />
      <Route path="/seller/login" element={<LoginPage />} />
      <Route path="/seller/company" element={<CompanyCreate />} />

      {/* Giriş gerektiren seller layout'lu alan */}
      <Route
        path="/seller"
        element={
          <PrivateRoute>
            <SellerLayout />
          </PrivateRoute>
        }
      >
        {/* 🔒 Layout altında gösterilecek içerikler */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="company-profile" element={<CompanyUpdate />} />
        <Route path="company-view" element={<CompanyView />} />
        <Route path="store" element={<StorePage />} />
        <Route path="store/create" element={<StoreCreate />} />
        <Route path="store/update" element={<StoreUpdate />} />
        <Route path="*" element={<Navigate to="/seller/dashboard" replace />} />
      </Route>

      {/* Tüm bilinmeyen yollar → dashboard */}
      <Route path="*" element={<Navigate to="/seller/dashboard" replace />} />
    </Routes>
  );
}

export default App;
