import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginSeller } from "@/api/sellerAuthService";
import { Mail, Lock, CheckCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
    setIsSubmitting(true);

    try {
      const result = await loginSeller(formData);

      if (typeof result?.token === "string") {
        // Temel bilgiler
        localStorage.setItem("sellerToken", result.token);
        localStorage.setItem("sellerEmail", result.email);
        localStorage.setItem("sellerRole", result.role);

        // Backend token'a koymadığı için bunları ayrıca kaydediyoruz
        if (result?.isthesystemactive !== undefined)
          localStorage.setItem("sellerSystemActive", String(result.isthesystemactive));
        if (result?.subscriptionActive !== undefined)
          localStorage.setItem("sellerSubscriptionActive", String(result.subscriptionActive));

        toast.success("Giriş başarılı, yönlendiriliyorsunuz...");
        navigate("/seller/dashboard");
      } else {
        toast.error("Beklenen token verisi alınamadı.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Giriş sırasında hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#002d2f] text-white">
      {/* Sol bilgi alanı */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-10 py-20 space-y-8 bg-gradient-to-br from-[#003e3f] via-[#004b49] to-[#005c5a]">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          Profesyonel B2B İhracat Platformu
        </h2>
        <p className="text-[#b8dedb] max-w-md text-sm leading-relaxed">
          Satıcı hesabınızla mağazanızı yönetin, ürünlerinizi global alıcılara sunun ve ihracatınızı büyütün.
        </p>
        <ul className="space-y-3 text-sm">
          {[
            "150+ ülkeye güvenli ihracat",
            "Kurumsal alıcı ağına erişim",
            "Profesyonel satıcı paneli",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sağ giriş formu */}
      <div className="w-full md:w-1/2 bg-white text-[#003636] flex items-center justify-center py-16 px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h3 className="text-3xl font-bold text-center mb-10">Satıcı Giriş</h3>

          <div className="space-y-5">
            <FormInput
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="Email veya Telefon"
              icon={<Mail size={18} />}
              autoComplete="username"
            />
            <FormInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifre"
              type="password"
              icon={<Lock size={18} />}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full bg-gradient-to-r from-[#00d18c] to-[#00a980] hover:opacity-90 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <Link to="/seller/register" className="text-emerald-600 font-semibold hover:underline">
              Kayıt Ol
            </Link>
          </p>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 w-full text-center text-sm text-gray-600 underline"
          >
            Geri Dön
          </button>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({ name, value, onChange, placeholder, icon, type = "text", autoComplete }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
    {icon}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2] text-sm"
    />
  </div>
);

export default LoginPage;
