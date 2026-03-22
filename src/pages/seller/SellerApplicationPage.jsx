import React from "react";
import { SeoHelmet } from "@/components/seo";
import { useLocation } from "react-router-dom";
import SellerApplicationForm from "@/components/seller/SellerApplicationForm";
import { createSeoMeta, getBreadcrumbSchema } from "@/utils/seo";

const SellerApplicationPage = () => {
  const location = useLocation();
  const seoMeta = createSeoMeta({
    title: "Satıcı Başvurusu | Tedarika Satıcı Paneli - Ücretsiz Mağaza Açın",
    description: "Tedarika B2B pazaryerinde satıcı olmak için başvurun. Ücretsiz mağaza açın, ürünlerinizi global pazara taşıyın. Hızlı onay süreci, dijital belge yükleme, anında mağaza açılışı.",
    path: location.pathname,
    keywords: "tedarika satıcı başvurusu, B2B satıcı ol, pazaryeri başvurusu, ücretsiz mağaza aç, satıcı kayıt, ürün satış platformu, e-ticaret başvurusu, KOBİ satıcı, ihracat satıcısı"
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Satıcı Başvurusu", url: location.pathname }
  ]);

  return (
    <>
      <SeoHelmet seoMeta={seoMeta} jsonLd={[breadcrumbSchema]} />
      <SellerApplicationForm />
    </>
  );
};

export default SellerApplicationPage;
