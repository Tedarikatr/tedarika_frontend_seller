import React, { useState } from "react";
import { SeoHelmet } from "@/components/seo";
import { useLocation } from "react-router-dom";
import { HelpCircle, MessageCircle, Mail } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import {
  SellerCenterBreadcrumb,
  SellerCenterHero,
  SellerCenterSection,
  SellerCenterFaqItem,
} from "./components";
import { createSeoMeta, getBreadcrumbSchema, getFAQPageSchema } from "@/utils/seo";
import { SSS_FAQS } from "@/constants/sssFaqs";

const SssPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Sıkça Sorulan Sorular (SSS) | Tedarika Satıcı Platformu - E-İhracat Rehberi",
    description: "Tedarika satıcı platformu hakkında sıkça sorulan sorular. Kayıt, ürün ekleme, ödeme, sipariş, kargo, ihracat, faturalandırma ve daha fazlası. KOBİ'ler için e-ihracat rehberi.",
    path: location.pathname,
    keywords: "tedarika SSS, sıkça sorulan sorular, satıcı soruları, yardım, destek, FAQ, e-ihracat SSS, KOBİ ihracat soruları, satıcı rehberi"
  });

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "SSS", url: location.pathname }
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const faqs = SSS_FAQS;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <>
      <SeoHelmet
        seoMeta={seoMeta}
        jsonLd={[
          getFAQPageSchema(faqs),
          getBreadcrumbSchema(breadcrumbItems),
        ]}
      />
      <SellerCenterLayout>
        <SellerCenterBreadcrumb items={breadcrumbItems} />
        <SellerCenterHero
          h1="SSS"
          subtitle="Sıkça Sorulan Sorular"
          description="Tedarika satıcı paneli hakkında merak ettikleriniz"
          icon={HelpCircle}
        />

        <div className="space-y-8">
          {categories.map((category, catIndex) => {
            const categoryFaqs = faqs.filter(faq => faq.category === category);
            return (
              <SellerCenterSection key={catIndex} title={category}>
                <div className="space-y-3">
                  {categoryFaqs.map((faq) => {
                    const globalIndex = faqs.indexOf(faq);
                    return (
                      <SellerCenterFaqItem
                        key={globalIndex}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === globalIndex}
                        onToggle={() => toggleFaq(globalIndex)}
                      />
                    );
                  })}
                </div>
              </SellerCenterSection>
            );
          })}
        </div>

        <div className="mt-8 p-6 rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Sorunuz mu var?</h3>
          </div>
          <p className="text-slate-600 mb-4">
            Burada bulamadığınız sorular için destek ekibimizle iletişime geçebilirsiniz.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/905382362605"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile İletişim
            </a>
            <a
              href="mailto:info@tedarika.com.tr"
              className="inline-flex items-center gap-2 bg-white border-2 border-emerald-500 text-emerald-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
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
