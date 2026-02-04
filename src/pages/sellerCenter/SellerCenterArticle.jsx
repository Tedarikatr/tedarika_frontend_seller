import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SellerCenterLayout from "./SellerCenterLayout";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

/**
 * Satıcı Merkezi makale sayfası: SEO meta, breadcrumb, hero, prose içerik.
 * @param {string} title - Meta title
 * @param {string} description - Meta description
 * @param {string} keywords - Meta keywords (optional)
 * @param {string} h1 - Sayfa H1
 * @param {string} [subtitle] - Hero alt başlık
 * @param {Array} breadcrumbs - [{ name, url }]
 * @param {React.ReactNode} children - İçerik (article body)
 */
const SellerCenterArticle = ({
  title,
  description,
  keywords = "",
  h1,
  subtitle,
  breadcrumbs = [],
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
        <meta property="og:locale" content={seoMeta.og.locale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta name="twitter:description" content={seoMeta.twitter.description} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SellerCenterLayout>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap" aria-label="Breadcrumb">
          {breadcrumbItems.map((item, i) => (
            <React.Fragment key={item.url}>
              {i > 0 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              {i < breadcrumbItems.length - 1 ? (
                <Link to={item.url} className="hover:text-emerald-600 transition-colors">
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{item.name}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        {/* Hero */}
        <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
            {h1}
          </h1>
          {subtitle && (
            <p className="text-emerald-100 text-base sm:text-lg max-w-3xl">
              {subtitle}
            </p>
          )}
        </header>
        {/* Article body */}
        <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-ul:my-4 prose-ol:my-4">
          {children}
        </article>
      </SellerCenterLayout>
    </>
  );
};

export default SellerCenterArticle;
