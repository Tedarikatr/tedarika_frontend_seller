// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "@/pages/seller/RegisterPage";
import LoginPage from "@/pages/seller/LoginPage";
import DashboardPage from "@/pages/seller/DashboardPage";
import SellerLayout from "@/components/layout/SellerLayout";
import PrivateRoute from "@/routes/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Herkese açık sayfalar */}
        <Route path="/seller/register" element={<RegisterPage />} />
        <Route path="/seller/login" element={<LoginPage />} />

        {/* Giriş gerektiren satıcı paneli */}
        <Route
          path="/seller/dashboard"
          element={
            <PrivateRoute>
              <SellerLayout>
                <DashboardPage />
              </SellerLayout>
            </PrivateRoute>
          }
        />

        {/* Diğer tüm rotalar dashboard'a yönlendirir */}
        <Route path="*" element={<Navigate to="/seller/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
