import React from "react";
import { Mail, Phone, FileText } from "lucide-react";

// BASE_URL uyumlu public yolu
const publicUrl = (path) =>
  `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/");

const Footer = () => {
  const contracts = [
    {
      label: "Mesafeli Satış Sözleşmesi",
      file: publicUrl("docs/mesafeli_satis_sozlesmesi.pdf"),
    },
    {
      label: "Web Sitesi Gizlilik Politikası",
      file: publicUrl("docs/web_sitesi_gizlilik_politikasi.pdf"),
    },
    {
      label: "Çerez Politikası",
      file: publicUrl("docs/cerez_politikasi.pdf"),
    },
    {
      label: "Web Sitesi Kullanım Koşulları ve Üyelik Şartları",
      file: publicUrl("docs/web_sitesi_kullanim_kosullari_ve_uyelik.pdf"),
    },
    {
      label: "Kişisel Verilerin Korunmasına İlişkin Sözleşme",
      file: publicUrl("docs/kisisel_verilerin_korunmasina_iliskin_sozlesme.pdf"),
    },
  ];

  const paymentIcons = [
    "applepay",
    "visa-svgrepo-com",
    "discover",
    "mastercard",
    "securepayment",
    "iyzico_bluebg_white"
  ];

  return (
    <footer className="w-full bg-[#003032] text-white">
      <div className="px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          {/* Logo ve iletişim */}
          <div className="w-full md:w-1/2">
            <img src="/logo.svg" alt="Tedarika Logo" className="w-40 mb-4" />
            <p className="text-sm text-gray-300 mb-4 max-w-sm">
              Tedarika Bir Coşkunlar Limited Şirketi A.Ş Kuruluşudur
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-lime-300" />
                <span className="font-medium">0551 447 49 04</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-lime-300" />
                <a
                  href="mailto:info@tedarika.app"
                  className="hover:underline"
                >
                  info@tedarika.app
                </a>
              </div>
            </div>
          </div>

          {/* Sözleşmeler sütunu */}
          <div className="w-full md:w-1/2">
            <h4 className="font-semibold text-lime-300 mb-3">Sözleşmeler</h4>
            <ul className="space-y-2 text-sm text-gray-100">
              {contracts.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-lime-300" />
                  <a
                    href={c.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-300">
          {/* Sol: Telif hakkı */}
          <p className="text-white text-center md:text-left">
            © 2024 Tedarika. Tüm hakları saklıdır.
          </p>

          {/* Sağ: Ödeme ikonları ve ETBİS */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
            {/* Ödeme ikonları */}
            {paymentIcons.map((icon) => (
              <img
                key={icon}
                src={`src/assets/images/${icon}.svg`}
                alt={`${icon} logosu`}
                className="h-6 opacity-80 hover:opacity-100 transition-transform duration-200 hover:scale-105"
              />
            ))}

            {/* ETBİS görseli */}
            <img
              src="src/assets/images/son.jpg"
              alt="ETBİS Kayıt QR Kodu"
              className="h-10 rounded-sm border border-gray-600 shadow-md"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
