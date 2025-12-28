import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Target, Users, Award, Zap } from "lucide-react";
import SellerHeader from "@/components/sellerLanding/SellerHeader";
import Footer from "@/components/corporate/Footer";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const AboutPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Hakkımızda | Tedarika Satıcı Paneli",
    description: "Tedarika satıcı paneli hakkında bilgi edinin. Vizyonumuz, misyonumuz ve değerlerimiz. Türkiye'nin en güvenilir B2B satış platformu.",
    path: location.pathname,
    keywords: "tedarika hakkında, B2B platform, satıcı paneli, vizyon, misyon, değerler, güvenilir platform"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Hakkımızda", url: location.pathname }
  ]);
  const sections = [
    {
      title: "Vizyonumuz",
      icon: Target,
      iconBg: "from-emerald-600 via-teal-600 to-green-600",
      content:
        "Türkiye'nin en büyük ve güvenilir B2B platformu olarak, satıcıların büyümesine ve global pazarlara açılmasına destek olmak.",
    },
    {
      title: "Misyonumuz",
      icon: Zap,
      iconBg: "from-teal-600 via-emerald-600 to-teal-700",
      content:
        "Satıcıların satış süreçlerini dijitalleştirerek zamandan ve maliyetten tasarruf etmelerini sağlamak, binlerce alıcıya ulaşmalarını kolaylaştırmak.",
    },
    {
      title: "Değerlerimiz",
      icon: Award,
      iconBg: "from-green-600 via-emerald-600 to-teal-600",
      content:
        "Güven, şeffaflık ve satıcı memnuniyeti temel değerlerimizdir. İş ortaklarımızla uzun vadeli ilişkiler kurarız.",
    },
    {
      title: "Avantajlarımız",
      icon: Users,
      iconBg: "from-emerald-700 via-teal-700 to-green-700",
      content:
        "Binlerce alıcı, güvenli ödeme altyapısı ve gelişmiş satış araçlarıyla işletmenizin tüm satış ihtiyaçlarını karşılıyoruz.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <link rel="canonical" href={seoMeta.canonical} />
        
        {/* Hreflang Tags */}
        {seoMeta.hreflang.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        
        {/* Open Graph */}
        <meta property="og:title" content={seoMeta.og.title} />
        <meta property="og:description" content={seoMeta.og.description} />
        <meta property="og:type" content={seoMeta.og.type} />
        <meta property="og:url" content={seoMeta.og.url} />
        <meta property="og:image" content={seoMeta.og.image} />
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta property="og:site_name" content={seoMeta.og.siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="bg-white min-h-screen">
        <SellerHeader />
        
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Header with Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  Hakkımızda
                </h1>
                <p className="text-emerald-100 text-lg">
                  Türkiye'nin en güvenilir B2B satış platformu
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {sections.map(({ title, content, icon: Icon, iconBg }, idx) => (
              <article
                key={idx}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`relative w-14 h-14 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                    <Icon className="relative z-10 w-7 h-7 text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {title}
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">{content}</p>
              </article>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
