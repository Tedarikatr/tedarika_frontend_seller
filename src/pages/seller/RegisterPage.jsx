import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { registerSeller } from "@/api/sellerAuthService";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { createSeoMeta } from "@/utils/seo";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";

const RegisterPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Satıcı Kaydı | Tedarika B2B Pazaryeri",
    description: "Tedarika B2B pazaryerinde satıcı hesabı oluşturun. 5 dakikada kayıt olun, mağazanızı açın ve global alıcılara ulaşın. Ücretsiz kayıt.",
    path: location.pathname,
    keywords: "tedarika kayıt, satıcı kaydı, B2B satıcı ol, mağaza aç, ücretsiz kayıt"
  });
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Eğer zaten submit ediliyor ise çık
  if (isSubmitting) {
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^5\d{9}$/;

  // Email validation
  const trimmedEmail = formData.email?.trim();
  if (!trimmedEmail || trimmedEmail.length === 0 || trimmedEmail.includes(' ')) {
    toast.error("Geçerli bir e-posta adresi giriniz.");
    return;
  }
  if (!emailRegex.test(trimmedEmail)) {
    toast.error("Geçerli bir e-posta adresi giriniz.");
    return;
  }

  // Phone validation
  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    toast.error("Telefon numarası 10 haneli olmalı ve 5 ile başlamalıdır (örn: 5551234567)");
    return;
  }

  // Password validation
  const trimmedPassword = formData.password?.trim();
  if (!trimmedPassword || trimmedPassword.length === 0 || trimmedPassword.length < 8) {
    toast.error("Şifre en az 8 karakter olmalıdır.");
    return;
  }

  // Password confirmation
  const trimmedPasswordConfirm = formData.passwordConfirm?.trim();
  if (!trimmedPasswordConfirm) {
    toast.error("Şifre tekrarı alanı zorunludur.");
    return;
  }
  if (trimmedPassword !== trimmedPasswordConfirm) {
    toast.error("Şifreler eşleşmiyor.");
    return;
  }

  // Name validation
  if (!formData.name || !formData.name.trim()) {
    toast.error("Ad alanı zorunludur.");
    return;
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    toast.error("Soyad alanı zorunludur.");
    return;
  }

  const fullPhone = `+90${formData.phone}`;

  const payload = {
    name: formData.name.trim(),
    lastName: formData.lastName.trim(),
    email: trimmedEmail,
    phone: fullPhone,
    password: trimmedPassword,
    country: "Türkiye",
  };

  setIsSubmitting(true); // Tüm validasyonlar geçildikten sonra kilitle

  try {
    await registerSeller(payload);
    toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
    setTimeout(() => {
      navigate("/seller/login");
    }, 1500);
  } catch (err) {
    const errorMessage =
      err?.response?.data?.message ||
      err.message ||
      "Kayıt sırasında bir hata oluştu.";
    toast.error(errorMessage);
    setIsSubmitting(false); // Hata durumunda butonu tekrar aktif et
  }
};

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <link rel="canonical" href={seoMeta.canonical} />
        <meta name="robots" content="index, follow" />
        
        {/* Hreflang Tags */}
        {seoMeta.hreflang.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        
        {/* Open Graph */}
        <meta property="og:title" content={seoMeta.og.title} />
        <meta property="og:description" content={seoMeta.og.description} />
        <meta property="og:type" content={seoMeta.og.type} />
        <meta property="og:url" content={seoMeta.og.url} />
        <meta property="og:image" content={seoMeta.og.image} />
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta property="og:site_name" content={seoMeta.og.siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />
      </Helmet>
      
    <div className="min-h-screen flex flex-col bg-white">
      <SellerHeader />
      <div className="flex flex-1 items-center justify-center bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100 overflow-hidden">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-gray-900">Satıcı Kaydı</h3>
          <div className="space-y-5 sm:space-y-7">
            <FormInput name="name" value={formData.name} onChange={handleChange} placeholder="Ad" icon={<User size={22} />} inputClassName="text-base" />
            <FormInput name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Soyad" icon={<User size={22} />} inputClassName="text-base" />
            <FormInput name="email" value={formData.email} onChange={handleChange} placeholder="E-posta" icon={<Mail size={22} />} type="email" inputClassName="text-base" />
            <PhoneInput name="phone" value={formData.phone} onChange={handleChange} inputClassName="text-base" />
            <FormInputPassword name="password" value={formData.password} onChange={handleChange} placeholder="Şifre" icon={<Lock size={22} />} inputClassName="text-base" />
            <FormInputPassword name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} placeholder="Şifre tekrarı" icon={<Lock size={22} />} inputClassName="text-base" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 sm:mt-10 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg transition shadow-lg ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Kayıt Yapılıyor..." : "Hesap Oluştur"}
          </button>

          <p className="mt-8 text-center text-base text-gray-600">
            Hesabın var mı?{" "}
            <Link
              to="/seller/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Giriş Yap
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

const FormInput = ({ name, value, onChange, placeholder, icon, type = "text", inputClassName = "" }) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
    {icon}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className={`w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2] ${inputClassName}`}
    />
  </div>
);

const FormInputPassword = ({ name, value, onChange, placeholder, icon, inputClassName = "", required = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
      {icon}
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
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

const PhoneInput = ({ name, value, onChange, inputClassName = "" }) => (
  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
    <span className="flex items-center gap-1">
      <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-5 h-3 rounded-sm" />
      <span className="text-[#003636] font-semibold text-base">+90</span>
    </span>
    <input
      type="tel"
      name={name}
      value={value}
      onChange={onChange}
      maxLength={10}
      pattern="[0-9]*"
      placeholder="5XXXXXXXXX"
      required
      className={`w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2] ${inputClassName}`}
    />
  </div>
);

export default RegisterPage;
