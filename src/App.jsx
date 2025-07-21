import { Routes, Route, Navigate } from "react-router-dom";

// Seller sayfaları
import RegisterPage from "@/pages/seller/RegisterPage";
import LoginPage from "@/pages/seller/LoginPage";
import DashboardPage from "@/pages/seller/DashboardPage";
import SellerLandingPage from "@/pages/seller/SellerLandingPage";

import { CompanyCreate, CompanyUpdate, CompanyView } from "@/pages/seller/company";
import { StoreCreate, StoreUpdate, StorePage } from "@/pages/seller/store";

import MyStoreProductsPage from "@/pages/seller/products/MyStoreProductsPage";
import ProductDatabasePage from "@/pages/seller/products/ProductDatabasePage";
import ProductRequestListPage from "@/pages/seller/products/ProductRequestListPage";

import StoreCoveragePage from "@/pages/seller/location/StoreCoveragePage";
import OrderListPage from "@/pages/seller/orders/OrderListPage";
import OrderDetailPage from "@/pages/seller/orders/OrderDetailPage";
import SellerQuotationListPage from "./pages/seller/quotations/QuotationListPage";
import SubscriptionPage from "@/pages/seller/subscription/SubscriptionPage";
import StoreReviewsPage from "@/pages/seller/reviews/StoreReviewsPage";
import ProductReviewsPage from "@/pages/seller/reviews/ProductReviewsPage";
import SellerLayout from "@/components/layout/SellerLayout";
import PrivateRoute from "@/routes/PrivateRoute";
import SemiPrivateRoute from "@/routes/SemiPrivateRoute";
import QuotationDetailPage from "@/pages/seller/quotations/QuotationDetailPage";

function App() {
  return (
    <Routes>
      {/* Açık seller sayfaları */}
      <Route path="/seller" element={<SellerLandingPage />} />
      <Route path="/seller/register" element={<RegisterPage />} />
      <Route path="/seller/login" element={<LoginPage />} />
      <Route path="/seller/company" element={<CompanyCreate />} />

      {/* 🟡 Girişli ama abone olmayanlara açık: */}
      <Route
        path="/seller/subscription"
        element={
          <SemiPrivateRoute>
            <SubscriptionPage />
          </SemiPrivateRoute>
        }
      />

      {/* 🔒 Giriş + abonelik gereken seller panel alanı */}
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
        <Route path="store/coverage" element={<StoreCoveragePage />} />
        <Route path="/seller/reviews" element={<StoreReviewsPage />} />
        <Route path="/seller/products/:productId/reviews" element={<ProductReviewsPage />} />

        <Route path="products/my-store" element={<MyStoreProductsPage />} />
        <Route path="products/database" element={<ProductDatabasePage />} />
        <Route path="products/requests" element={<ProductRequestListPage />} />
        <Route path="/seller/quotations" element={<SellerQuotationListPage />} />
        <Route path="orders" element={<OrderListPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="quotations/:id" element={<QuotationDetailPage />} />

      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/seller" replace />} />
    </Routes>
  );
}

export default App;
