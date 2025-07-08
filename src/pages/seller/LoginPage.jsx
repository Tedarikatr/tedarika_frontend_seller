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

    try {
      const result = await loginSeller(formData);
      const token = result?.token?.token;

      if (typeof token === "string" && token.length > 0) {
        localStorage.setItem("sellerToken", token);
        localStorage.setItem("sellerEmail", result.token.email);
        localStorage.setItem("sellerRole", result.token.role);
        navigate("/seller/dashboard");
      } else {
        setMessage("❌ Token alınamadı.");
      }
    } catch (err) {
      console.error("Login Hatası:", err);
      setMessage("❌ " + (err?.response?.data?.message || err.message || "Giriş hatası."));
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
            />
            <FormInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifre"
              type="password"
              icon={<Lock size={18} />}
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-[#003636] to-[#005e5e] hover:brightness-110 text-white font-semibold py-3 rounded-xl transition"
          >
            Giriş Yap
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

const FormInput = ({ name, value, onChange, placeholder, icon, type = "text" }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#f0fdfa] border border-[#c0e5e2] focus-within:ring-2 ring-[#80c1bd] transition">
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

export default LoginPage;
