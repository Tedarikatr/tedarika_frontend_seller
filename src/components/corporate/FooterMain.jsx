import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Logo = `${import.meta.env.BASE_URL}images/logo.png`.replace(/\/{2,}/g, "/");

// BASE_URL'i kullanarak public içindeki dosyaların doğru yolu
const publicUrl = (path) => {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/");
};

const FooterMain = () => {
  const topics = [
    { label: "Hakkımızda", path: "/corporate/about" },
    { label: "Satıcı Merkezi", path: "/satici-merkezi" },
    { label: "İletişim", path: "/corporate/contact" },
    { label: "KVKK", path: "/corporate/kvkk" },
    { label: "SSS", path: "/corporate/sss" },
  ];

  const portalLinks = [
    { label: "Yatırımcı İlişkileri", url: "https://www.portal.tedarika.com.tr/yatirimci-iliskileri" },
    { label: "Blog", url: "https://www.portal.tedarika.com.tr/blog" },
    { label: "Haberler", url: "https://www.portal.tedarika.com.tr/haberler" },
  ];

  const contracts = [
    { label: "Mesafeli Satış Sözleşmesi", file: publicUrl("docs/mesafeli_satis_sozlesmesi.pdf") },
    { label: "Web Sitesi Gizlilik Politikası", file: publicUrl("docs/web_sitesi_gizlilik_politikasi.pdf") },
    { label: "Çerez Politikası", file: publicUrl("docs/cerez_politikasi.pdf") },
    { label: "Web Sitesi Kullanım Koşulları ve Üyelik Şartları", file: publicUrl("docs/web_sitesi_kullanim_kosullari_ve_uyelik.pdf") },
    { label: "Kişisel Verilerin Korunmasına İlişkin Sözleşme", file: publicUrl("docs/kisisel_verilerin_korunmasina_iliskin_sozlesme.pdf") },
  ];

  return (
    <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-gradient-to-br from-[#003033] via-[#003033] to-[#3D4E52] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-12">
          {/* Sol: Logo ve İletişim Bilgileri */}
          <div className="lg:col-span-2">
            <a href="/seller/landing" className="inline-block mb-6 group">
              <div className="flex items-center gap-4">
                <img
                  src={Logo}
                  alt="Tedarika Logo"
                  className="w-32 sm:w-36 group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <div className="text-3xl font-black text-white">Tedarika</div>
                  <div className="text-base text-white/70">Satıcı Paneli</div>
                </div>
              </div>
            </a>
            <p className="text-sm text-white/70 mb-6 max-w-md leading-relaxed">
              Türkiye'nin en büyük B2B platformu. Binlerce alıcıya ulaşın, güvenli ödeme alın ve işinizi büyütün.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <Phone className="w-5 h-5 text-[#3D8E94]" />
                </div>
                <div>
                  <div className="text-xs text-white/50">WhatsApp</div>
                  <a href="https://wa.me/905382362605" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-[#3D8E94] transition-colors">
                    +90 (538) 236 26 05
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <Mail className="w-5 h-5 text-[#3D8E94]" />
                </div>
                <div>
                  <div className="text-xs text-white/50">E-posta</div>
                  <a href="mailto:info@tedarika.com.tr" className="text-white font-semibold hover:text-[#3D8E94] transition-colors">
                    info@tedarika.com.tr
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Kurumsal linkler */}
          <div>
            <h4 className="font-bold text-white mb-5 text-lg flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#3D8E94] to-[#91babe] rounded-full"></div>
              Kurumsal
            </h4>
            <ul className="space-y-3 text-sm">
              {topics.map((topic, index) => (
                <li key={index}>
                  <Link 
                    to={topic.path} 
                    className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    → {topic.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal linkler */}
          <div>
            <h4 className="font-bold text-white mb-5 text-lg flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#3D8E94] to-[#91babe] rounded-full"></div>
              Portal
            </h4>
            <ul className="space-y-3 text-sm">
              {portalLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    → {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sözleşmeler */}
          <div>
            <h4 className="font-bold text-white mb-5 text-lg flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#3D8E94] to-[#91babe] rounded-full"></div>
              Sözleşmeler
            </h4>
            <ul className="space-y-3 text-sm">
              {contracts.map((c, i) => (
                <li key={i} className="break-words">
                  <a
                    href={c.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    → {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/70">Bizi Takip Edin:</span>
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/tedarika/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-[#3D8E94] hover:to-[#91babe] flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/tedarikatr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-[#3D8E94] hover:to-[#91babe] flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                {/* X (Twitter) */}
                <a
                  href="https://x.com/tedarikatr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-[#3D8E94] hover:to-[#91babe] flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/tedarika/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-[#3D8E94] hover:to-[#91babe] flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@Tedarika"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-[#3D8E94] hover:to-[#91babe] flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                
                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@tedarika"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-[#3D8E94] hover:to-[#91babe] flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterMain;
