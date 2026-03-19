import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import SellerCenterLayout from "./SellerCenterLayout";
import {
  SellerCenterBreadcrumb,
  SellerCenterHero,
  SellerCenterCard,
  SellerCenterProse,
} from "./components";
import { createSeoMeta, getBreadcrumbSchema, getArticleSchema } from "@/utils/seo";

/**
 * Satıcı Merkezi makale sayfası: SEO meta, breadcrumb, hero, prose içerik.
 * Kurumsal tasarım bileşenleri ile standart yapı.
 */
const SellerCenterArticle = ({
  title,
  description,
  keywords = "",
  h1,
  subtitle,
  heroDescription,
  breadcrumbs = [],
  icon,
  children,
}) => {
  const location = useLocation();
  const path = location.pathname;
  const seoMeta = createSeoMeta({
    title,
    description,
    path,
    keywords: keywords || "tedarika satıcı merkezi, B2B rehberi, satıcı paneli, e-ihracat, toptan satış",
  });
  const breadcrumbItems = [
    { name: "Ana Sayfa", url: "/seller/landing" },
    { name: "Satıcı Merkezi", url: "/satici-merkezi" },
    ...breadcrumbs,
  ];
  const breadcrumbSchema = getBreadcrumbSchema(
    breadcrumbItems.map((b) => ({ name: b.name, url: b.url }))
  );
  const articleSchema = getArticleSchema({
    headline: h1 || title,
    description: description || subtitle,
    url: path,
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().slice(0, 10),
  });

  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        {keywords && <meta name="keywords" content={seoMeta.keywords} />}
        <link rel="canonical" href={seoMeta.canonical} />
        {seoMeta.hreflang.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:title" content={seoMeta.og.title} />
        <meta property="og:description" content={seoMeta.og.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={seoMeta.og.url} />
        <meta property="og:image" content={seoMeta.og.image} />
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <meta name="twitter:image" content={seoMeta.twitter.image} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      <SellerCenterLayout>
        <SellerCenterBreadcrumb items={breadcrumbItems} />
        <SellerCenterHero h1={h1} subtitle={subtitle} description={heroDescription} icon={icon} />
        <SellerCenterCard>
          <SellerCenterProse>{children}</SellerCenterProse>
        </SellerCenterCard>
      </SellerCenterLayout>
    </>
  );
};

export default SellerCenterArticle;
