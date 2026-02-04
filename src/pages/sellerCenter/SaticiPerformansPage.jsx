import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const SaticiPerformansPage = () => (
  <SellerCenterArticle
    title="Satıcı Performans Puanı | Arama Sıralaması ve Tekrar Siparişleri Artırın"
    description="Satıcı performansı nasıl ölçülür? Yanıt süresi, zamanında sevk, iptal oranı, uyuşmazlık oranı, içerik kalitesi ve müşteri memnuniyeti metrikleriyle büyüme rehberi."
    keywords="satıcı performansı, performans puanı, yanıt süresi, zamanında sevk, B2B büyüme"
    h1="Satıcı Performansı ve Büyüme"
    subtitle="B2B pazaryerinde görünürlük iki şeyle artar: güven ve tutarlılık. Performans metrikleri, alıcı deneyiminin sayısallaştırılmış halidir."
    breadcrumbs={[{ name: "Satıcı Performansı", url: "/satici-merkezi/satici-performans" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">En kritik metrikler</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Yanıt süresi: teklif hızını belirler</li>
        <li>Zamanında sevk: alıcı güvenini belirler</li>
        <li>İptal oranı: risk göstergesidir</li>
        <li>Uyuşmazlık oranı: ürün sayfası doğruluğunu gösterir</li>
        <li>İçerik kalitesi: arama ve dönüşümü etkiler</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Performansı artıran 10 pratik hamle</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Ürün başlık ve özellik şablonu standardize et</li>
        <li>MOQ ve terminleri gerçekçi yaz</li>
        <li>Mesaj şablonları oluştur (TR/EN)</li>
        <li>Paketleme standardını sabitle</li>
        <li>En çok satan 10 üründe teknik doküman ekle</li>
        <li>Kısmi sevk kurallarını baştan netleştir</li>
        <li>Takip numarasını geciktirme</li>
        <li>Üretim gecikmesini saklama, erken bildir</li>
        <li>Kalite kontrol fotoğraflarını arşivle</li>
        <li>Teklif geçerlilik süresini mutlaka yaz</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">B2B'de tekrar sipariş mekanizması</h2>
      <p className="text-gray-700">Alıcı tekrar sipariş veriyorsa “fiyat”tan çok “sürpriz çıkarmadığın” için verir. Bu yüzden operasyon kalitesi doğrudan büyüme motorudur.</p>
    </section>
  </SellerCenterArticle>
);

export default SaticiPerformansPage;
