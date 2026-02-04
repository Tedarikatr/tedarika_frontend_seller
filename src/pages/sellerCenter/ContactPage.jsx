import React, { useRef, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Mail, MessageSquare, Phone } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import {
  SellerCenterBreadcrumb,
  SellerCenterHero,
  SellerCenterCard,
} from "./components";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const ContactPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "İletişim | Tedarika Satıcı Paneli",
    description: "Tedarika satıcı destek ekibi ile iletişime geçin. Sorularınız için bizimle iletişime geçebilirsiniz. E-posta, telefon ve WhatsApp desteği.",
    path: location.pathname,
    keywords: "tedarika iletişim, satıcı destek, müşteri hizmetleri, iletişim bilgileri, destek hattı"
  });

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "İletişim", url: location.pathname }
  ];

  const toast = useToast();
  const subjectRef = useRef();
  const messageRef = useRef();
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subject = subjectRef.current?.value?.trim();
    const message = messageRef.current?.value?.trim();
    if (!subject || !message) {
      toast.error("Lütfen konu ve mesaj alanlarını doldurun.");
      return;
    }
    try {
      setLoading(true);
      toast.success("Mesajınız başarıyla gönderildi.");
      subjectRef.current.value = "";
      messageRef.current.value = "";
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Gönderim sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    { icon: Mail, title: "E-posta", href: "mailto:info@tedarika.com.tr", label: "info@tedarika.com.tr", gradient: "from-emerald-600 to-teal-600" },
    { icon: Phone, title: "Telefon", href: "tel:+905382362605", label: "+90 (538) 236 26 05", gradient: "from-teal-600 to-green-600" },
    { icon: MessageSquare, title: "WhatsApp", href: "https://wa.me/905382362605", label: "WhatsApp ile ulaşın", gradient: "from-green-600 to-emerald-600", external: true },
  ];

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
        <script type="application/ld+json">{JSON.stringify(getBreadcrumbSchema(breadcrumbItems))}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "İletişim",
          "description": seoMeta.description,
          "url": seoMeta.canonical,
          "mainEntity": {
            "@type": "Organization",
            "name": "Tedarika",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+90-538-236-26-05",
              "contactType": "Customer Service",
              "email": "info@tedarika.com.tr",
              "availableLanguage": ["Turkish", "English"]
            }
          }
        })}</script>
      </Helmet>
      <SellerCenterLayout>
        <SellerCenterBreadcrumb items={breadcrumbItems} />
        <SellerCenterHero h1="İletişim" subtitle="Bizimle iletişime geçin" icon={MessageSquare} />

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-6 sm:mb-8">
          {contactCards.map(({ icon: Icon, title, href, label, gradient, external }) => (
            <SellerCenterCard key={title} hover>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              </div>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                {label}
              </a>
            </SellerCenterCard>
          ))}
        </div>

        <SellerCenterCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Mesaj Gönderin</h2>
              <p className="text-slate-600">Sorularınız, önerileriniz veya iş birliği teklifleriniz için bize yazın</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">Konu</label>
              <input
                ref={subjectRef}
                type="text"
                required
                placeholder="Mesajınızın konusunu yazın"
                className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">Mesajınız</label>
              <textarea
                ref={messageRef}
                required
                placeholder="Mesajınızı detaylı bir şekilde yazın..."
                className="w-full border border-slate-300 px-4 py-3 rounded-xl h-40 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-sm text-slate-700 font-medium">Dosya Ekle (Opsiyonel)</span>
              <label className="bg-white text-sm font-semibold px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors text-center sm:text-left">
                Dosya Seç
                <input ref={fileRef} type="file" className="hidden" />
              </label>
            </div>
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gönderiliyor...
                  </span>
                ) : (
                  "Mesajı Gönder"
                )}
              </button>
            </div>
          </form>
        </SellerCenterCard>
      </SellerCenterLayout>
    </>
  );
};

export default ContactPage;
