import React from "react";

export default function StepPreview({ data, prev, submit }) {
  if (!data) return null;

  const { basics = {}, targeting = {}, criteria = {} } = data;

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-10 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
        Kampanya Önizleme ve Onay
      </h2>

      <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-6 flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold">
              {basics.name || "İsimsiz Kampanya"}
            </h3>
            <p className="text-sm opacity-90 mt-1">
              {kindMap[basics.kind] || "Tür Belirtilmemiş"}
            </p>
          </div>
          <StatusBadge status={basics.status} />
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-10 text-gray-800">
          {/* TEMEL BİLGİLER */}
          <Section title="Temel Bilgiler">
            <Grid>
              <Info label="Başlangıç Tarihi" value={formatDate(basics.startsAt)} />
              <Info label="Bitiş Tarihi" value={formatDate(basics.endsAt)} />
              <Info label="Öncelik" value={basics.priority ?? "-"} />
              <Info
                label="Kupon Gerektiriyor mu?"
                value={basics.requiresCoupon ? "Evet" : "Hayır"}
              />
              {basics.requiresCoupon && (
                <Info label="Kupon Kodu" value={basics.couponCode || "-"} />
              )}
              <Info label="Durum" value={<StatusBadge status={basics.status} />} />
            </Grid>
          </Section>

          {/* HEDEFLEME */}
          <Section title="Hedefleme">
            <Grid>
              <Info label="Kapsam" value={scopeMap[targeting.scope] || "-"} />
              <Info
                label="Seçili Hedef Sayısı"
                value={targeting.items?.length || 0}
              />
            </Grid>

            {targeting.items?.length > 0 ? (
              <div className="mt-4 overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Ürün ID</th>
                      <th className="px-4 py-2 text-left">Kategori ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {targeting.items.map((i, idx) => (
                      <tr
                        key={i.id || idx}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{idx + 1}</td>
                        <td className="px-4 py-2">{i.productId || "-"}</td>
                        <td className="px-4 py-2">{i.categoryId || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic mt-3">
                Belirli bir hedefleme yok.
              </p>
            )}
          </Section>

          {/* İNDİRİM KRİTERLERİ */}
          <Section title="İndirim Kriterleri">
            <Grid>
              <Info label="İndirim Tutarı (TL)" value={criteria.amountOff || "-"} />
              <Info label="İndirim Yüzdesi (%)" value={criteria.percentOff || "-"} />
              <Info label="Para Birimi" value={criteria.currency || "-"} />
              <Info
                label="Sipariş Tekrar Limiti"
                value={criteria.perOrderRepeatLimit ?? "-"}
              />
              <Info
                label="Toplam Kullanım Limiti"
                value={criteria.totalOrderUsageLimit ?? "-"}
              />
              <Info
                label="Sadece Premium Kullanıcılara"
                value={criteria.premiumOnly ? "Evet" : "Hayır"}
              />
              <Info
                label="Müşteri Başına Tek Kullanım"
                value={criteria.perCustomerOnce ? "Evet" : "Hayır"}
              />
            </Grid>
          </Section>

          {/* GELİŞMİŞ KRİTERLER */}
          {criteria.advancedCriterias?.length > 0 && (
            <Section title="Gelişmiş Kriterler">
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="px-4 py-2 text-left">Min Miktar</th>
                      <th className="px-4 py-2 text-left">Ücretli Miktar</th>
                      <th className="px-4 py-2 text-left">Nth Index</th>
                      <th className="px-4 py-2 text-left">TL İndirim</th>
                      <th className="px-4 py-2 text-left">% İndirim</th>
                      <th className="px-4 py-2 text-left">Satır Bazlı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.advancedCriterias.map((r, idx) => (
                      <tr
                        key={r.id || idx}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{r.minRequiredQuantity}</td>
                        <td className="px-4 py-2">{r.chargedQuantity}</td>
                        <td className="px-4 py-2">{r.nthItemIndex}</td>
                        <td className="px-4 py-2">{r.criteriaAmountOff}</td>
                        <td className="px-4 py-2">{r.criteriaPercentOff}</td>
                        <td className="px-4 py-2">
                          {r.appliesPerLine ? "Evet" : "Hayır"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-10">
        <button
          onClick={prev}
          className="border border-gray-300 px-8 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Geri
        </button>
        <button
          onClick={submit}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition"
        >
          Kampanyayı Onayla
        </button>
      </div>
    </div>
  );
}

/* 🧩 Alt bileşenler */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
  </div>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-3 gap-6">{children}</div>
);

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-orange-500 pl-3">
      {title}
    </h3>
    <div className="text-sm">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colorMap = {
    Draft: "bg-gray-200 text-gray-700",
    Active: "bg-green-100 text-green-700",
    Paused: "bg-yellow-100 text-yellow-700",
    Ended: "bg-red-100 text-red-700",
  };
  const textMap = {
    Draft: "Taslak",
    Active: "Aktif",
    Paused: "Durduruldu",
    Ended: "Bitti",
  };
  return (
    <span
      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
        colorMap[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {textMap[status] || "Bilinmiyor"}
    </span>
  );
};

/* 🧮 Yardımcılar */
const kindMap = {
  BasketAmountOff: "Sepet Tutar İndirimi",
  BasketPercentOff: "Sepet Yüzde İndirimi",
  ProductPercentOff: "Ürün Bazlı İndirim",
};

const scopeMap = {
  AllProducts: "Tüm Ürünler",
  SpecificProducts: "Belirli Ürünler",
  Categories: "Belirli Kategoriler",
};

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";
