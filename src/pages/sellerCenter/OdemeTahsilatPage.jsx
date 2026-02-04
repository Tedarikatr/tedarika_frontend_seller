import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const OdemeTahsilatPage = () => (
  <SellerCenterArticle
    title="Tahsilat ve Ödemeler | Tedarika Satıcı Ödeme Akışı ve Kesintiler"
    description="B2B pazaryerinde tahsilat nasıl çalışır? Ödeme güvenliği (escrow mantığı), ödeme takvimi, komisyon ve kesintiler, iade/chargeback risk yönetimi."
    keywords="tahsilat, ödeme, B2B ödeme, komisyon, kesinti, escrow, chargeback"
    h1="Ödeme ve Tahsilat Yönetimi"
    subtitle="B2B satışta “kazandım” demek, para hesabınıza geçtiğinde doğrudur. Bu yüzden tahsilat sürecini en baştan standartlaştırmanız gerekir."
    breadcrumbs={[{ name: "Ödeme ve Tahsilat", url: "/satici-merkezi/odeme-tahsilat" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Ödeme güvenliği mantığı (yüksek seviye)</h2>
      <p className="text-gray-700">Pazaryerinde amaç; alıcı için ödeme riskini, satıcı için tahsilat belirsizliğini azaltmaktır. Emanet (escrow) benzeri akışlarda ödeme, teslimat ve kanıt adımlarıyla bağlanır. Buradaki kritik şey: sevk/takip/teslim kanıtının düzgün tutulması.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Ödeme takvimi ve kesintiler (şeffaf yapı)</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Komisyon oranı nasıl hesaplanır? (kategori bazlı olabilir)</li>
        <li>Hizmet bedelleri (varsa): ödeme altyapısı, lojistik hizmeti, sigorta</li>
        <li>Geri ödemeler/iadeler nasıl yansır?</li>
        <li>Kur farkı ve çoklu para birimi yönetimi</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Chargeback ve uyuşmazlık riskini düşüren 6 alışkanlık</h2>
      <ol className="list-decimal list-inside space-y-1 text-gray-700">
        <li>Ürün sayfasında teknik belirsizlik bırakma</li>
        <li>Paketleme fotoğrafı çek ve sakla</li>
        <li>Sevk öncesi koli/palet sayısını kayda al</li>
        <li>Takip numarasını geciktirme</li>
        <li>Teslimat kanıtını arşivle</li>
        <li>Mesajlaşmada tüm mutabakatları yazılı tut</li>
      </ol>
    </section>
  </SellerCenterArticle>
);

export default OdemeTahsilatPage;
