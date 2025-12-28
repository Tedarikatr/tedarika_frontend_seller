import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { registerSeller } from "@/api/sellerAuthService";
import { Mail, Lock, User, Phone, CheckCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { createSeoMeta } from "@/utils/seo";

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
  if (!formData.email || !emailRegex.test(formData.email)) {
    toast.error("Geçerli bir e-posta adresi giriniz.");
    return;
  }

  // Phone validation
  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    toast.error("Telefon numarası 10 haneli olmalı ve 5 ile başlamalıdır (örn: 5551234567)");
    return;
  }

  // Password validation
  if (!formData.password || formData.password.length < 8) {
    toast.error("Şifre en az 8 karakter olmalıdır.");
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
    email: formData.email.trim(),
    phone: fullPhone,
    password: formData.password,
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
      
    <div className="min-h-screen flex flex-col md:flex-row bg-[#002d2f] text-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-10 py-20 space-y-8 bg-gradient-to-br from-[#003e3f] via-[#004b49] to-[#005c5a]">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          Global Pazarlara Profesyonel Erişim
        </h2>
        <p className="text-[#b8dedb] max-w-md text-sm leading-relaxed">
          Satıcı hesabı oluşturun, mağazanızı açın ve 150+ ülkedeki B2B alıcılara ulaşın.
        </p>
        <ul className="space-y-3 text-sm">
          {[
            "5 dakikada hızlı kayıt",
            "Binlerce kurumsal alıcı",
            "Güvenli ödeme garantisi",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full md:w-1/2 bg-white text-[#003636] flex items-center justify-center py-16 px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h3 className="text-3xl font-bold text-center mb-10">Satıcı Kaydı</h3>
          <div className="space-y-5">
            <FormInput name="name" value={formData.name} onChange={handleChange} placeholder="Ad" icon={<User size={18} />} />
            <FormInput name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Soyad" icon={<User size={18} />} />
            <FormInput name="email" value={formData.email} onChange={handleChange} placeholder="E-posta" icon={<Mail size={18} />} type="email" />
            <PhoneInput name="phone" value={formData.phone} onChange={handleChange} />
            <FormInput name="password" value={formData.password} onChange={handleChange} placeholder="Şifre" icon={<Lock size={18} />} type="password" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 w-full bg-gradient-to-r from-[#00d18c] to-[#00a980] hover:opacity-90 text-white font-semibold py-3 rounded-xl transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Kayıt Yapılıyor..." : "Hesap Oluştur"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
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
            className="mt-4 w-full text-center text-sm text-gray-600 underline"
          >
            Geri Dön
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

const FormInput = ({ name, value, onChange, placeholder, icon, type = "text" }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
    {icon}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2] text-sm"
    />
  </div>
);

const PhoneInput = ({ name, value, onChange }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
    <span className="flex items-center gap-1">
      <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-5 h-3 rounded-sm" />
      <span className="text-[#003636] font-semibold text-sm">+90</span>
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
      className="w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2] text-sm"
    />
  </div>
);

export default RegisterPage;
