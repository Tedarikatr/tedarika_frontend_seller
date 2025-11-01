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
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true); // Disable submit during submission

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^5\d{9}$/;

    if (!emailRegex.test(formData.email)) {
      setMessage("❌ Geçerli bir e-posta adresi giriniz.");
      setIsSubmitting(false);
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      setMessage("❌ Telefon numarası 05XXXXXXXXX formatında olmalıdır.");
      setIsSubmitting(false);
      return;
    }

    const fullPhone = `+90${formData.phone}`;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Add password validation

    if (!passwordRegex.test(formData.password)) {
      setMessage("❌ Şifre en az 8 karakter, harf ve rakam içermelidir.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      phone: fullPhone,
    };

    try {
      await registerSeller(payload);
      setMessage("✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate("/seller/login");
      }, 1500);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Kayıt sırasında bir hata oluştu.";
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false); // Re-enable the submit button after submission
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#002d2f] text-white">
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
            disabled={isSubmitting} // Disable button during submission
            className="mt-8 w-full bg-gradient-to-r from-[#00d18c] to-[#00a980] hover:opacity-90 text-white font-semibold py-3 rounded-xl transition"
          >
            {isSubmitting ? "Kayıt Yapılıyor..." : "Hesap Oluştur"}
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
