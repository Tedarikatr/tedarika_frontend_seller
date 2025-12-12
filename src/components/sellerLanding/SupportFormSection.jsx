import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SendHorizonal,
  Mail,
  Phone,
  User,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { sendSellerNonSupport } from "../../api/sellerNonSupportService";

const SupportFormSection = () => {
  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Phone: "",
    Email: "",
    AllowContact: true,
    RequestType: "Support",
    Message: "",
    Attachment: null,
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");
    try {
      await sendSellerNonSupport(form);
      setIsSuccess(true);
      setResponseMsg("Talebiniz başarıyla gönderildi!");
      setForm({
        FirstName: "",
        LastName: "",
        Phone: "",
        Email: "",
        AllowContact: true,
        RequestType: "Support",
        Message: "",
        Attachment: null,
      });
    } catch (err) {
      setIsSuccess(false);
      setResponseMsg("Bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setIsSuccess(null), 4000); // toast 4 sn sonra kaybolur
    }
  };

  return (
    <section className="relative bg-white py-20 px-6 sm:px-10 overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 opacity-30 blur-3xl rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-600 opacity-30 blur-3xl rounded-full animate-pulse-slow"></div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2
          className="text-3xl sm:text-5xl font-extrabold text-[#003636] mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          İhracat İçin Profesyonel Destek Alın
        </motion.h2>
        <p className="text-gray-600 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
          Sorularınız mı var? Formu doldurun, uzman ekibimiz size yardımcı olmak için en kısa sürede iletişime geçsin.
        </p>

        {/* Toast Bildirimi */}
        <AnimatePresence>
          {isSuccess !== null && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-semibold z-50 ${
                isSuccess ? "bg-emerald-600" : "bg-red-600"
              }`}
            >
              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span>{responseMsg}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 flex flex-col gap-5 text-left max-w-2xl mx-auto border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <User className="text-emerald-600 w-4 h-4" />
                <input
                  name="FirstName"
                  value={form.FirstName}
                  onChange={handleChange}
                  required
                  className="w-full outline-none text-gray-800"
                  placeholder="Adınız"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
              <input
                name="LastName"
                value={form.LastName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 outline-none text-gray-800"
                placeholder="Soyadınız"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Phone className="text-emerald-600 w-4 h-4" />
              <input
                name="Phone"
                value={form.Phone}
                onChange={handleChange}
                className="w-full outline-none text-gray-800"
                placeholder="+90 5XX XXX XX XX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Mail className="text-emerald-600 w-4 h-4" />
              <input
                type="email"
                name="Email"
                value={form.Email}
                onChange={handleChange}
                required
                className="w-full outline-none text-gray-800"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
            <textarea
              name="Message"
              value={form.Message}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none text-gray-800 min-h-[100px]"
              placeholder="Destek talebinizi buraya yazın..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosya Eki (Opsiyonel)
            </label>
            <input
              type="file"
              name="Attachment"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 outline-none text-gray-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="AllowContact"
              checked={form.AllowContact}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700">
              İletişime geçilmesini onaylıyorum.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full py-3 font-semibold text-lg transition shadow-lg hover:shadow-emerald-400/40"
          >
            <SendHorizonal className="w-5 h-5" />
            {loading ? "Gönderiliyor..." : "Talebi Gönder"}
          </button>
        </motion.form>

        {/* Şirket Bilgileri */}
        <motion.div
          className="mt-16 text-gray-700"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Building2 className="text-emerald-700 w-6 h-6" />
              <p className="text-sm sm:text-base font-medium">
                <strong>Coşkunlar Dış Ticaret Limited Şirketi</strong>
                <br />
                Mersis No: <strong>0211135358300001</strong>
                <br />
                İlan Sıra No: <strong>5978</strong>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-emerald-700 w-6 h-6" />
              <p className="text-sm sm:text-base font-medium max-w-sm">
                Adalet Mah. Manas Blv. Folkart Towers No: 47 B, 35540 Bayraklı / İzmir
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SupportFormSection;
