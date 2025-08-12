import React from "react";
import { Mail, Phone, FileText } from "lucide-react";

// BASE_URL uyumlu public yolu
const publicUrl = (path) => `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/");

const Footer = () => {
  const contracts = [
    { label: "Mesafeli Satış Sözleşmesi", file: publicUrl("docs/mesafeli_satis_sozlesmesi.pdf") },
    { label: "Web Sitesi Gizlilik Politikası", file: publicUrl("docs/web_sitesi_gizlilik_politikasi.pdf") },
    { label: "Çerez Politikası", file: publicUrl("docs/cerez_politikasi.pdf") },
    { label: "Web Sitesi Kullanım Koşulları ve Üyelik Şartları", file: publicUrl("docs/web_sitesi_kullanim_kosullari_ve_uyelik.pdf") },
    { label: "Kişisel Verilerin Korunmasına İlişkin Sözleşme", file: publicUrl("docs/kisisel_verilerin_korunmasina_iliskin_sozlesme.pdf") },
  ];

  return (
    <footer className="w-full px-6 py-10 bg-[#003032] text-white">
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
              <a href="mailto:info@tedarika.app" className="hover:underline">
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
    </footer>
  );
};

export default Footer;
