import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const MarkaKorumasiPage = () => (
  <SellerCenterArticle
    title="Marka Koruması | Taklit Ürün, İhlal Bildirimi ve Delil Standardı"
    description="Marka sahipleri ve satıcılar için koruma rehberi. Taklit ürün bildirimi, fikri mülkiyet ihlali, delil standardı ve kaldırma süreci."
    keywords="marka koruması, taklit ürün, ihlal bildirimi, fikri mülkiyet, delil standardı"
    h1="Marka Koruması ve İhlal Yönetimi"
    subtitle="B2B pazaryerinde taklit ürün, sadece marka sahibine değil tüm ekosisteme zarar verir: ödeme riskleri artar, ülke bazlı yaptırımlar doğar, platformun itibarı düşer."
    breadcrumbs={[{ name: "Marka Koruması", url: "/satici-merkezi/marka-korumasi" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Satıcılar için güvenli kullanım kuralları</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Marka adı kullanıyorsanız yetkinizi ispatlayabilmelisiniz (distribütörlük, lisans vb.)</li>
        <li>“Uyumlu” kelimesini kötüye kullanmayın (yanıltıcı olabilir)</li>
        <li>Ürün görselleri size ait olmalı veya kullanım hakkınız olmalı</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">İhlal bildirimi yapılınca ne olur?</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>İlan geçici askıya alınabilir</li>
        <li>Satıcıdan belge/delil istenebilir</li>
        <li>Tekrarlayan ihlallerde mağaza kısıtlanabilir</li>
      </ul>
      <p className="text-gray-700 mt-2">Bu maddeleri net yazmak, hem iyi satıcıyı korur hem kötü aktörü caydırır.</p>
    </section>
  </SellerCenterArticle>
);

export default MarkaKorumasiPage;
