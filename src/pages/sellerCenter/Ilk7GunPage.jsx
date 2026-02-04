import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const Ilk7GunPage = () => (
  <SellerCenterArticle
    title="İlk 7 Gün Planı | Tedarika'da Satışa Hazır Satıcı Olma"
    description="Tedarika'da mağazanızı 7 günde satışa hazırlayın. Profil, doğrulama, ürün kataloğu, MOQ-termin, lojistik şablonu, belge yükleme ve ilk teklif alma adımları."
    keywords="ilk 7 gün, satıcı onboarding, mağaza kurulumu, B2B başlangıç, tedarika rehberi"
    h1="İlk 7 Günde Satışa Hazır Olun"
    subtitle="B2B pazaryerinde hızlı büyüme “hızlı listeleme” ile değil, doğru operasyon kurulumu ile gelir. Aşağıdaki plan, mağazanızı alıcıların güvenle sipariş vereceği seviyeye getirir."
    breadcrumbs={[{ name: "İlk 7 Gün Planı", url: "/satici-merkezi/ilk-7-gun" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Gün 1 | Mağaza kimliği</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Mağaza adı, üretim kapasitesi, minimum sipariş yaklaşımı, teslimat bölgeleri.</li>
        <li>“Biz kimiz” metni: üretici misiniz, toptancı mısınız, hangi sektörlerde derinsiniz?</li>
        <li>Ürün kategorisi seçimi: ilk etapta 1–2 kategori ile derinleşin, dağılmayın.</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Gün 2 | Doğrulama ve ödeme ayarları</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>İşletme bilgileri ve yetkili kişi tanımı (alıcı güveni için).</li>
        <li>Tahsilat hesabı tanımlama (banka/ödeme kuruluşu).</li>
        <li>Para birimi ve fiyatlandırma stratejisi: TRY + EUR/USD seçenekleri (hedef pazara göre).</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Gün 3 | “Satılabilir” ürün kataloğu</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>İlk hedef: 20–50 ürün değil, “10 iyi ürün sayfası”.</li>
        <li>Her üründe zorunlu: net başlık, teknik özellik, MOQ, termin, paket ölçüleri, fotoğraf seti.</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Gün 4 | GTİP ve belge hazırlığı</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>GTİP doğru değilse evrak ve gümrük tarafı hata verir.</li>
        <li>Ürün grubunuza göre belge havuzu oluşturun: test raporu, sertifika, MSDS (gerekiyorsa), menşe bilgisi.</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Gün 5 | Lojistik şablonu</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Teslim şekli (Incoterms) seçimi: DAP/DDP gibi net bir varsayılan belirleyin.</li>
        <li>Paketleme standardı: koli içi adet, palet ölçüsü, kırılabilir uyarıları.</li>
        <li>Kargo/forwarder opsiyonları: hızlı teklif için en az 2 alternatif.</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Gün 6 | Teklif alma ve yanıt süresi</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Mesaj şablonları hazırlayın (İngilizce dahil).</li>
        <li>RFQ/teklif taleplerinde hedef yanıt süresi: aynı gün.</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Gün 7 | Kontrol ve yayın</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>10 ürün sayfasını “alıcı gözüyle” kontrol edin.</li>
        <li>1 ürününüzü “örnek sipariş” gibi düşünerek uçtan uca test edin: fiyat, termin, paketleme, evrak.</li>
      </ul>
    </section>
  </SellerCenterArticle>
);

export default Ilk7GunPage;
