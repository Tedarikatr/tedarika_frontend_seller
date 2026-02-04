import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const MagazaDogrulamaPage = () => (
  <SellerCenterArticle
    title="Mağaza Doğrulama | Tedarika Satıcı Güven Seviyesi ve Profil Standartları"
    description="B2B alıcı güveni için mağaza doğrulama, profil bilgileri, üretim kapasitesi, sertifikalar ve iletişim standartları. Satıcı güven seviyenizi yükseltin."
    keywords="mağaza doğrulama, satıcı güven, B2B profil, alıcı güveni, satıcı standartları"
    h1="Mağaza Doğrulama ve Güven Seviyesi"
    subtitle="B2B alıcı, “ürün sayfası” kadar “satıcı kimliği” satın alır. Bu sayfa, mağazanızın güven seviyesini yükseltmek için gereken pratik standartları anlatır."
    breadcrumbs={[{ name: "Mağaza Doğrulama", url: "/satici-merkezi/magaza-dogrulama" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Alıcıların baktığı ilk sinyaller</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Şirket bilgisi tutarlılığı: isim, adres, web sitesi, vergi/oda kaydı gibi temel tutarlılık.</li>
        <li>Üretici mi, toptancı mı: rolünüz net olmalı.</li>
        <li>Kapasite ve termin gerçekçiliği: “her şeye yetişiriz” demek risk işaretidir.</li>
        <li>Referans ve sertifikalar: varsa yükleyin, yoksa vaat etmeyin.</li>
        <li>Hızlı ve net iletişim: gecikme, B2B'de güven kırar.</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Profil metni şablonu (kopyala‑yapıştır)</h2>
      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm">
        “[Şehir] merkezli [üretici/toptancı] bir firmayız. [Kategori] alanında [X] yıldır üretim yapıyoruz. Aylık kapasitemiz [aralık], standart terminimiz [aralık] gündür. Toptan satışta minimum sipariş yaklaşımımız [MOQ mantığı]. İhracatta çalıştığımız bölgeler: [AB/UK/MENA/ABD]. Ürünlerimiz için mevcut belgeler: [liste].”
      </p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Doğrulama sonrası dönüşüm etkisi</h2>
      <p className="text-gray-700">
        Doğrulama, arama sıralamasından çok dönüşümde fark yaratır: aynı fiyatta iki satıcı arasında alıcı “riski düşük olanı” seçer.
      </p>
    </section>
  </SellerCenterArticle>
);

export default MagazaDogrulamaPage;
