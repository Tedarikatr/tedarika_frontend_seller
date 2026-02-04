import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const SellerCenterIndexPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Satıcı Merkezi | Tedarika'da B2B Toptan Satış ve E‑İhracat Rehberi",
    description:
      "Tedarika satıcı paneli kullanım rehberi. Mağaza doğrulama, ürün listeleme standartları, GTİP-belge yönetimi, lojistik, ödeme-tahsilat, sipariş ve performans yönetimi.",
    path: location.pathname,
    keywords:
      "satıcı merkezi, tedarika rehberi, B2B toptan satış, e-ihracat rehberi, mağaza doğrulama, ürün listeleme, GTİP, lojistik, tahsilat, satıcı paneli",
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "Satıcı Merkezi", url: "/satici-merkezi" },
  ]);

  const criticalTopics = [
    "Mağaza kimliği ve doğrulama: alıcı güveni burada başlar.",
    "Ürün verisi kalitesi: arama sıralaması ve dönüşüm bununla belirlenir.",
    "Fiyat, MOQ ve termin: B2B'de teklif kazanmanın ana parametreleri.",
    "Lojistik + evrak: sınır ötesinde sürpriz çıkaran kısım burası.",
    "Tahsilat ve uyuşmazlık: riskin yönetimi.",
  ];

  const quickLinks = [
    { to: "/satici-merkezi/ilk-7-gun", label: "İlk 7 Gün Planı (onboarding)" },
    { to: "/satici-merkezi/urun-listeleme", label: "Ürün listeleme standartları" },
    { to: "/satici-merkezi/fiyatlandirma-teklif", label: "B2B fiyatlandırma ve teklif yönetimi" },
    { to: "/satici-merkezi/lojistik", label: "Lojistik, gümrük evrakları ve GTİP" },
    { to: "/satici-merkezi/odeme-tahsilat", label: "Tahsilat, ödeme güvenliği ve kesintiler" },
    { to: "/satici-merkezi/satici-performans", label: "Satıcı performans puanı ve büyüme" },
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
        <meta property="og:url" content={seoMeta.og.url} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SellerCenterLayout>
        <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-amber-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
            Satıcı Merkezi
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg max-w-3xl">
            Tedarika Satıcı Merkezi; mağazanızı kurduktan sonra satışa hazır hale gelmeniz, ürün kataloğunuzu doğru standartlarda yayınlamanız ve B2B siparişleri sorunsuz yönetmeniz için hazırlanmış operasyon rehberidir. Buradaki içerikler “kural metni” değil, sahada iş yapan KOBİ'lerin ihtiyacına göre hazırlanmış uygulama kılavuzlarıdır.
          </p>
        </header>

        <article className="space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Satıcı panelinde en kritik 5 konu
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {criticalTopics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Hızlı başlangıç bağlantıları
            </h2>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
            <p className="text-amber-900 font-semibold">
              Yeni satıcıysanız önce <Link to="/satici-merkezi/ilk-7-gun" className="underline hover:no-underline">İlk 7 Gün Planı</Link> sayfasını tamamlayın.
            </p>
          </div>
        </article>
      </SellerCenterLayout>
    </>
  );
};

export default SellerCenterIndexPage;
