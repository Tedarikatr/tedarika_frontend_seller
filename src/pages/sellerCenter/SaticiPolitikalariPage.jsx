import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const SaticiPolitikalariPage = () => (
  <SellerCenterArticle
    title="Satıcı Politikaları | Ürün Yayın Kuralları, Yasaklı Ürünler ve Kalite Standartları"
    description="Tedarika satıcı politikaları. Ürün yayın kuralları, yanlış beyan, sahte/kaçak ürün, fikri mülkiyet ihlali, yasaklı kategori örnekleri ve kalite standartları."
    keywords="satıcı politikaları, yayın kuralları, yasaklı ürün, kalite standartları, fikri mülkiyet"
    h1="Satıcı Politikaları ve İçerik Kuralları"
    subtitle="Bu sayfa “hukuki sözleşme” değildir; platform kalitesini ve alıcı güvenini korumak için operasyonel kuralların özetidir. Amaç: satıcıların mağaza kapanması, ilan reddi, uyuşmazlık ve itibar kaybı yaşamasını önlemek."
    breadcrumbs={[{ name: "Satıcı Politikaları", url: "/satici-merkezi/satici-politikalari" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Kesin kaçınılması gerekenler</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Yanlış beyan: malzeme, ölçü, menşe, sertifika konusunda abartı</li>
        <li>Sahte marka / replika / taklit ürün</li>
        <li>Fikri mülkiyet ihlali: lisanssız görsel, marka adıyla yanıltma</li>
        <li>Tehlikeli/izin gerektiren ürünleri “belgesiz” listeleme</li>
        <li>Yasaklı içerik: şiddet, nefret, yasa dışı ürünler</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Ürün yayın reddine neden olan tipik hatalar</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Başlıkta ana bilgi yok (sadece “kaliteli ürün” gibi)</li>
        <li>Fotoğraflar düşük kalite veya stok görsel</li>
        <li>MOQ/termin yok</li>
        <li>Paketleme ve ölçü yok</li>
        <li>Sertifika iddiası var, belge yok</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Kalite standardı yaklaşımı</h2>
      <p className="text-gray-700">Satıcı olarak en güçlü rekabet avantajınız; standardizasyon ve tutarlılıktır. Aynı ürün grubunda her ilanda aynı “teknik şablonu” kullanın.</p>
    </section>
  </SellerCenterArticle>
);

export default SaticiPolitikalariPage;
