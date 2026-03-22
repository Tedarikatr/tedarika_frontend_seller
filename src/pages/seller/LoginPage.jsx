import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { SeoHelmet } from "@/components/seo";
import { SEO_ROBOTS } from "@/constants/seoDefaults";
import { loginSeller } from "@/api/sellerAuthService";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { createSeoMeta } from "@/utils/seo";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";

const LoginPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Satıcı Girişi | Tedarika B2B Pazaryeri",
    description: "Tedarika satıcı paneline giriş yapın. Mağazanızı yönetin, siparişlerinizi takip edin ve satışlarınızı artırın.",
    path: location.pathname,
    keywords: "tedarika giriş, satıcı girişi, B2B satıcı paneli, mağaza yönetimi"
  });
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (location.state?.sessionExpired) {
      toast.warning("Oturum süreniz doldu, lütfen tekrar giriş yapın.");
    }
  }, [location, toast]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email/Phone validation
    const trimmedEmailOrPhone = formData.emailOrPhone?.trim();
    if (!trimmedEmailOrPhone || trimmedEmailOrPhone.length === 0) {
      toast.error("E-posta veya telefon numarası giriniz.");
      return;
    }

    // Password validation
    const trimmedPassword = formData.password?.trim();
    if (!trimmedPassword || trimmedPassword.length === 0) {
      toast.error("Şifre giriniz.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginSeller({
        emailOrPhone: trimmedEmailOrPhone,
        password: trimmedPassword
      });

      if (typeof result?.token === "string") {
        // Temel bilgiler
        localStorage.setItem("sellerToken", result.token);
        localStorage.setItem("sellerEmail", result.email);
        localStorage.setItem("sellerRole", result.role);

        // API yanıtı features içinde döner (subscriptionActive, isthesystemactive, messagingServiceEnabled)
        const features = result?.features ?? {};
        if (features.subscriptionActive !== undefined)
          localStorage.setItem("sellerSubscriptionActive", String(features.subscriptionActive));
        if (features.isthesystemactive !== undefined)
          localStorage.setItem("sellerSystemActive", String(features.isthesystemactive));
        if (features.messagingServiceEnabled !== undefined)
          localStorage.setItem("sellerMessagingEnabled", String(features.messagingServiceEnabled));

        toast.success("Giriş başarılı, yönlendiriliyorsunuz...");
        navigate("/seller/dashboard");
      } else {
        toast.error("Beklenen token verisi alınamadı.");
      }
    } catch (err) {
      const message = err?.message || "Giriş sırasında hata oluştu.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <SeoHelmet seoMeta={seoMeta} robots={SEO_ROBOTS.INDEX_FOLLOW} />
      
    <div className="min-h-screen flex flex-col bg-white">
      <SellerHeader />
      <div className="flex flex-1 items-center justify-center bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100 overflow-hidden">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-gray-900">Satıcı Giriş</h3>

          <div className="space-y-5 sm:space-y-7">
            <FormInput
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="Email veya Telefon"
              icon={<Mail size={22} />}
              autoComplete="username"
              inputClassName="text-base"
            />
            <FormInputPassword
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifre"
              icon={<Lock size={22} />}
              autoComplete="current-password"
              inputClassName="text-base"
            />
          </div>

          <div className="flex justify-end mt-1">
            <Link
              to="/seller/forgot-password"
              className="text-sm text-emerald-600 font-medium hover:underline"
            >
              Şifremi unuttum
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 sm:mt-10 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg transition disabled:opacity-50 shadow-lg"
          >
            {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>

          <p className="mt-8 text-center text-base text-gray-600">
            Hesabınız yok mu?{" "}
            <Link to="/seller/register" className="text-emerald-600 font-semibold hover:underline">
              Kayıt Ol
            </Link>
          </p>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="mt-5 w-full text-center text-base text-gray-500 underline"
          >
            Geri Dön
          </button>
        </form>
      </div>
      <Footer />
    </div>
    </>
  );
};

const FormInput = ({ name, value, onChange, placeholder, icon, type = "text", autoComplete, inputClassName = "" }) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
    {icon}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2] ${inputClassName}`}
    />
  </div>
);

const FormInputPassword = ({ name, value, onChange, placeholder, icon, autoComplete, inputClassName = "" }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
      {icon}
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2] ${inputClassName}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword((s) => !s)}
        className="p-1 rounded-lg text-[#7aa5a2] hover:text-[#003636] hover:bg-white/50 transition"
        aria-label={showPassword ? "Parolayı gizle" : "Parolayı görüntüle"}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default LoginPage;
