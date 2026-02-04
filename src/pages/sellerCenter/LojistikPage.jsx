import React from "react";
import SellerCenterArticle from "./SellerCenterArticle";

const LojistikPage = () => (
  <SellerCenterArticle
    title="Lojistik Rehberi | Incoterms, Paketleme ve Teslimat Yönetimi"
    description="B2B e‑ihracatta lojistik nasıl planlanır? Incoterms (EXW, FOB, DAP, DDP), paketleme standartları, sigorta, takip ve teslimat risk yönetimi."
    keywords="lojistik, Incoterms, DAP, DDP, FOB, paketleme, teslimat, B2B lojistik"
    h1="Lojistik Rehberi"
    subtitle="Lojistik, B2B'de “maliyet kalemi” değil, müşteri deneyimidir. En iyi ürün bile kötü paketleme ve belirsiz teslimatla kaybeder."
    breadcrumbs={[{ name: "Lojistik", url: "/satici-merkezi/lojistik" }]}
  >
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Incoterms'i basit düşünme yöntemi</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>EXW: alıcı her şeyi alır (satıcı riski düşük, alıcı için zor)</li>
        <li>FOB/CIF: deniz ağırlıklı senaryolarda klasik</li>
        <li>DAP: alıcı vergiyi öder, teslim adresine gelir</li>
        <li>DDP: alıcı için en kolay, satıcı için en riskli (vergi/ithalat süreçleri)</li>
      </ul>
      <p className="text-gray-700 mt-2">Satıcı olarak bir “varsayılan” belirleyin. B2B'de belirsizlik satışı öldürür.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Paketleme standardı (minimum)</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Ürün iç ambalajı (darbeden koruma)</li>
        <li>Koli standardı (etiket, lot, yön oku)</li>
        <li>Palet standardı (streç, köşebent, palet etiketi)</li>
        <li>Kırılabilir/nem uyarıları (gerekiyorsa)</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Takip ve teslimat kanıtı</h2>
      <p className="text-gray-700">Takip numarası ve teslim kanıtı; hem tahsilat hem uyuşmazlık süreçlerinde kritik delildir.</p>
    </section>
  </SellerCenterArticle>
);

export default LojistikPage;
