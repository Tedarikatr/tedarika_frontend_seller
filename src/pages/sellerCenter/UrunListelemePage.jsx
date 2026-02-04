import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const UrunListelemePage = () => (
  <SellerCenterArticle
    title="Ürün Listeleme Rehberi | B2B Toptan Ürün Sayfası Nasıl Hazırlanır?"
    description="B2B pazaryerinde ürün listeleme standartları. Başlık, açıklama, teknik özellik, varyant, MOQ, termin, paketleme, GTİP, belge ve görsel kuralları."
    keywords="ürün listeleme, B2B ürün sayfası, MOQ, termin, GTİP, toptan ürün, listeleme standartları"
    h1="B2B Ürün Listeleme Standartları"
    subtitle="B2B'de ürün sayfası “pazarlama metni” değil, satın alma dokümanıdır. Alıcı; ölçü, malzeme, sertifika, MOQ, teslim şekli ve termin net değilse teklif istemeden çıkar."
    breadcrumbs={[{ name: "Ürün Listeleme", url: "/satici-merkezi/urun-listeleme" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Zorunlu alanlar (minimum “satılabilir” seviye)</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Ürün adı: kategoriyi + ayırt edici özelliği taşımalı.</li>
        <li>Kısa özet: 2–3 cümlede kullanım ve avantaj.</li>
        <li>Teknik özellikler: ölçü, ağırlık, malzeme, kapasite, tolerans, kalite standardı.</li>
        <li>MOQ ve fiyatlandırma mantığı: “adet bazlı” mı “koli/palet bazlı” mı?</li>
        <li>Termin: üretim ve hazırlık süresi aralığı.</li>
        <li>Paketleme: koli içi adet, koli ölçüsü, brüt/net ağırlık.</li>
        <li>GTİP: doğru sınıflandırma.</li>
        <li>Belgeler: varsa yüklenmiş ve güncel olmalı.</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">B2B başlık formülü (SEO + arama içi sıralama)</h2>
      <p className="text-gray-700 mb-2">
        “Ürün türü + malzeme + kullanım alanı + ölçü/kapasite + kalite standardı (varsa) + menşe (opsiyonel)”
      </p>
      <p className="text-gray-600 italic">Örnek: “Paslanmaz Çelik Endüstriyel Raf Sistemi 200x60x200 cm, 304 Kalite”</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Açıklama yapısı (alıcıyı ikna eden sıra)</h2>
      <ol className="list-decimal list-inside space-y-1 text-gray-700">
        <li>Kullanım senaryosu: kim, nerede kullanır?</li>
        <li>Teknik özet: 5–8 madde ile ana özellikler</li>
        <li>Özelleştirme: renk, ölçü, logo, paketleme, private label</li>
        <li>MOQ ve termin mantığı: “MOQ = 1 palet, termin = 7–12 gün” gibi</li>
        <li>Kalite/denetim: kontrol süreci, test raporu varsa link/dosya</li>
        <li>Teslimat: varsayılan teslim şekli ve hazırlık</li>
      </ol>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Varyant yönetimi</h2>
      <p className="text-gray-700 mb-2">Varyantı “katalog şişirmek” için değil, alıcı kararını hızlandırmak için kullanın.</p>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Renk/ölçü/kapasite gibi net varyantlar ayrı seçenek olsun.</li>
        <li>Her varyantta paketleme ve ağırlık değişiyorsa ayrı girin (lojistik hesapları bozulmasın).</li>
      </ul>
    </section>
  </SellerCenterArticle>
);

export default UrunListelemePage;
