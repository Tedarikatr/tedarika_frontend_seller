import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#003636] text-white py-20 px-4 relative overflow-hidden">
      {/* Arka plan parıltı efektleri */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl animate-pulse-slow"></div>

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Hemen Mağazanı Aç
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Sadece birkaç adımda{" "}
          <span className="text-emerald-400 font-semibold">
            Tedarika satıcısı
          </span>{" "}
          olun.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/seller/register")}
          className="bg-white text-[#003636] hover:bg-emerald-100 font-bold px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-200"
        >
          Başvur ve Satışa Başla
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CTASection;
