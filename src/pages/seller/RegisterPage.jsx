import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerSeller } from "@/api/sellerAuthService";
import { Mail, Lock, User, Phone, CheckCircle } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^05\d{9}$/;

    if (!emailRegex.test(formData.email)) {
      setMessage("❌ Geçerli bir e-posta adresi giriniz.");
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      setMessage("❌ Telefon numarası 05 ile başlamalı ve 11 haneli olmalı.");
      return;
    }

    const sanitizedPhone = formData.phone.startsWith("0")
      ? formData.phone.slice(1)
      : formData.phone;

    const payload = {
      ...formData,
      phone: sanitizedPhone,
    };

    try {
      await registerSeller(payload);
      setMessage("✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate("/seller/login");
      }, 1500);
    } catch (err) {
      setMessage("❌ " + (err.message || "Kayıt sırasında bir hata oluştu."));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#002d2f] text-white">
      {/* Sol Tanıtım Alanı */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-10 py-20 space-y-8 bg-gradient-to-br from-[#003e3f] via-[#004b49] to-[#005c5a]">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          Tedarika ile Dakikalar İçinde Satışa Başlayın
        </h2>
        <p className="text-[#b8dedb] max-w-md text-sm leading-relaxed">
          Şirketini oluştur, mağazanı aç ve on binlerce işletmeye ulaş.
        </p>
        <ul className="space-y-3 text-sm">
          {[
            "Kolay ve hızlı kayıt süreci",
            "Geniş müşteri kitlesi",
            "Ücretsiz ve güvenli altyapı",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sağ Form Alanı */}
      <div className="w-full md:w-1/2 bg-white text-[#003636] flex items-center justify-center py-16 px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h3 className="text-3xl font-bold text-center mb-10">Satıcı Kaydı</h3>

          <div className="space-y-5">
            <FormInput name="name" value={formData.name} onChange={handleChange} placeholder="Ad" icon={<User size={18} />} />
            <FormInput name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Soyad" icon={<User size={18} />} />
            <FormInput name="email" value={formData.email} onChange={handleChange} placeholder="E-posta" icon={<Mail size={18} />} type="email" />
            <FormInput name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon (05XXXXXXXXX)" icon={<Phone size={18} />} />
            <FormInput name="password" value={formData.password} onChange={handleChange} placeholder="Şifre" icon={<Lock size={18} />} type="password" />
          </div>

          <button
            type="submit"
            className="mt-8 w-full bg-gradient-to-r from-[#00d18c] to-[#00a980] hover:opacity-90 text-white font-semibold py-3 rounded-xl transition"
          >
            Hesap Oluştur
          </button>

          {message && (
            <p
              className={`mt-4 text-sm text-center font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Hesabın var mı?{" "}
            <Link
              to="/seller/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
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

export default RegisterPage;