import { useState } from "react";
import { registerSeller } from "@/api/sellerAuthService";
import { Mail, Lock, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
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
      const result = await registerSeller(payload);
      setMessage("✅ Kayıt başarılı!");
      console.log(result);
    } catch (err) {
      console.error("Kayıt Hatası:", err);
      setMessage("❌ " + (err.message || "Kayıt sırasında bir hata oluştu."));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#e0e7ff] to-[#c7d2fe] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-10 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-8 tracking-wide">
          Satıcı Kayıt
        </h2>

        <div className="space-y-4 text-indigo-800">
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
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
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

        <div className="mt-6 text-center text-sm text-indigo-800">
          Hesabın var mı?{" "}
          <Link
            to="/seller/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Giriş Yap
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

export default RegisterPage;
