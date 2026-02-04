import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const SiparisYonetimiPage = () => (
  <SellerCenterArticle
    title="Sipariş Yönetimi | Tedarika'da B2B Sipariş Kabul, Hazırlık ve Sevk"
    description="B2B sipariş süreci nasıl yönetilir? Sipariş onayı, üretim/hazırlık, kısmi sevk, iptal koşulları, kalite kontrol ve zamanında sevk için operasyon rehberi."
    keywords="sipariş yönetimi, B2B sipariş, sevk, kalite kontrol, kısmi sevk"
    h1="Sipariş Yönetimi"
    subtitle="B2B'de iyi satıcı, “çok satan” değil; “sözünü tutan” satıcıdır. Sipariş yönetiminde standart koymak, performans puanını ve tekrar siparişi doğrudan etkiler."
    breadcrumbs={[{ name: "Sipariş Yönetimi", url: "/satici-merkezi/siparis-yonetimi" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Sipariş yaşam döngüsü (basit model)</h2>
      <ol className="list-decimal list-inside space-y-1 text-gray-700">
        <li>Sipariş/teklif onayı</li>
        <li>Hazırlık/üretim</li>
        <li>Paketleme ve kalite kontrol</li>
        <li>Evrak hazırlığı</li>
        <li>Sevk ve takip bilgisi</li>
        <li>Teslimat ve kapanış</li>
      </ol>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Kısmi sevk (partial shipment) ne zaman mantıklı?</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Büyük siparişte stokta olanı hemen çıkarmak</li>
        <li>Üretimi parça parça tamamlanan ürünler</li>
      </ul>
      <p className="text-gray-700 mt-2">Ama alıcıyla yazılı mutabakat olmadan kısmi sevk yapmayın; uyuşmazlık çıkarır.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Kalite kontrol standardı</h2>
      <p className="text-gray-700">En düşük seviye: koli bazlı kontrol. Daha iyi seviye: lot bazlı örnekleme (AQL mantığı). B2B alıcılar, süreç standardı duyunca daha rahat sipariş verir.</p>
    </section>
  </SellerCenterArticle>
);

export default SiparisYonetimiPage;
