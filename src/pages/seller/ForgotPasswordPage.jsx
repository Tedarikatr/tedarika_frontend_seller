import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  requestForgetPasswordReset,
  forgetPassword,
} from "@/api/sellerAuthService";
import { Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { createSeoMeta } from "@/utils/seo";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_REGEX = /^\d{6}$/;
const PASSWORD_MIN = 8;

function isValidPassword(p) {
  if (!p || p.length < PASSWORD_MIN) return false;
  return (
    /[a-z]/.test(p) &&
    /[A-Z]/.test(p) &&
    /\d/.test(p) &&
    /[^A-Za-z0-9]/.test(p)
  );
}

const ForgotPasswordPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Şifremi Unuttum | Tedarika Satıcı Paneli",
    description: "Tedarika satıcı hesabınızın şifresini sıfırlayın. E-posta adresinize gönderilen kodu girerek yeni şifre belirleyin.",
    path: location.pathname,
    keywords: "şifremi unuttum, satıcı şifre sıfırlama, Tedarika",
  });
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Geçerli bir e-posta adresi giriniz.");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      toast.error("Geçerli bir e-posta adresi giriniz.");
      return;
    }
    setIsSubmitting(true);
    try {
      await requestForgetPasswordReset(email.trim());
      toast.success("Doğrulama kodu e-posta adresinize gönderildi.");
      setStep(2);
    } catch (err) {
      toast.error(err?.message || "Kod gönderilirken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (!CODE_REGEX.test(code)) {
      toast.error("Doğrulama kodu 6 haneli olmalıdır.");
      return;
    }
    if (!isValidPassword(newPassword)) {
      toast.error(
        "Şifre en az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir."
      );
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      toast.error("Yeni şifre tekrar, yeni şifre ile aynı olmalıdır.");
      return;
    }
    setIsSubmitting(true);
    try {
      await forgetPassword({
        email: email.trim(),
        code,
        newPassword,
        newPasswordConfirm,
      });
      toast.success("Şifre değiştirildi. Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/seller/login"), 1500);
    } catch (err) {
      toast.error(err?.message || "Şifre sıfırlanırken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setCode("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <link rel="canonical" href={seoMeta.canonical} />
        <meta name="robots" content="index, follow" />
        {seoMeta.hreflang.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:title" content={seoMeta.og.title} />
        <meta property="og:description" content={seoMeta.og.description} />
        <meta property="og:type" content={seoMeta.og.type} />
        <meta property="og:url" content={seoMeta.og.url} />
        <meta property="og:image" content={seoMeta.og.image} />
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta property="og:site_name" content={seoMeta.og.siteName} />
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-white">
        <SellerHeader />
        <div className="flex flex-1 items-center justify-center bg-white py-24 px-4">
          <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <h3 className="text-4xl font-bold text-center mb-4 text-gray-900">
              Şifremi Unuttum
            </h3>

            {step === 1 ? (
              <form onSubmit={handleStep1}>
                <p className="text-center text-gray-600 text-sm mb-6">
                  E-postanıza 6 haneli bir kod gönderilecektir. Kod 10 dakika
                  geçerlidir.
                </p>
                <div className="space-y-7">
                  <FormInput
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta"
                    icon={<Mail size={22} />}
                    autoComplete="email"
                    inputClassName="text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-10 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl text-lg transition disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? "Kod Gönderiliyor..." : "Kod Gönder"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleStep2}>
                <p className="text-center text-gray-600 text-sm mb-6">
                  E-postanıza gelen 6 haneli kodu girin. Şifre en az 8 karakter,
                  büyük/küçük harf, rakam ve özel karakter içermelidir.
                </p>
                <div className="space-y-7">
                  <div className="rounded-xl bg-[#f0fdfa] border border-[#bde7e3] px-5 py-3 flex items-center gap-3">
                    <Mail size={22} />
                    <span className="text-[#003636] text-base truncate">
                      {email}
                    </span>
                  </div>
                  <FormCodeInput
                    value={code}
                    onChange={setCode}
                    placeholder="6 haneli kod"
                  />
                  <FormInputPassword
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yeni şifre"
                    icon={<Lock size={22} />}
                    inputClassName="text-base"
                  />
                  <FormInputPassword
                    name="newPasswordConfirm"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder="Yeni şifre tekrar"
                    icon={<Lock size={22} />}
                    inputClassName="text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-10 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl text-lg transition disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-base text-gray-600">
              Hesabınızı hatırladınız mı?{" "}
              <Link
                to="/seller/login"
                className="text-emerald-600 font-semibold hover:underline"
              >
                Giriş Yap
              </Link>
            </p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-5 w-full text-center text-base text-gray-500 underline"
            >
              Geri Dön
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

const FormInput = ({
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  autoComplete,
  inputClassName = "",
}) => (
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

const FormCodeInput = ({ value, onChange, placeholder }) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
    <KeyRound size={22} />
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={6}
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, "");
        onChange(v);
      }}
      placeholder={placeholder}
      required
      className="w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2] text-base"
    />
  </div>
);

const FormInputPassword = ({
  name,
  value,
  onChange,
  placeholder,
  icon,
  inputClassName = "",
}) => {
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

export default ForgotPasswordPage;
