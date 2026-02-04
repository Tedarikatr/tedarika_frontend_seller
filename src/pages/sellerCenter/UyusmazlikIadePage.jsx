import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const UyusmazlikIadePage = () => (
  <SellerCenterArticle
    title="Uyuşmazlık ve İade | B2B Siparişte Hasar, Eksik, Uygunsuzluk Süreçleri"
    description="B2B'de iade ve uyuşmazlık nasıl yönetilir? Hasar, eksik teslimat, ürün uygunsuzluğu durumlarında kanıt, süreler, çözüm akışı ve satıcı için risk azaltma rehberi."
    keywords="uyuşmazlık, iade, B2B iade, hasar, eksik teslimat, uygunsuzluk"
    h1="Uyuşmazlık ve İade Yönetimi"
    subtitle="B2B'de uyuşmazlık kaçınılmaz olabilir; önemli olan hızlı ve kanıta dayalı çözüm üretmektir. Bu sayfa, “duygu” yerine “kanıt” ile ilerleyen bir yönetim standardı kurar."
    breadcrumbs={[{ name: "Uyuşmazlık ve İade", url: "/satici-merkezi/uyusmazlik-iade" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">En yaygın uyuşmazlık türleri</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Hasarlı teslimat</li>
        <li>Eksik adet / yanlış ürün</li>
        <li>Ürün özelliklerinin uymaması (ölçü, malzeme, performans)</li>
        <li>Termin sapması</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Kanıt standardı (satıcıyı koruyan minimum set)</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Paketleme fotoğrafı (koli/palet)</li>
        <li>Etiket/lot fotoğrafı</li>
        <li>Tartım ve ölçü kanıtı (mümkünse)</li>
        <li>Sevk belgesi + takip kaydı</li>
        <li>Ürün sayfasındaki teknik özellik ekran görüntüsü (versiyon kontrol)</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Çözüm seçenekleri</h2>
      <p className="text-gray-700 mb-2">B2B'de tek çözüm “iade” değildir:</p>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Kısmi iade / bedel indirimi</li>
        <li>Yeniden sevk (eksik parça)</li>
        <li>Bir sonraki siparişe kredi</li>
      </ul>
      <p className="text-gray-700 mt-2">Önemli olan alıcıyla hızlı mutabakat.</p>
    </section>
  </SellerCenterArticle>
);

export default UyusmazlikIadePage;
