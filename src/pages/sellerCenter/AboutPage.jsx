import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { Target, Users, Award, Zap, ChevronRight } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const AboutPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Hakkımızda | Tedarika Satıcı Platformu - KOBİ'ler için Dijital E-İhracat",
    description: "Tedarika Satıcı Platformu (seller.tedarika.com.tr), ihracat yapmak isteyen KOBİ'lere ve üreticilere özel olarak tasarlanmış dijital bir pazaryeri çözümüdür. Üret, biz dünyaya taşıyalım.",
    path: location.pathname,
    keywords: "tedarika hakkında, B2B platform, satıcı paneli, e-ihracat, KOBİ ihracat, dijital pazaryeri, ihracat platformu, Türkiye ihracat, üretici platformu, global pazar"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "Hakkımızda", url: location.pathname }
  ]);

  const sections = [
    { title: "Vizyonumuz", icon: Target, iconBg: "from-emerald-600 via-teal-600 to-green-600", content: "Türkiye'nin en büyük ve güvenilir B2B platformu olarak, satıcıların büyümesine ve global pazarlara açılmasına destek olmak." },
    { title: "Misyonumuz", icon: Zap, iconBg: "from-teal-600 via-emerald-600 to-teal-700", content: "Satıcıların satış süreçlerini dijitalleştirerek zamandan ve maliyetten tasarruf etmelerini sağlamak, binlerce alıcıya ulaşmalarını kolaylaştırmak." },
    { title: "Değerlerimiz", icon: Award, iconBg: "from-green-600 via-emerald-600 to-teal-600", content: "Güven, şeffaflık ve satıcı memnuniyeti temel değerlerimizdir. İş ortaklarımızla uzun vadeli ilişkiler kurarız." },
    { title: "Avantajlarımız", icon: Users, iconBg: "from-emerald-700 via-teal-700 to-green-700", content: "Binlerce alıcı, güvenli ödeme altyapısı ve gelişmiş satış araçlarıyla işletmenizin tüm satış ihtiyaçlarını karşılıyoruz." },
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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Tedarika Satıcı Platformu",
          "url": "https://seller.tedarika.com.tr",
          "logo": "https://seller.tedarika.com.tr/images/logo.svg",
          "description": "Tedarika Satıcı Platformu, ihracat yapmak isteyen KOBİ'lere ve üreticilere özel olarak tasarlanmış dijital bir pazaryeri çözümüdür.",
          "slogan": "Üret, biz dünyaya taşıyalım",
          "sameAs": ["https://www.tedarika.com.tr"],
          "contactPoint": { "@type": "ContactPoint", "email": "info@tedarika.com.tr", "contactType": "customer service" }
        })}</script>
      </Helmet>
      <SellerCenterLayout>
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link to="/seller/landing" className="hover:text-emerald-600">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 font-medium">Hakkımızda</span>
        </nav>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">Hakkımızda</h1>
              <p className="text-emerald-100 text-lg">Türkiye'nin en güvenilir B2B satış platformu</p>
            </div>
          </div>
        </div>
        <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 border border-gray-100 overflow-hidden">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tedarika Satıcı Platformu Nedir?</h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Tedarika Satıcı Platformu (seller.tedarika.com.tr), ihracat yapmak isteyen KOBİ'lere ve üreticilere özel olarak tasarlanmış dijital bir pazaryeri çözümüdür. Bu platform, Türkiye'deki işletmelerin ürünlerini kolayca dünya pazarlarına sunmalarını sağlamak amacıyla oluşturuldu. Tedarika olarak, satıcı odaklı yaklaşımımızla <strong>"Üret, biz dünyaya taşıyalım"</strong> sloganını benimsiyor ve her ölçekteki üreticinin uluslararası ticarete atılmasını kolaylaştırıyoruz.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Değer Teklifimiz</h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Satıcılara sunduğumuz değer teklifinin merkezinde, karmaşık ihracat süreçlerini basitleştirmek vardır. Tedarika Satıcı Paneli'nde, bir KOBİ veya üretici firma dakikalar içinde kendi mağazasını açabilir, ürünlerini sisteme yükleyebilir ve global alıcılara ulaşmaya başlayabilir. Platformumuz, satıcıların karşılaşabileceği dil, lojistik ve belge engellerini ortadan kaldıran entegre çözümler barındırır.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Örneğin, yabancı bir alıcıdan mesaj aldığınızda dil bilmiyor olsanız bile, otomatik çeviri sayesinde rahatlıkla iletişim kurabilirsiniz. Yine benzer şekilde, ihracat yapmak istediğinizde hangi sertifika veya izinlerin gerektiği konusunda akıllı uyarı sistemi sizi bilgilendirir.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İş Modelimiz ve Vizyonumuz</h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Tedarika, satıcılar için hesaplı ve sonuç odaklı bir iş modeli sunar. Platforma katılım ücretsiz olup, satışlarınız üzerinden düşük oranlı komisyonlarla çalışıyoruz. Amacımız, KOBİ'lerin risk almadan ihracata adım atabilmeleridir. Vizyon olarak, Türkiye'deki her üreticinin küresel bir satıcıya dönüşebildiği bir ekosistem yaratmayı hedefliyoruz.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Özellikleri</h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Tedarika Satıcı Paneli, <strong>"KOBİ'ler için dijital e-ihracat platformu"</strong> mottosunu gerçeğe dönüştüren araçlarla doludur. Satıcılarımız; güvenli ödeme altyapısı, sigortalı lojistik seçenekleri, gerçek zamanlı çeviri ile müşteri iletişimi, çok dilli ürün kataloğu ve küresel pazarlama desteği gibi imkanlardan faydalanır.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Tedarika ailesine katılan her satıcı, sadece bir online pazaryerine adım atmış olmaz – aynı zamanda uluslararası ticarette deneyim kazanacağı, öğrenerek büyüyeceği bir topluluğun parçası olur.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sonuç</h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Özetle, seller.tedarika.com.tr Türkiye'nin üreticilerini dünyayla buluşturan bir köprü görevi görür. Eğer siz de ürünlerinizi global pazara taşımayı düşünüyor ancak nereden başlayacağınızı bilemiyorsanız, Tedarika Satıcı Platformu tam da ihtiyacınız olan çözümleri sunmak için burada.
              </p>
            </section>
          </div>
        </article>
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map(({ title, content, icon: Icon, iconBg }, idx) => (
            <article key={idx} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 border border-gray-100 overflow-hidden">
              <div className="flex items-start gap-4 mb-4">
                <div className={`relative w-14 h-14 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
                  <Icon className="relative z-10 w-7 h-7 text-white drop-shadow-lg" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">{content}</p>
            </article>
          ))}
        </div>
      </SellerCenterLayout>
    </>
  );
};

export default AboutPage;
