// =============================
// ProductPriceTiers.jsx (Modern, Emojisiz, Başlıklı Tablo)
// =============================
import React, { useEffect, useState } from "react";
import {
  getPriceTiers,
  upsertPriceTiers,
  deactivatePriceTier,
} from "@/api/sellerStoreProductPriceTiersService";
import { PlusCircle, Trash2, Save } from "lucide-react";

// Basit Input bileşeni
const Input = ({ type = "text", value, onChange, placeholder, className = "" }) => (
  <input
    type={type}
    value={value ?? ""}
    onChange={onChange}
    placeholder={placeholder}
    className={`border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${className}`}
  />
);

const ProductPriceTiers = ({ storeProductId, onFeedback }) => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fiyat merdivenlerini yükle
  useEffect(() => {
    loadTiers();
  }, [storeProductId]);

  const loadTiers = async () => {
    setLoading(true);
    try {
      const data = await getPriceTiers(storeProductId, "Domestic");
      setTiers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      onFeedback?.("Fiyat merdivenleri alınamadı!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Yeni satır ekle
  const handleAdd = () => {
    const now = new Date().toISOString();
    const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    setTiers((prev) => [
      ...prev,
      {
        id: null,
        storeProductId,
        channel: "Domestic",
        currencyCode: "TRY",
        minQty: 0,
        maxQty: 0,
        unitPrice: 0,
        vatIncluded: true,
        packMultiple: 1,
        incoterm: "EXW",
        leadTimeDays: 0,
        validFrom: now,
        validTo: weekLater,
        isActive: true,
      },
    ]);
  };

  // Satır sil
  const handleDelete = async (tier, idx) => {
    try {
      if (tier.id) {
        await deactivatePriceTier(storeProductId, tier.id);
        onFeedback?.("Fiyat merdiveni silindi.", "success");
      }
      setTiers((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      onFeedback?.("Silme işlemi başarısız!", "error");
      console.error(err);
    }
  };

  // Kaydet
  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertPriceTiers(storeProductId, tiers);
      onFeedback?.("Fiyat merdivenleri kaydedildi.", "success");
      await loadTiers();
    } catch (err) {
      console.error(err);
      onFeedback?.("Kaydetme hatası!", "error");
    } finally {
      setSaving(false);
    }
  };

  // Değer değişimi
  const handleChange = (idx, key, value) => {
    const updated = [...tiers];
    updated[idx][key] = value;
    setTiers(updated);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
      {/* Başlık */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-semibold text-gray-800">Fiyat Merdivenleri</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          <PlusCircle size={16} />
          Yeni Ekle
        </button>
      </div>

      {/* İçerik */}
      {loading ? (
        <p className="text-gray-500 text-sm italic">Yükleniyor...</p>
      ) : tiers.length === 0 ? (
        <p className="text-gray-400 text-sm">Henüz fiyat aralığı eklenmemiş.</p>
      ) : (
        <>
          {/* Sütun Başlıkları */}
          <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-semibold text-gray-600 uppercase">
            <div className="col-span-2">Min Adet</div>
            <div className="col-span-2">Max Adet</div>
            <div className="col-span-2">Birim Fiyat (₺)</div>
            <div className="col-span-2">Teslim Süresi (gün)</div>
            <div className="col-span-2 text-center">KDV Dahil</div>
            <div className="col-span-2 text-right">Sil</div>
          </div>

          {/* Satırlar */}
          <div className="space-y-3">
            {tiers.map((t, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-300 transition"
              >
                <Input
                  type="number"
                  value={t.minQty}
                  onChange={(e) => handleChange(i, "minQty", Number(e.target.value))}
                  placeholder="Min"
                  className="col-span-2"
                />
                <Input
                  type="number"
                  value={t.maxQty}
                  onChange={(e) => handleChange(i, "maxQty", Number(e.target.value))}
                  placeholder="Max"
                  className="col-span-2"
                />
                <Input
                  type="number"
                  value={t.unitPrice}
                  onChange={(e) => handleChange(i, "unitPrice", Number(e.target.value))}
                  placeholder="₺ Fiyat"
                  className="col-span-2"
                />
                <Input
                  type="number"
                  value={t.leadTimeDays}
                  onChange={(e) => handleChange(i, "leadTimeDays", Number(e.target.value))}
                  placeholder="Teslim"
                  className="col-span-2"
                />
                <div className="col-span-2 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={t.vatIncluded}
                    onChange={(e) => handleChange(i, "vatIncluded", e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(t, i)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Kaydet Butonu */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm"
        >
          <Save size={16} />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default ProductPriceTiers;
