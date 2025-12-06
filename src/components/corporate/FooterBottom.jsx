import React from "react";

const publicUrl = (path) => {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/");
};

const FooterBottom = () => {
  const paymentIcons = [
    "applepay",
    "visa-svgrepo-com",
    "discover",
    "mastercard",
    "securepayment",
    "iyzico_bluebg_white"
  ];

  return (
    <div className="bg-gradient-to-r from-[#0d1419] via-[#0f1923] to-[#0a1f2e] border-t border-white/5 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          {/* Sol: Telif hakkı */}
          <div className="text-center md:text-left">
            <p className="text-white font-semibold mb-1">
              © 2024 Tedarika. Tüm hakları saklıdır.
            </p>
            <p className="text-white/50 text-xs">
              Tedarika Bir Coşkunlar Limited Şirketi A.Ş Kuruluşudur
            </p>
          </div>

          {/* Sağ: Ödeme ikonları ve ETBİS */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
            {/* Ödeme ikonları */}
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              {paymentIcons.map((icon) => (
                <img
                  key={icon}
                  src={publicUrl(`assets/images/${icon}.svg`)}
                  alt={`${icon} logosu`}
                  className="h-6 rounded-lg opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110"
                />
              ))}
            </div>

            {/* ETBİS görseli */}
            <img
              src={publicUrl("assets/images/son.jpg")}
              alt="ETBİS Kayıt QR Kodu"
              className="h-12 rounded-xl border-2 border-white/10 shadow-lg hover:border-white/30 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
