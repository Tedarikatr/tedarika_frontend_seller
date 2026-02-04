import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const FiyatlandirmaTeklifPage = () => (
  <SellerCenterArticle
    title="B2B Fiyatlandırma | MOQ, İskonto Kademeleri ve Teklif Yönetimi"
    description="Toptan satışta doğru fiyatlandırma. MOQ belirleme, iskonto kademeleri, para birimi, termin, Incoterms ve teklif şablonlarıyla B2B teklif kazanma rehberi."
    keywords="B2B fiyatlandırma, MOQ, iskonto kademeleri, teklif yönetimi, toptan fiyat, Incoterms"
    h1="B2B Fiyatlandırma ve Teklif Yönetimi"
    subtitle="B2B'de fiyat tek başına kazanmaz; “fiyat + termin + teslim şekli + güven” kombinasyonu kazanır. Bu sayfa, teklif süreçlerini standartlaştırıp kârlılığı korumanız için hazırlanmıştır."
    breadcrumbs={[{ name: "Fiyatlandırma ve Teklif", url: "/satici-merkezi/fiyatlandirma-teklif" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">MOQ nasıl belirlenir?</h2>
      <p className="text-gray-700 mb-2">MOQ, üretim ekonomisinin sınırıdır. Şu 3 maliyetle hesaplayın:</p>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Setup maliyeti (kalıp/ayar/işçilik)</li>
        <li>Paketleme ve sevkiyat maliyeti (koli/palet)</li>
        <li>Operasyon maliyeti (sipariş işleme, evrak, kalite kontrol)</li>
      </ul>
      <p className="text-gray-700 mt-2">Pratik kural: MOQ'u “en küçük kârlı sevkiyat birimi” olarak düşünün (koli/palet).</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">İskonto kademeleri (örnek model)</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>1–5 koli: liste fiyat</li>
        <li>6–20 koli: %3–5</li>
        <li>1 palet+: %7–10</li>
      </ul>
      <p className="text-gray-700 mt-2">Bu oranları kafadan değil, brüt kâr marjınıza göre belirleyin.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Teklif şablonu (kopyala‑yapıştır)</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Ürün/variant:</li>
        <li>Miktar + birim:</li>
        <li>Birim fiyat + para birimi:</li>
        <li>Toplam:</li>
        <li>Termin:</li>
        <li>Teslim şekli (Incoterms):</li>
        <li>Paketleme:</li>
        <li>Geçerlilik süresi: (örn. 7 gün)</li>
        <li>Notlar: (özelleştirme, belge, numune)</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Para birimi stratejisi</h2>
      <p className="text-gray-700">Global alıcı için EUR/USD fiyatı, karar süresini kısaltır. Kur riskini yönetmek için fiyat geçerlilik süresini mutlaka belirtin.</p>
    </section>
  </SellerCenterArticle>
);

export default FiyatlandirmaTeklifPage;
