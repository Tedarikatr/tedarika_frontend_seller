import React from "react";
import { Helmet } from "react-helmet-async";
import { FileText, Download, Scale } from "lucide-react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";

const publicUrl = (path) => {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/");
};

const ContractsPage = () => {
  const contracts = [
    {
      title: "Mesafeli Satış Sözleşmesi",
      description: "Online satış süreçlerinde satıcı ve alıcı arasındaki haklar ve yükümlülükler.",
      file: publicUrl("docs/mesafeli_satis_sozlesmesi.pdf")
    },
    {
      title: "Web Sitesi Gizlilik Politikası",
      description: "Kişisel verilerinizin toplanması, işlenmesi ve korunmasına ilişkin politikalar.",
      file: publicUrl("docs/web_sitesi_gizlilik_politikasi.pdf")
    },
    {
      title: "Çerez Politikası",
      description: "Web sitemizde kullanılan çerezler ve veri toplama yöntemleri hakkında bilgiler.",
      file: publicUrl("docs/cerez_politikasi.pdf")
    },
    {
      title: "Web Sitesi Kullanım Koşulları ve Üyelik Şartları",
      description: "Platform kullanım kuralları, üyelik koşulları ve yasaklanan davranışlar.",
      file: publicUrl("docs/web_sitesi_kullanim_kosullari_ve_uyelik.pdf")
    },
    {
      title: "Kişisel Verilerin Korunmasına İlişkin Sözleşme",
      description: "KVKK kapsamında kişisel verilerin işlenmesi ve korunmasına dair sözleşme.",
      file: publicUrl("docs/kisisel_verilerin_korunmasina_iliskin_sozlesme.pdf")
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sözleşmeler | Tedarika Satıcı Paneli</title>
        <meta name="description" content="Tedarika satıcı paneli yasal sözleşmeleri, kullanım koşulları ve politikalar." />
      </Helmet>

      <div className="bg-white min-h-screen">
        <SellerHeader />
        
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black">Sözleşmeler</h1>
                <p className="text-emerald-50 mt-2">Yasal Dökümanlar ve Politikalar</p>
              </div>
            </div>
            <p className="text-emerald-50 text-lg">
              Platformumuzun yasal sözleşmeleri ve kullanım politikaları
            </p>
          </div>

          <div className="space-y-5">
          {contracts.map((contract, index) => (
            <article
              key={index}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FileText className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {contract.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {contract.description}
                    </p>
                  </div>
                </div>
                <a
                  href={contract.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  İndir
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            Önemli Bilgilendirme
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Tedarika platformunu kullanarak yukarıdaki sözleşme ve politikaları kabul etmiş sayılırsınız. 
            Lütfen satıcı olarak haklarınızı ve yükümlülüklerinizi öğrenmek için bu belgeleri dikkatlice okuyunuz.
          </p>
        </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ContractsPage;
