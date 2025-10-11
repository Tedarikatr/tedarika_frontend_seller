// src/components/seller/campaignWizard/StepCriteria.jsx
import React from "react";

export default function StepCriteria({ data, setData, next, prev }) {
  const c = data.criteria;
  const set = (k, v) => setData((p) => ({ ...p, criteria: { ...p.criteria, [k]: v } }));

  const addAdvanced = () => {
    set("advancedCriterias", [
      ...c.advancedCriterias,
      {
        id: crypto.randomUUID(),
        minRequiredQuantity: 0,
        chargedQuantity: 0,
        nthItemIndex: 0,
        criteriaAmountOff: 0,
        criteriaPercentOff: 0,
        appliesPerLine: true,
      },
    ]);
  };

  const updateAdvanced = (idx, k, v) => {
    const nextArr = [...c.advancedCriterias];
    nextArr[idx] = { ...nextArr[idx], [k]: v };
    set("advancedCriterias", nextArr);
  };

  const removeAdvanced = (idx) => {
    const nextArr = c.advancedCriterias.filter((_, i) => i !== idx);
    set("advancedCriterias", nextArr);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-8">
        Kampanya Kriterleri
      </h2>

      {/* Temel Kriterler */}
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-200">
        <div className="grid md:grid-cols-3 gap-6">
          <InputField
            label="Tutar İndirimi (TL)"
            type="number"
            value={c.amountOff}
            onChange={(e) => set("amountOff", Number(e.target.value))}
          />
          <InputField
            label="% İndirim"
            type="number"
            value={c.percentOff}
            onChange={(e) => set("percentOff", Number(e.target.value))}
          />
          <InputField
            label="Para Birimi"
            value={c.currency}
            onChange={(e) => set("currency", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Sipariş Başına Tekrar Limiti"
            type="number"
            value={c.perOrderRepeatLimit}
            onChange={(e) => set("perOrderRepeatLimit", Number(e.target.value))}
          />
          <InputField
            label="Toplam Kullanım Limiti"
            type="number"
            value={c.totalOrderUsageLimit}
            onChange={(e) => set("totalOrderUsageLimit", Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 pt-4">
          <Toggle
            label="Sadece Premium Müşterilere Özel"
            checked={c.premiumOnly}
            onChange={(v) => set("premiumOnly", v)}
          />
          <Toggle
            label="Müşteri Başına Bir Kez Kullanılsın"
            checked={c.perCustomerOnce}
            onChange={(v) => set("perCustomerOnce", v)}
          />
        </div>
      </div>

      {/* Gelişmiş Kriterler */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-6 mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Gelişmiş Kriterler</h3>
          <button
            onClick={addAdvanced}
            className="text-sm px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
          >
            + Yeni Satır
          </button>
        </div>

        {c.advancedCriterias.length === 0 ? (
          <p className="text-gray-500 text-sm border-t pt-4">
            Henüz gelişmiş kriter eklenmedi.
          </p>
        ) : (
          <div className="space-y-4">
            {c.advancedCriterias.map((row, idx) => (
              <div
                key={row.id}
                className="grid md:grid-cols-6 gap-4 border border-gray-200 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <InputSmall
                  label="Min Miktar"
                  type="number"
                  value={row.minRequiredQuantity}
                  onChange={(e) =>
                    updateAdvanced(idx, "minRequiredQuantity", Number(e.target.value))
                  }
                />
                <InputSmall
                  label="Ücretli Miktar"
                  type="number"
                  value={row.chargedQuantity}
                  onChange={(e) =>
                    updateAdvanced(idx, "chargedQuantity", Number(e.target.value))
                  }
                />
                <InputSmall
                  label="Nth Index"
                  type="number"
                  value={row.nthItemIndex}
                  onChange={(e) =>
                    updateAdvanced(idx, "nthItemIndex", Number(e.target.value))
                  }
                />
                <InputSmall
                  label="TL İndirim"
                  type="number"
                  value={row.criteriaAmountOff}
                  onChange={(e) =>
                    updateAdvanced(idx, "criteriaAmountOff", Number(e.target.value))
                  }
                />
                <InputSmall
                  label="% İndirim"
                  type="number"
                  value={row.criteriaPercentOff}
                  onChange={(e) =>
                    updateAdvanced(idx, "criteriaPercentOff", Number(e.target.value))
                  }
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={row.appliesPerLine}
                      onChange={(e) =>
                        updateAdvanced(idx, "appliesPerLine", e.target.checked)
                      }
                      className="accent-orange-500"
                    />
                    Satır Bazlı
                  </label>
                  <button
                    onClick={() => removeAdvanced(idx)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigasyon Butonları */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          className="border border-gray-300 px-8 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Geri
        </button>
        <button
          onClick={next}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}

/* 🔧 Alt bileşenler */

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
    />
  </div>
);

const InputSmall = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-600 mb-1">{label}</label>
    <input
      {...props}
      className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
    />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 text-sm font-medium text-gray-800">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 accent-orange-500"
    />
    {label}
  </label>
);
