import React from "react";
import { Helmet } from "react-helmet-async";
import { Shield, Lock, Eye, FileText, Bell, UserCheck } from "lucide-react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";

const KvkkPage = () => {
  const sections = [
    {
      title: "Kişisel Verilerin Toplanması",
      icon: FileText,
      content: "Tedarika olarak, satıcı panelimizde sunduğumuz hizmetler kapsamında, satıcı hesabı oluşturma, ürün yönetimi, sipariş takibi ve iletişim süreçlerinde kişisel verilerinizi topluyoruz."
    },
    {
      title: "Verilerin İşlenme Amacı",
      icon: Eye,
      content: "Toplanan kişisel veriler, hizmet kalitesini artırmak, yasal yükümlülükleri yerine getirmek, kullanıcı deneyimini iyileştirmek ve güvenli bir platform sunmak amacıyla işlenmektedir."
    },
    {
      title: "Veri Güvenliği",
      icon: Lock,
      content: "Kişisel verileriniz, en üst düzeyde güvenlik önlemleriyle korunmaktadır. Verilerinize yetkisiz erişim, kayıp veya ifşa durumlarına karşı teknik ve idari tedbirler alınmıştır."
    },
    {
      title: "Haklarınız",
      icon: UserCheck,
      content: "KVKK kapsamında, kişisel verilerinize erişim, düzeltme, silme ve işlemenin durdurulmasını talep etme haklarına sahipsiniz. Taleplerinizi info@tedarika.app adresine iletebilirsiniz."
    },
    {
      title: "Veri Paylaşımı",
      icon: Bell,
      content: "Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü şahıslarla paylaşılmamaktadır. İş ortaklarımızla yalnızca hizmet kalitesini artırmak için gerekli veriler paylaşılır."
    },
    {
      title: "Yasal Düzenlemeler",
      icon: Shield,
      content: "Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuat çerçevesinde işlenmekte ve korunmaktadır."
    }
  ];

  return (
    <>
      <Helmet>
        <title>KVKK | Tedarika Satıcı Paneli</title>
        <meta name="description" content="Tedarika kişisel verilerin korunması politikası. KVKK kapsamında haklarınız ve veri güvenliği." />
      </Helmet>

      <div className="bg-white min-h-screen">
        <SellerHeader />
        
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">KVKK</h1>
              <p className="text-emerald-50 mt-2">Kişisel Verilerin Korunması</p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg">
            Kişisel verilerinizin güvenliği bizim için önceliklidir
          </p>
        </div>

        <div className="space-y-6">
          {sections.map(({ title, content, icon: Icon }, idx) => (
            <article
              key={idx}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{content}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-3">
            <Shield className="w-7 h-7" />
            İletişim
          </h3>
          <p className="text-gray-700 mb-3 text-lg">
            KVKK kapsamındaki talepleriniz için bizimle iletişime geçebilirsiniz:
          </p>
          <div className="space-y-2">
            <p className="text-emerald-700 font-semibold text-lg flex items-center gap-2">
              <span className="text-2xl">✉️</span> E-posta: info@tedarika.app
            </p>
            <p className="text-emerald-700 font-semibold text-lg flex items-center gap-2">
              <span className="text-2xl">📞</span> Telefon: +90 (538) 236 26 05
            </p>
          </div>
        </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default KvkkPage;
