import React from "react";

export default function StepCampaignInfo({ data, setData, next, metadata }) {
  const b = data.basics;
  const set = (k, v) =>
    setData((p) => ({ ...p, basics: { ...p.basics, [k]: v } }));

  return (
    <div className="w-full space-y-10 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Kampanya Bilgileri
        </h2>
        <p className="text-gray-500 text-sm">
          Kampanyanın temel bilgilerini aşağıdaki alanlardan doldurun.
        </p>
      </div>

      {/* Form Alanları */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Ad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kampanya Adı
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
            placeholder="Örn: Sepette %10 İndirim"
            value={b.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        {/* Tür */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kampanya Türü
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
            value={b.kind}
            onChange={(e) => set("kind", e.target.value)}
          >
            <option value="">Seçiniz</option>
            {metadata.campaignKinds.map((k) => (
              <option key={k.value} value={k.name}>
                {k.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Durum */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Durum
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
            value={b.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {metadata.campaignStatuses.map((s) => (
              <option key={s.value} value={s.name}>
                {s.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Öncelik */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Öncelik
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
            value={b.priority}
            onChange={(e) => set("priority", Number(e.target.value))}
          />
        </div>

        {/* Tarihler */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Başlangıç Tarihi
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
            onChange={(e) =>
              set("startsAt", new Date(e.target.value).toISOString())
            }
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Bitiş Tarihi
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
            onChange={(e) =>
              set("endsAt", new Date(e.target.value).toISOString())
            }
          />
        </div>
      </div>

      {/* Kupon Alanı */}
      <div className="pt-4 space-y-3">
        <label className="flex items-center gap-3 text-gray-800 font-medium">
          <input
            type="checkbox"
            checked={b.requiresCoupon}
            onChange={(e) => set("requiresCoupon", e.target.checked)}
            className="w-4 h-4 accent-orange-500"
          />
          Kupon Kodu ile Kullanılsın
        </label>

        {b.requiresCoupon && (
          <input
            type="text"
            placeholder="Örn: INDIRIM2025"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
            value={b.couponCode}
            onChange={(e) => set("couponCode", e.target.value)}
          />
        )}
      </div>

      {/* Devam Butonu */}
      <div className="flex justify-end mt-8">
        <button
          onClick={next}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}
