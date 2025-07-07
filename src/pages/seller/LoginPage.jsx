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
    <div className="min-h-screen bg-[#002c2c] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-10 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-[#003636] text-center mb-8 tracking-wide">
          Satıcı Giriş
        </h2>

        <div className="space-y-4 text-[#003636]">
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
          className="mt-8 w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-2 rounded-lg transition-all duration-300"
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

        <div className="mt-6 text-center text-sm text-[#003636]">
          Hesabın yok mu?{" "}
          <Link
            to="/seller/register"
            className="font-semibold text-[#005e5e] hover:underline"
          >
            Kayıt Ol
          </Link>
        </div>
      </form>
    </div>
  );
};

const FormInput = ({ name, value, onChange, placeholder, icon, type = "text" }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#e6f0ef] border border-[#b6d3d2] focus-within:ring-2 ring-[#80c1bd] transition">
    {icon}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full bg-transparent outline-none text-[#002c2c] placeholder-[#6b9b99] text-sm"
    />
  </div>
);

export default LoginPage;
