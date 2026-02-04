import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import {
  SellerCenterBreadcrumb,
  SellerCenterHero,
  SellerCenterSection,
  SellerCenterLinkList,
  SellerCenterCallout,
} from "./components";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";
import { sellerCenterQuickLinks } from "@/constants/sellerCenterLinks";

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

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "Satıcı Merkezi", url: "/satici-merkezi" },
  ];

  const criticalTopics = [
    "Mağaza kimliği ve doğrulama: alıcı güveni burada başlar.",
    "Ürün verisi kalitesi: arama sıralaması ve dönüşüm bununla belirlenir.",
    "Fiyat, MOQ ve termin: B2B'de teklif kazanmanın ana parametreleri.",
    "Lojistik + evrak: sınır ötesinde sürpriz çıkaran kısım burası.",
    "Tahsilat ve uyuşmazlık: riskin yönetimi.",
  ];

  const quickLinks = sellerCenterQuickLinks.map((l) => ({ to: l.href, label: l.label }));

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
        <SellerCenterBreadcrumb items={breadcrumbItems} />
        <SellerCenterHero
          h1="Satıcı Merkezi"
          subtitle="B2B toptan satış ve e-ihracat operasyon rehberi"
          description="Tedarika Satıcı Merkezi; mağazanızı kurduktan sonra satışa hazır hale gelmeniz, ürün kataloğunuzu doğru standartlarda yayınlamanız ve B2B siparişleri sorunsuz yönetmeniz için hazırlanmış operasyon rehberidir."
          icon={BookOpen}
        />

        <article className="space-y-8">
          <SellerCenterSection title="Satıcı panelinde en kritik 5 konu">
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              {criticalTopics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </SellerCenterSection>

          <SellerCenterSection title="Hızlı başlangıç bağlantıları">
            <SellerCenterLinkList links={quickLinks} />
          </SellerCenterSection>

          <SellerCenterCallout variant="warning">
            <p className="text-amber-900 font-semibold">
              Yeni satıcıysanız önce{" "}
              <Link to="/satici-merkezi/ilk-7-gun" className="underline hover:no-underline text-amber-800">
                İlk 7 Gün Planı
              </Link>{" "}
              sayfasını tamamlayın.
            </p>
          </SellerCenterCallout>
        </article>
      </SellerCenterLayout>
    </>
  );
};

export default SellerCenterIndexPage;
