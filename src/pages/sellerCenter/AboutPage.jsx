import React from "react";
import { SeoHelmet } from "@/components/seo";
import { useLocation } from "react-router-dom";
import { Target, Users, Award, Zap } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import {
  SellerCenterBreadcrumb,
  SellerCenterHero,
  SellerCenterCard,
  SellerCenterSection,
  SellerCenterProse,
} from "./components";
import { createSeoMeta, getBreadcrumbSchema, getAboutPageOrganizationSchema } from "@/utils/seo";

const AboutPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Hakkımızda | Tedarika Satıcı Platformu - KOBİ'ler için Dijital E-İhracat",
    description: "Tedarika Satıcı Platformu (seller.tedarika.com.tr), ihracat yapmak isteyen KOBİ'lere ve üreticilere özel olarak tasarlanmış dijital bir pazaryeri çözümüdür. Üret, biz dünyaya taşıyalım.",
    path: location.pathname,
    keywords: "tedarika hakkında, B2B platform, satıcı paneli, e-ihracat, KOBİ ihracat, dijital pazaryeri, ihracat platformu, Türkiye ihracat, üretici platformu, global pazar"
  });

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "Hakkımızda", url: location.pathname }
  ];

  const sections = [
    { title: "Vizyonumuz", icon: Target, iconBg: "from-emerald-600 to-teal-600", content: "Türkiye'nin en büyük ve güvenilir B2B platformu olarak, satıcıların büyümesine ve global pazarlara açılmasına destek olmak." },
    { title: "Misyonumuz", icon: Zap, iconBg: "from-teal-600 to-emerald-600", content: "Satıcıların satış süreçlerini dijitalleştirerek zamandan ve maliyetten tasarruf etmelerini sağlamak, binlerce alıcıya ulaşmalarını kolaylaştırmak." },
    { title: "Değerlerimiz", icon: Award, iconBg: "from-green-600 to-teal-600", content: "Güven, şeffaflık ve satıcı memnuniyeti temel değerlerimizdir. İş ortaklarımızla uzun vadeli ilişkiler kurarız." },
    { title: "Avantajlarımız", icon: Users, iconBg: "from-emerald-700 to-teal-700", content: "Binlerce alıcı, güvenli ödeme altyapısı ve gelişmiş satış araçlarıyla işletmenizin tüm satış ihtiyaçlarını karşılıyoruz." },
  ];

  return (
    <>
      <SeoHelmet
        seoMeta={seoMeta}
        jsonLd={[
          getBreadcrumbSchema(breadcrumbItems),
          getAboutPageOrganizationSchema(),
        ]}
      />
      <SellerCenterLayout>
        <SellerCenterBreadcrumb items={breadcrumbItems} />
        <SellerCenterHero
          h1="Hakkımızda"
          subtitle="Türkiye'nin en güvenilir B2B satış platformu"
          icon={Award}
        />

        <SellerCenterCard className="mb-6 sm:mb-8">
          <SellerCenterProse>
            <SellerCenterSection title="Tedarika Satıcı Platformu Nedir?" showAccent={true}>
              <p className="mb-4">
                Tedarika Satıcı Platformu (seller.tedarika.com.tr), ihracat yapmak isteyen KOBİ'lere ve üreticilere özel olarak tasarlanmış dijital bir pazaryeri çözümüdür. Bu platform, Türkiye'deki işletmelerin ürünlerini kolayca dünya pazarlarına sunmalarını sağlamak amacıyla oluşturuldu. Tedarika olarak, satıcı odaklı yaklaşımımızla <strong>"Üret, biz dünyaya taşıyalım"</strong> sloganını benimsiyor ve her ölçekteki üreticinin uluslararası ticarete atılmasını kolaylaştırıyoruz.
              </p>
            </SellerCenterSection>
            <SellerCenterSection title="Değer Teklifimiz" showAccent={true}>
              <p className="mb-4">
                Satıcılara sunduğumuz değer teklifinin merkezinde, karmaşık ihracat süreçlerini basitleştirmek vardır. Tedarika Satıcı Paneli'nde, bir KOBİ veya üretici firma dakikalar içinde kendi mağazasını açabilir, ürünlerini sisteme yükleyebilir ve global alıcılara ulaşmaya başlayabilir. Platformumuz, satıcıların karşılaşabileceği dil, lojistik ve belge engellerini ortadan kaldıran entegre çözümler barındırır.
              </p>
              <p className="mb-4">
                Örneğin, yabancı bir alıcıdan mesaj aldığınızda dil bilmiyor olsanız bile, otomatik çeviri sayesinde rahatlıkla iletişim kurabilirsiniz. Yine benzer şekilde, ihracat yapmak istediğinizde hangi sertifika veya izinlerin gerektiği konusunda akıllı uyarı sistemi sizi bilgilendirir.
              </p>
            </SellerCenterSection>
            <SellerCenterSection title="İş Modelimiz ve Vizyonumuz" showAccent={true}>
              <p className="mb-4">
                Tedarika, satıcılar için hesaplı ve sonuç odaklı bir iş modeli sunar. Platforma katılım ücretsiz olup, satışlarınız üzerinden düşük oranlı komisyonlarla çalışıyoruz. Amacımız, KOBİ'lerin risk almadan ihracata adım atabilmeleridir. Vizyon olarak, Türkiye'deki her üreticinin küresel bir satıcıya dönüşebildiği bir ekosistem yaratmayı hedefliyoruz.
              </p>
            </SellerCenterSection>
            <SellerCenterSection title="Platform Özellikleri" showAccent={true}>
              <p className="mb-4">
                Tedarika Satıcı Paneli, <strong>"KOBİ'ler için dijital e-ihracat platformu"</strong> mottosunu gerçeğe dönüştüren araçlarla doludur. Satıcılarımız; güvenli ödeme altyapısı, sigortalı lojistik seçenekleri, gerçek zamanlı çeviri ile müşteri iletişimi, çok dilli ürün kataloğu ve küresel pazarlama desteği gibi imkanlardan faydalanır.
              </p>
              <p className="mb-4">
                Tedarika ailesine katılan her satıcı, sadece bir online pazaryerine adım atmış olmaz – aynı zamanda uluslararası ticarette deneyim kazanacağı, öğrenerek büyüyeceği bir topluluğun parçası olur.
              </p>
            </SellerCenterSection>
            <SellerCenterSection title="Sonuç" showAccent={true}>
              <p>
                Özetle, seller.tedarika.com.tr Türkiye'nin üreticilerini dünyayla buluşturan bir köprü görevi görür. Eğer siz de ürünlerinizi global pazara taşımayı düşünüyor ancak nereden başlayacağınızı bilemiyorsanız, Tedarika Satıcı Platformu tam da ihtiyacınız olan çözümleri sunmak için burada.
              </p>
            </SellerCenterSection>
          </SellerCenterProse>
        </SellerCenterCard>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map(({ title, content, icon: Icon, iconBg }, idx) => (
            <SellerCenterCard key={idx} hover>
              <div className="flex items-start gap-4 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">{content}</p>
            </SellerCenterCard>
          ))}
        </div>
      </SellerCenterLayout>
    </>
  );
};

export default AboutPage;
