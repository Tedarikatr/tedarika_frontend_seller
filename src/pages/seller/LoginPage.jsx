import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginSeller } from "@/api/sellerAuthService";
import { Mail, Lock, CheckCircle } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await loginSeller(formData);
      const tokenData = result?.token;

      if (tokenData && typeof tokenData.token === "string") {
        localStorage.setItem("sellerToken", tokenData.token);
        localStorage.setItem("sellerEmail", tokenData.email);
        localStorage.setItem("sellerRole", tokenData.role);
        setMessage("✅ Giriş başarılı, yönlendiriliyorsunuz...");
        navigate("/seller/dashboard");
      } else {
        setMessage("❌ Beklenen token verisi alınamadı.");
      }
    } catch (err) {
      console.error("Login Hatası:", err);
      setMessage("❌ " + (err?.response?.data?.message || err.message || "Giriş sırasında hata oluştu."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-white">
      {/* Sol Tanıtım Alanı */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-10 py-20 space-y-8">
        <h2 className="text-4xl font-extrabold">
          Tedarika Satıcı Paneline Hoş Geldiniz
        </h2>
        <p className="text-gray-400 max-w-md">
          Hızlı giriş yap, mağazanı yönet ve binlerce işletmeyle buluş.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <span>Güçlü altyapı ile güvenli oturum</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <span>Kolay erişim, sade tasarım</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <span>Mobil uyumlu kullanıcı deneyimi</span>
          </li>
        </ul>
      </div>

      {/* Sağ Giriş Formu */}
      <div className="w-full md:w-1/2 bg-white text-[#003636] flex items-center justify-center py-16 px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h3 className="text-3xl font-bold text-center mb-8">Satıcı Giriş</h3>

          <div className="space-y-4">
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
            className="mt-6 w-full bg-gradient-to-r from-[#003636] to-[#005e5e] hover:brightness-110 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
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

          <p className="mt-6 text-center text-sm">
            Hesabınız yok mu?{" "}
            <Link
              to="/seller/register"
              className="text-emerald-700 font-semibold hover:underline"
            >
              Kayıt Ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  autoComplete,
}) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#f0fdfa] border border-[#c0e5e2] focus-within:ring-2 ring-[#80c1bd] transition">
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
