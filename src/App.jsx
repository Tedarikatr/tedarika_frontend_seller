// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@/contexts/ToastContext";

// Public seller pages
import SellerLandingPage from "@/pages/seller/SellerLandingPage";
import RegisterPage from "@/pages/seller/RegisterPage";
import LoginPage from "@/pages/seller/LoginPage";
import SellerApplicationPage from "@/pages/seller/SellerApplicationPage";
import SellerBrandListPage from "@/pages/seller/brands/SellerBrandListPage";

// Corporate pages
import AboutPage from "@/pages/corporate/AboutPage";
import ContactPage from "@/pages/corporate/ContactPage";
import KvkkPage from "@/pages/corporate/KvkkPage";
import SssPage from "@/pages/corporate/SssPage";
import ContractsPage from "@/pages/corporate/ContractsPage";

// Subscription
import SubscriptionPage from "@/pages/seller/subscription/SubscriptionPage";

// Protected seller pages
import DashboardPage from "@/pages/seller/DashboardPage";
import SellerProfilePage from "@/pages/seller/profile/SellerProfilePage";
import { CompanyUpdate } from "@/pages/seller/company";
import { StoreCreate, StoreUpdate } from "@/pages/seller/store";
import StoreCoveragePage from "@/pages/seller/location/StoreCoveragePage";
import MyStoreProductsPage from "@/pages/seller/products/MyStoreProductsPage";
import ProductDatabasePage from "@/pages/seller/products/ProductDatabasePage";
import ProductRequestListPage from "@/pages/seller/products/ProductRequestListPage";
import ProductDraftsPage from "@/pages/seller/products/ProductDraftsPage";
import ProductDraftListPage from "@/pages/seller/products/ProductDraftListPage";
import ProductDraftDetailPage from "@/pages/seller/products/ProductDraftDetailPage";
import ProductDraftUploadPage from "@/pages/seller/products/ProductDraftUploadPage";
import OrderListPage from "@/pages/seller/orders/OrderListPage";
import OrderDetailPage from "@/pages/seller/orders/OrderDetailPage";
import RefundRequestsPage from "@/pages/seller/orders/RefundRequestsPage";
import SellerQuotationListPage from "@/pages/seller/quotations/QuotationListPage";
import QuotationDetailPage from "@/pages/seller/quotations/QuotationDetailPage";
import StoreReviewsPage from "@/pages/seller/reviews/StoreReviewsPage";
import ProductReviewsPage from "@/pages/seller/reviews/ProductReviewsPage";
import CompanyCreate from "@/pages/seller/company/CompanyCreate";
import SellerExtraInfoPage from "@/pages/seller/profile/SellerExtraInfoPage";
import SellerCompanyDocuments from "@/pages/seller/company/SellerCompanyDocuments";
import ProductImagesPage from "@/pages/seller/products/ProductImagesPage";
import CampaignListPage from "@/pages/seller/campaigns/CampaignListPage";
import CampaignCreatePage from "@/pages/seller/campaigns/CampaignCreatePage";
import CampaignDetailPage from "@/pages/seller/campaigns/CampaignDetailPage";
import ChatPage from "@/pages/seller/chat/ChatPage";
import ChatDebug from "@/pages/seller/chat/ChatDebug";
import SalesReportsPage from "@/pages/seller/reports/SalesReportsPage";
import SellerLayout from "@/components/layout/SellerLayout";
import PrivateRoute from "@/routes/PrivateRoute";
import SemiPrivateRoute from "@/routes/SemiPrivateRoute";
import SellerRouteWrapper from "@/components/SellerRouteWrapper";
import SellerAppointment from "@/pages/seller/SellerAppointment";
import ScrollToTop from "@/components/ScrollToTop";


function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <Routes>
      {/* ── Public seller routes ───────────────────────────── */}
      <Route path="/seller/landing" element={<SellerLandingPage />} />
      <Route path="/seller/register" element={<RegisterPage />} />
      <Route path="/seller/login" element={<LoginPage />} />
      <Route path="/seller/apply" element={<SellerApplicationPage />} />
      <Route path="/seller" element={<Navigate to="/seller/landing" replace />} />
      <Route path="/seller/appointment" element={<SellerAppointment />} />
      
      {/* ── Corporate pages (Public) ─────────────────────────── */}
      <Route path="/corporate/about" element={<AboutPage />} />
      <Route path="/corporate/contact" element={<ContactPage />} />
      <Route path="/corporate/kvkk" element={<KvkkPage />} />
      <Route path="/corporate/sss" element={<SssPage />} />
      <Route path="/corporate/contracts" element={<ContractsPage />} />
      
      {/* ── Subscription (login gerekli; aktif değilse erişilir) ── */}
      <Route
        path="/seller/subscription"
        element={
          <SemiPrivateRoute>
            <SubscriptionPage />
          </SemiPrivateRoute>
        }
      />

      {/* ── Protected seller area ───────────────────────────── */}
      <Route
        path="/seller/*"
        element={
          <PrivateRoute>
            <SellerRouteWrapper />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Firma */}
        <Route path="company/create" element={<CompanyCreate />} />
        <Route path="company-profile" element={<CompanyUpdate />} />
        <Route path="company-documents" element={<SellerCompanyDocuments />} />

        {/* Profil */}
        <Route path="profile" element={<SellerProfilePage />} />
        <Route path="profile/extra-info" element={<SellerExtraInfoPage />} />

        {/* Mağaza */}
        <Route path="store/create" element={<StoreCreate />} />
        <Route path="store/update" element={<StoreUpdate />} />
        <Route path="store/coverage" element={<StoreCoveragePage />} />

        {/* Ürünler */}
        <Route path="products/my-store" element={<MyStoreProductsPage />} />
        <Route path="products/database" element={<ProductDatabasePage />} />
        <Route path="products/requests" element={<ProductRequestListPage />} />
        <Route path="products/drafts" element={<ProductDraftListPage />} />
        <Route path="products/drafts/:draftId" element={<ProductDraftDetailPage />} />
        <Route path="products/draft/upload" element={<ProductDraftUploadPage />} />
        <Route path="products/:storeProductId/images" element={<ProductImagesPage />} />
        <Route path="products/:productId/reviews" element={<ProductReviewsPage />} />

        {/* Teklifler / Siparişler */}
        <Route path="quotations" element={<SellerQuotationListPage />} />
        <Route path="quotations/:id" element={<QuotationDetailPage />} />
        <Route path="orders" element={<OrderListPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="orders/refund-requests" element={<RefundRequestsPage />} />
        <Route path="campaigns" element={<CampaignListPage />} />
        <Route path="campaigns/new" element={<CampaignCreatePage />} />
        <Route path="campaigns/:id" element={<CampaignDetailPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="chat/debug" element={<ChatDebug />} />

        {/* Raporlar */}
        <Route path="reports/sales" element={<SalesReportsPage />} />

        {/* Diğer */}
        <Route path="reviews" element={<StoreReviewsPage />} />
        <Route path="brands" element={<SellerBrandListPage />} />
      </Route>

      {/* ── 404 redirect ───────────────────────────── */}
      <Route path="*" element={<Navigate to="/seller/landing" replace />} />
    </Routes>
    </ToastProvider>
  );
}

export default App;
