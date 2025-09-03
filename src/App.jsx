import { Routes, Route, Navigate } from "react-router-dom";

// Açık seller sayfaları
import SellerLandingPage from "@/pages/seller/SellerLandingPage";
import RegisterPage from "@/pages/seller/RegisterPage";
import LoginPage from "@/pages/seller/LoginPage";
import SellerApplicationPage from "@/pages/seller/SellerApplicationPage";

// Abonelik
import SubscriptionPage from "@/pages/seller/subscription/SubscriptionPage";

// Korumalı seller sayfaları
import DashboardPage from "@/pages/seller/DashboardPage";
import SellerProfilePage from "@/pages/seller/profile/SellerProfilePage";
import { CompanyUpdate } from "@/pages/seller/company";
import { StoreCreate, StoreUpdate } from "@/pages/seller/store";
import StoreCoveragePage from "@/pages/seller/location/StoreCoveragePage";
import MyStoreProductsPage from "@/pages/seller/products/MyStoreProductsPage";
import ProductDatabasePage from "@/pages/seller/products/ProductDatabasePage";
import ProductRequestListPage from "@/pages/seller/products/ProductRequestListPage";
import OrderListPage from "@/pages/seller/orders/OrderListPage";
import OrderDetailPage from "@/pages/seller/orders/OrderDetailPage";
import SellerQuotationListPage from "@/pages/seller/quotations/QuotationListPage";
import QuotationDetailPage from "@/pages/seller/quotations/QuotationDetailPage";
import StoreReviewsPage from "@/pages/seller/reviews/StoreReviewsPage";
import ProductReviewsPage from "@/pages/seller/reviews/ProductReviewsPage";

// Bu sprintte eklenen sayfalar
import CompanyCreate from "@/pages/seller/company/CompanyCreate";
import SellerExtraInfoPage from "@/pages/seller/profile/SellerExtraInfoPage";
import SellerCompanyDocuments from "@/pages/seller/company/SellerCompanyDocuments";

// 🔹 yeni eklediğimiz sayfa
import ProductImagesPage from "@/pages/seller/products/ProductImagesPage";

// Layout & Guard
import SellerLayout from "@/components/layout/SellerLayout";
import PrivateRoute from "@/routes/PrivateRoute";
import SemiPrivateRoute from "@/routes/SemiPrivateRoute";
import SellerRouteWrapper from "@/components/SellerRouteWrapper";

function App() {
  return (
    <Routes>
      {/* ── Açık seller sayfaları ─────────────────────────────── */}
      <Route path="/seller" element={<SellerLandingPage />} />
      <Route path="/seller/register" element={<RegisterPage />} />
      <Route path="/seller/login" element={<LoginPage />} />
      <Route path="/seller/apply" element={<SellerApplicationPage />} />

      {/* Abonelik (login gerekli, aktif değilse erişir) */}
      <Route
        path="/seller/subscription"
        element={
          <SemiPrivateRoute>
            <SubscriptionPage />
          </SemiPrivateRoute>
        }
      />

      {/* ── Korumalı seller alanı ─────────────────────────────── */}
      <Route
        path="/seller"
        element={
          <PrivateRoute>
            <SellerRouteWrapper>
              <SellerLayout />
            </SellerRouteWrapper>
          </PrivateRoute>
        }
      >
        <Route path="company/create" element={<CompanyCreate />} />
        <Route path="profile/extra-info" element={<SellerExtraInfoPage />} />
        <Route path="company-documents" element={<SellerCompanyDocuments />} />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="company-profile" element={<CompanyUpdate />} />
        <Route path="store/create" element={<StoreCreate />} />
        <Route path="store/update" element={<StoreUpdate />} />
        <Route path="store/coverage" element={<StoreCoveragePage />} />
        <Route path="reviews" element={<StoreReviewsPage />} />
        <Route path="products/:productId/reviews" element={<ProductReviewsPage />} />
        <Route path="products/my-store" element={<MyStoreProductsPage />} />
        <Route path="products/database" element={<ProductDatabasePage />} />
        <Route path="products/requests" element={<ProductRequestListPage />} />

        {/* 🔹 yeni ekledik */}
        <Route
          path="products/:storeProductId/images"
          element={<ProductImagesPage />}
        />

        <Route path="quotations" element={<SellerQuotationListPage />} />
        <Route path="quotations/:id" element={<QuotationDetailPage />} />
        <Route path="orders" element={<OrderListPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="profile" element={<SellerProfilePage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/seller" replace />} />
    </Routes>
  );
}

export default App;
