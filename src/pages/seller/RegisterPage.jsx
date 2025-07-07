import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerSeller } from "@/api/sellerAuthService";
import { Mail, Lock, User, Phone } from "lucide-react";

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
      }, 1500); // 1.5 saniye sonra yönlendir
    } catch (err) {
      console.error("Kayıt Hatası:", err);
      setMessage("❌ " + (err.message || "Kayıt sırasında bir hata oluştu."));
    }
  };

  return (
    <div className="min-h-screen bg-[#002c2c] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-10 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-[#003636] text-center mb-8 tracking-wide">
          Satıcı Kayıt
        </h2>

        <div className="space-y-4 text-[#003636]">
          <FormInput
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ad"
            icon={<User size={18} />}
          />
          <FormInput
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Soyad"
            icon={<User size={18} />}
          />
          <FormInput
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            icon={<Mail size={18} />}
            type="email"
          />
          <FormInput
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon (05XXXXXXXXX)"
            icon={<Phone size={18} />}
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
          Kayıt Ol
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
          Hesabın var mı?{" "}
          <Link
            to="/seller/login"
            className="font-semibold text-[#005e5e] hover:underline"
          >
            Giriş Yap
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

export default RegisterPage;
