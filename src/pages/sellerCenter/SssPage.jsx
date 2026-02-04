import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, ChevronRight } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";
import { SSS_FAQS } from "@/constants/sssFaqs";

const SssPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Sıkça Sorulan Sorular (SSS) | Tedarika Satıcı Platformu - E-İhracat Rehberi",
    description: "Tedarika satıcı platformu hakkında sıkça sorulan sorular. Kayıt, ürün ekleme, ödeme, sipariş, kargo, ihracat, faturalandırma ve daha fazlası. KOBİ'ler için e-ihracat rehberi.",
    path: location.pathname,
    keywords: "tedarika SSS, sıkça sorulan sorular, satıcı soruları, yardım, destek, FAQ, e-ihracat SSS, KOBİ ihracat soruları, satıcı rehberi"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "SSS", url: location.pathname }
  ]);
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = SSS_FAQS;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <link rel="canonical" href={seoMeta.canonical} />
        {seoMeta.hreflang.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:title" content={seoMeta.og.title} />
        <meta property="og:description" content={seoMeta.og.description} />
        <meta property="og:type" content={seoMeta.og.type} />
        <meta property="og:url" content={seoMeta.og.url} />
        <meta property="og:image" content={seoMeta.og.image} />
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta property="og:site_name" content={seoMeta.og.siteName} />
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
          }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SellerCenterLayout>
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link to="/seller/landing" className="hover:text-emerald-600">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 font-medium">SSS</span>
        </nav>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">SSS</h1>
              <p className="text-emerald-50 mt-2">Sıkça Sorulan Sorular</p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg">Tedarika satıcı paneli hakkında merak ettikleriniz</p>
        </div>

        <div className="space-y-8">
          {(() => {
            const categories = [...new Set(faqs.map(faq => faq.category))];
            return categories.map((category, catIndex) => {
              const categoryFaqs = faqs.filter(faq => faq.category === category);
              return (
                <div key={catIndex} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full" />
                    {category}
                  </h2>
                  {categoryFaqs.map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    return (
                      <div key={globalIndex} className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <button onClick={() => toggleFaq(globalIndex)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none group">
                          <span className="text-lg font-bold text-gray-900 pr-4 group-hover:text-emerald-600 transition-colors">{faq.question}</span>
                          <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            {openIndex === globalIndex ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
                          </span>
                        </button>
                        {openIndex === globalIndex && (
                          <div className="px-6 pb-6">
                            <div className="pt-2 border-t-2 border-emerald-100">
                              <p className="text-gray-600 leading-relaxed mt-4 text-lg">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>

        <div className="mt-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-2xl shadow-lg">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900">Sorunuz mu var?</h3>
          </div>
          <p className="text-gray-700 mb-5 text-lg">Burada bulamadığınız sorular için destek ekibimizle iletişime geçebilirsiniz.</p>
          <div className="flex flex-wrap gap-4">
            <a href="https://wa.me/905382362605" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105">
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile İletişim
            </a>
            <a href="mailto:info@tedarika.com.tr" className="inline-flex items-center gap-3 bg-white text-emerald-700 border-2 border-emerald-500 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all hover:scale-105">
              <Mail className="w-5 h-5" />
              E-posta Gönder
            </a>
          </div>
        </div>
      </SellerCenterLayout>
    </>
  );
};

export default SssPage;
