import React, { useRef, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { Mail, MessageSquare, Phone, ChevronRight } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const ContactPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "İletişim | Tedarika Satıcı Paneli",
    description: "Tedarika satıcı destek ekibi ile iletişime geçin. Sorularınız için bizimle iletişime geçebilirsiniz. E-posta, telefon ve WhatsApp desteği.",
    path: location.pathname,
    keywords: "tedarika iletişim, satıcı destek, müşteri hizmetleri, iletişim bilgileri, destek hattı"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "İletişim", url: location.pathname }
  ]);
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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
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
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link to="/seller/landing" className="hover:text-emerald-600">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 font-medium">İletişim</span>
        </nav>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">İletişim</h1>
              <p className="text-emerald-50 mt-2">Bizimle iletişime geçin</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-3 mb-6 sm:mb-8">
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">E-posta</h3>
            </div>
            <a href="mailto:info@tedarika.com.tr" className="text-teal-600 hover:text-teal-700 font-semibold">info@tedarika.com.tr</a>
          </div>
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-teal-600 to-green-600 p-3 rounded-xl">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Telefon</h3>
            </div>
            <a href="tel:+905382362605" className="text-teal-600 hover:text-teal-700 font-semibold">+90 (538) 236 26 05</a>
          </div>
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">WhatsApp</h3>
            </div>
            <a href="https://wa.me/905382362605" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 font-semibold">WhatsApp ile ulaşın</a>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 space-y-5 sm:space-y-6 overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mesaj Gönderin</h2>
            <p className="text-gray-600">Sorularınız, önerileriniz veya iş birliği teklifleriniz için bize yazın</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Konu</label>
            <input ref={subjectRef} type="text" required placeholder="Mesajınızın konusunu yazın" className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Mesajınız</label>
            <textarea ref={messageRef} required placeholder="Mesajınızı detaylı bir şekilde yazın..." className="w-full border border-gray-300 px-4 py-3 rounded-xl h-40 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="text-sm text-gray-700 font-medium">Dosya Ekle (Opsiyonel)</span>
            <label className="bg-white text-sm font-semibold px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-center sm:text-left">Dosya Seç<input ref={fileRef} type="file" className="hidden" /></label>
          </div>
          <div className="flex justify-center pt-2">
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Gönderiliyor...</span> : "Mesajı Gönder"}
            </button>
          </div>
        </form>
      </SellerCenterLayout>
    </>
  );
};

export default ContactPage;
