import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginSeller } from "@/api/sellerAuthService";
import { Mail, Lock } from "lucide-react";

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

      // 🟢 Token buradan alınır (iç içe)
      const token = result?.token?.token;

      if (typeof token === "string" && token.length > 0) {
        localStorage.setItem("sellerToken", token);

        // (İsteğe bağlı) Ek bilgileri sakla
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
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#e0e7ff] to-[#c7d2fe] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-10 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-8 tracking-wide">
          Satıcı Giriş
        </h2>

        <div className="space-y-4 text-indigo-800">
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
            icon={<Lock size={18} />}
            type="password"
          />
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
        >
          Giriş Yap
        </button>

        {message && (
          <div
            className={`mt-6 text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-indigo-800">
          Hesabın yok mu?{" "}
          <Link
            to="/seller/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Kayıt Ol
          </Link>
        </div>
      </form>
    </div>
  );
};

const FormInput = ({ name, value, onChange, placeholder, icon, type = "text" }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-100 border border-indigo-200 focus-within:ring-2 ring-indigo-300 transition">
    {icon}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full bg-transparent outline-none text-indigo-900 placeholder-indigo-500 text-sm"
    />
  </div>
);

export default LoginPage;
