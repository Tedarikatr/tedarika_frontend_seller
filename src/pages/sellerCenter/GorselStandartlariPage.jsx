import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const GorselStandartlariPage = () => (
  <SellerCenterArticle
    title="Ürün Görsel Standartları | Tedarika Satıcı Fotoğraf ve Video Kılavuzu"
    description="B2B ürün fotoğrafı nasıl çekilir? Arka plan, açı, detay, paketleme fotoğrafları, teknik çizim ve video standartları. Daha yüksek dönüşüm için medya rehberi."
    keywords="ürün fotoğrafı, B2B görsel, ürün görsel standartları, paketleme fotoğrafı, teknik çizim, satıcı medya"
    h1="Ürün Görsel Standartları"
    subtitle="B2B alıcı fotoğrafı “estetik” için değil, risk azaltmak için inceler. Eksik fotoğraf, “beklediğim ürün gelmez” endişesi üretir."
    breadcrumbs={[{ name: "Görsel Standartları", url: "/satici-merkezi/gorsel-standartlari" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Minimum fotoğraf seti (önerilen 7 kare)</h2>
      <ol className="list-decimal list-inside space-y-1 text-gray-700">
        <li>Ana ürün (temiz arka plan)</li>
        <li>45 derece açı (hacim ve form)</li>
        <li>Yakın detay (malzeme/işçilik)</li>
        <li>Ölçü referansı (ölçü şeridi veya teknik çizim)</li>
        <li>Kullanım senaryosu (ürünün çalışırken hali)</li>
        <li>Paketleme (koli/palet görünümü)</li>
        <li>Etiket/barkod/lot bilgisi (varsa)</li>
      </ol>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Teknik dokümanlar</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Teknik çizim (PDF), montaj kılavuzu, kullanım kılavuzu</li>
        <li>Test raporu/sertifika (varsa)</li>
      </ul>
      <p className="text-gray-700 mt-2">Bunlar alıcının satın alma onay süresini kısaltır.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Video (opsiyonel ama güçlü)</h2>
      <p className="text-gray-700">30–60 saniyelik kısa video: ürünün “ne yaptığı” ve “nasıl paketlendiği”.</p>
    </section>
  </SellerCenterArticle>
);

export default GorselStandartlariPage;
