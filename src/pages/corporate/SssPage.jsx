import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail } from "lucide-react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";

const SssPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Tedarika'da nasıl satıcı olabilirim?",
      answer: "Tedarika'da satıcı olmak için kayıt sayfasından başvurunuzu yapabilirsiniz. Başvurunuz incelendikten sonra onay süreciniz tamamlanır ve satışa başlayabilirsiniz."
    },
    {
      question: "Ürün ekleme ve yönetimi nasıl yapılır?",
      answer: "Satıcı panelinizden 'Ürünlerim' bölümüne giderek kolayca ürün ekleyebilir, düzenleyebilir ve silebilirsiniz. Toplu ürün yükleme özelliği ile Excel dosyası üzerinden çok sayıda ürünü aynı anda sisteme aktarabilirsiniz."
    },
    {
      question: "Ödemeler nasıl ve ne zaman yapılır?",
      answer: "Satış sonrası ödemeleriniz, alıcının siparişi teslim aldığını onaylamasının ardından işleme alınır. Ödemeler haftalık olarak banka hesabınıza aktarılır. Ödeme detaylarınızı 'Finans' bölümünden takip edebilirsiniz."
    },
    {
      question: "Komisyon oranları nedir?",
      answer: "Komisyon oranları ürün kategorisine göre değişiklik gösterir. Standart komisyon oranları %5 ile %15 arasındadır. Detaylı bilgi için satıcı sözleşmesini inceleyebilirsiniz."
    },
    {
      question: "Sipariş takibi nasıl yapılır?",
      answer: "'Siparişler' bölümünden tüm siparişlerinizi detaylı şekilde takip edebilirsiniz. Her siparişin durumu (hazırlanıyor, kargoda, teslim edildi) gerçek zamanlı olarak güncellenir."
    },
    {
      question: "Kargo süreçleri nasıl işler?",
      answer: "Kargo entegrasyonumuz sayesinde anlaşmalı kargo firmalarından dilediğinizi seçebilir ve otomatik kargo etiketi oluşturabilirsiniz. Kargo takip numaraları otomatik olarak alıcıya iletilir."
    },
    {
      question: "İade ve değişim işlemleri nasıl yönetilir?",
      answer: "İade talepleri sistem üzerinden size bildirilir. İade politikanıza uygun olan talepleri onaylayıp işlem yapabilirsiniz. İade edilen ürünler için komisyon iadesi yapılır."
    },
    {
      question: "Mağaza sayfamı nasıl özelleştirebilirim?",
      answer: "'Mağaza Ayarları' bölümünden logo, banner, açıklama ve iletişim bilgilerinizi güncelleyebilirsiniz. Ayrıca öne çıkan ürünlerinizi ve kampanyalarınızı sergileyebilirsiniz."
    },
    {
      question: "Müşteri yorumlarına nasıl cevap verebilirim?",
      answer: "'Değerlendirmeler' bölümünden müşteri yorumlarını görebilir ve yanıtlayabilirsiniz. Müşteri memnuniyeti puanınızı bu bölümden takip edebilirsiniz."
    },
    {
      question: "Teknik destek nasıl alınır?",
      answer: "7/24 canlı destek hattımız, e-posta (info@tedarika.app) veya WhatsApp (+90 538 236 26 05) üzerinden bizimle iletişime geçebilirsiniz. Ayrıca yardım merkezimizde detaylı kılavuzlar bulabilirsiniz."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Sıkça Sorulan Sorular | Tedarika Satıcı Paneli</title>
        <meta name="description" content="Tedarika satıcı paneli hakkında sıkça sorulan sorular ve cevapları." />
      </Helmet>

      <div className="bg-white min-h-screen">
        <SellerHeader />
        
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">SSS</h1>
              <p className="text-emerald-50 mt-2">Sıkça Sorulan Sorular</p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg">
            Tedarika satıcı paneli hakkında merak ettikleriniz
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
              >
                <span className="text-lg font-bold text-gray-900 pr-4 group-hover:text-emerald-600 transition-colors">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-white" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white" />
                  )}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="pt-2 border-t-2 border-emerald-100">
                    <p className="text-gray-600 leading-relaxed mt-4 text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-2xl shadow-lg">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900">Sorunuz mu var?</h3>
          </div>
          <p className="text-gray-700 mb-5 text-lg">
            Burada bulamadığınız sorular için destek ekibimizle iletişime geçebilirsiniz.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/905382362605"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile İletişim
            </a>
            <a
              href="mailto:info@tedarika.app"
              className="inline-flex items-center gap-3 bg-white text-emerald-700 border-2 border-emerald-500 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              E-posta Gönder
            </a>
          </div>
        </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SssPage;
