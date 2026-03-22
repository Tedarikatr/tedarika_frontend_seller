import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { SeoHelmet } from "@/components/seo";
import { ArrowLeft } from "lucide-react"; // minimalist ikon
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const SellerAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const seoMeta = createSeoMeta({
    title: "Randevu Oluştur | Tedarika Satıcı Paneli - Birebir Görüşme",
    description: "Tedarika ekibimizle birebir görüşmek için randevu oluşturun. Satıcı başvuru süreci, platform özellikleri ve iş birliği fırsatları hakkında detaylı bilgi alın.",
    path: location.pathname,
    keywords: "tedarika randevu, satıcı danışmanlığı, B2B görüşme, pazaryeri danışmanlığı, satıcı destek, iş birliği görüşmesi"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Randevu Oluştur", url: location.pathname }
  ]);

  return (
    <>
      <SeoHelmet seoMeta={seoMeta} jsonLd={[breadcrumbSchema]} />
      
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-gray-100 flex flex-col items-center pt-12 px-4">
      {/* Geri butonu */}
      <div className="w-full max-w-4xl mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#003032] font-medium hover:text-emerald-700 transition"
        >
          <ArrowLeft size={20} />
          Geri Dön
        </button>
      </div>

      {/* Başlık */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold text-[#003032] mb-3 text-center"
      >
        Randevu Oluştur
      </motion.h1>

      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Tedarika ekibimizle birebir görüşmek için uygun bir zaman seçin.  
        Randevunuzu hemen takviminize ekleyebilirsiniz.
      </p>

      {/* Calendly iframe */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden p-2 sm:p-4"
      >
        <div className="rounded-2xl overflow-hidden">
          <iframe
            src="https://calendly.com/tedarika-info/30min"
            style={{
              width: "100%",
              minWidth: "320px",
              height: "750px",
              border: "none",
              borderRadius: "16px",
            }}
            frameBorder="0"
            title="Randevu Oluştur"
          ></iframe>
        </div>
      </motion.div>

      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Tedarika • Tüm hakları saklıdır
      </footer>
    </div>
    </>
  );
};

export default SellerAppointment;
