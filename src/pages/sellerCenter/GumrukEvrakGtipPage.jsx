import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const GumrukEvrakGtipPage = () => (
  <SellerCenterArticle
    title="Gümrük Evrakları | Ticari Fatura, Packing List, Menşe ve GTİP Rehberi"
    description="E‑ihracatta gümrük evrakları nasıl hazırlanır? Ticari fatura, packing list, menşe, GTİP kodu, sertifikalar ve belge yükleme standartları."
    keywords="gümrük evrak, ticari fatura, packing list, GTİP, menşe, e-ihracat evrak"
    h1="Gümrük ve Evrak Yönetimi"
    subtitle="Sınır ötesi ticarette ürününüzün kaderini çoğu zaman evrak belirler. Bu rehber, sahada en çok hata yapılan noktaları düzeltmek için hazırlanmıştır."
    breadcrumbs={[{ name: "Gümrük ve Evrak", url: "/satici-merkezi/gumruk-evrak-gtip" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Ticari fatura (Commercial Invoice) temel alanları</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Satıcı ve alıcı bilgileri (ünvan/adres)</li>
        <li>Fatura no ve tarih</li>
        <li>Ürün adı (net ve teknik), miktar, birim fiyat, toplam</li>
        <li>Para birimi</li>
        <li>GTİP kodu</li>
        <li>Menşe ülke</li>
        <li>Teslim şekli (Incoterms)</li>
        <li>Paket sayısı, brüt/net ağırlık (packing list ile tutarlı)</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Packing List temel alanları</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Koli/palet adedi</li>
        <li>Koli ölçüleri</li>
        <li>Brüt/net ağırlık</li>
        <li>Koli içi adet</li>
        <li>Ürün kodu/lot</li>
      </ul>
      <p className="text-gray-700 mt-2">Packing list ile fatura çelişirse gümrükte gecikme çıkar.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">GTİP kodu: neden bu kadar kritik?</h2>
      <p className="text-gray-700 mb-2">GTİP, gümrüğün ürünü sınıflandırma dilidir. Yanlış GTİP; yanlış vergi, yanlış belge, hatta el koyma riskine kadar gider.</p>
      <p className="text-gray-700">Pratik öneri: GTİP'i “ürün adıyla tahmin” etmeyin; teknik tanımı ve kullanımını netleştirerek bulun.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Belge havuzu (kategoriye göre)</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>CE / uygunluk beyanı (ilgili ürünlerde)</li>
        <li>MSDS (kimyasal içerikli ürünlerde)</li>
        <li>Test raporları (talep edilen kategorilerde)</li>
        <li>Menşe belgeleri (gerektiğinde)</li>
      </ul>
      <p className="text-gray-700 mt-2">Bu sayfada amaç “hangi belge nerede lazım” mantığını kurmak; resmi danışmanlık gerektiren durumlarda uzman desteği alın.</p>
    </section>
  </SellerCenterArticle>
);

export default GumrukEvrakGtipPage;
