import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const EntegrasyonlarPage = () => (
  <SellerCenterArticle
    title="Entegrasyonlar | ERP, Stok Senkronizasyonu ve CSV ile Katalog Aktarımı"
    description="Tedarika'da ürün kataloğu nasıl aktarılır? CSV/Excel şablonları, ERP/PIM entegrasyonu, stok-fiyat senkronizasyonu ve sipariş akışı rehberi."
    keywords="entegrasyon, ERP, CSV, katalog aktarımı, stok senkronizasyonu, toplu ürün yükleme"
    h1="Entegrasyonlar ve Katalog Aktarımı"
    subtitle="Manuel katalog yönetimi ölçeklenmez. Satıcı panelinde amaç; ürün verisini bir kez doğru kurup sürekli güncel tutmaktır."
    breadcrumbs={[{ name: "Entegrasyonlar", url: "/satici-merkezi/entegrasyonlar" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">CSV/Excel ile toplu ürün yükleme (en hızlı yöntem)</h2>
      <p className="text-gray-700 mb-2">Bu sayfada indirilebilir bir şablon öner:</p>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>SKU</li>
        <li>Ürün adı</li>
        <li>Kategori</li>
        <li>Varyant (renk/ölçü)</li>
        <li>MOQ</li>
        <li>Termin (min/max)</li>
        <li>Para birimi + fiyat</li>
        <li>Paketleme: koli içi adet, koli ölçüsü, ağırlık</li>
        <li>GTİP</li>
        <li>Belge linkleri (dosya adı veya URL)</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">ERP/PIM entegrasyonu ne zaman şart?</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>500+ SKU</li>
        <li>Sık fiyat güncellemesi</li>
        <li>Stok değişimi hızlı</li>
        <li>Çok kanallı satış var</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Sipariş senkronizasyonu</h2>
      <p className="text-gray-700">Siparişleri ERP'ye akıtmak istiyorsanız; sipariş durumu, kargo takip, fatura no gibi alanları standart hale getirin.</p>
    </section>
  </SellerCenterArticle>
);

export default EntegrasyonlarPage;
