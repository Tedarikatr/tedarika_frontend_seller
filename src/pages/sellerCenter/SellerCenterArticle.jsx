import React from "react";
import { SeoHelmet } from "@/components/seo";
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
      <SeoHelmet
        seoMeta={seoMeta}
        includeKeywords={Boolean(keywords)}
        ogType="article"
        jsonLd={[breadcrumbSchema, articleSchema]}
      />
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
