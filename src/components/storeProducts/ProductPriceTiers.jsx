// =============================
// ProductPriceTiers.jsx (Para Birimi Bazlı)
// =============================
import React, { useEffect, useState } from "react";
import {
  getPriceTiers,
  upsertPriceTiers,
  deactivatePriceTier,
} from "@/api/sellerStoreProductPriceTiersService";
import { PlusCircle, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import { CURRENCY_CODES } from "@/constants/currencyCode";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

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

const ProductPriceTiers = ({ storeProductId, productPrices = [], onFeedback }) => {
  const [selectedPriceId, setSelectedPriceId] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Para birimi seçildiğinde fiyat merdivenlerini yükle
  useEffect(() => {
    if (selectedPriceId) {
      loadTiers();
    }
  }, [selectedPriceId]);

  const loadTiers = async () => {
    setLoading(true);
    try {
      const data = await getPriceTiers(storeProductId, selectedPriceId);
      setTiers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      onFeedback?.("Fiyat merdivenleri alınamadı!", "error");
      setTiers([]);
    } finally {
      setLoading(false);
    }
  };

  // Yeni satır ekle (max 4)
  const handleAdd = () => {
    if (tiers.length >= 4) {
      onFeedback?.("Maksimum 4 fiyat merdiveni ekleyebilirsiniz!", "error");
      return;
    }
    
    const now = new Date().toISOString();
    const sixMonthsLater = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
    setTiers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        storeProductPriceId: selectedPriceId,
        minQty: 0,
        maxQty: null,
        unitPrice: 0,
        validFrom: now,
        validTo: sixMonthsLater,
        isActive: true,
      },
    ]);
  };

  // Satır sil
  const handleDelete = async (tier, idx) => {
    try {
      if (tier.id && tiers.find(t => t.id === tier.id && t.storeProductPriceId)) {
        await deactivatePriceTier(storeProductId, selectedPriceId, tier.id);
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
    if (tiers.length > 4) {
      onFeedback?.("En fazla 4 fiyat merdiveni ekleyebilirsiniz!", "error");
      return;
    }
    
    setSaving(true);
    try {
      await upsertPriceTiers(storeProductId, selectedPriceId, tiers);
      onFeedback?.("Fiyat merdivenleri kaydedildi.", "success");
      await loadTiers();
    } catch (err) {
      console.error(err);
      onFeedback?.(err?.response?.data?.message || "Kaydetme hatası!", "error");
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

  const handlePriceSelect = (price) => {
    setSelectedPriceId(price.id);
    setSelectedCurrency(price.currencyCode);
    setExpanded(true);
  };

  const currencySymbol = selectedCurrency ? CURRENCY_CODES[selectedCurrency]?.symbol || selectedCurrency : "";

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
      {/* Başlık */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800">Fiyat Merdivenleri</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 hover:text-gray-800"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <>
          {/* Para Birimi Seçimi */}
          {productPrices.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Önce bir para birimi fiyatı eklemelisiniz.
            </p>
          ) : (
            <>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Para Birimi Seçin:
                </label>
                <div className="flex flex-wrap gap-2">
                  {productPrices.map((price) => (
                    <button
                      key={price.id}
                      onClick={() => handlePriceSelect(price)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        selectedPriceId === price.id
                          ? "bg-emerald-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {price.currencyCode} ({CURRENCY_CODES[price.currencyCode]?.symbol || price.currencyCode})
                    </button>
                  ))}
                </div>
              </div>

              {/* Fiyat Merdivenleri */}
              {selectedPriceId && (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600">
                      {selectedCurrency} için fiyat merdivenleri ({tiers.length}/4)
                    </p>
                    <button
                      onClick={handleAdd}
                      disabled={tiers.length >= 4}
                      className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlusCircle size={16} />
                      Yeni Ekle
                    </button>
                  </div>

                  {/* İçerik */}
                  {loading ? (
                    <div className="py-2">
                      <TedarikaLoader variant="inline" />
                    </div>
                  ) : tiers.length === 0 ? (
                    <p className="text-gray-400 text-sm">Henüz fiyat aralığı eklenmemiş.</p>
                  ) : (
                    <>
                      {/* Sütun Başlıkları */}
                      <div className="grid grid-cols-10 gap-2 mb-2 text-xs font-semibold text-gray-600 uppercase">
                        <div className="col-span-2">Min Adet</div>
                        <div className="col-span-2">Max Adet</div>
                        <div className="col-span-2">Birim Fiyat</div>
                        <div className="col-span-2">Geçerlilik Başlangıç</div>
                        <div className="col-span-1">Aktif</div>
                        <div className="col-span-1 text-right">Sil</div>
                      </div>

                      {/* Satırlar */}
                      <div className="space-y-3">
                        {tiers.map((t, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-10 gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-300 transition"
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
                              value={t.maxQty || ""}
                              onChange={(e) => handleChange(i, "maxQty", e.target.value ? Number(e.target.value) : null)}
                              placeholder="Max (opsiyonel)"
                              className="col-span-2"
                            />
                            <div className="col-span-2 relative">
                              <Input
                                type="number"
                                step="0.01"
                                value={t.unitPrice}
                                onChange={(e) => handleChange(i, "unitPrice", Number(e.target.value))}
                                placeholder="0.00"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                                {currencySymbol}
                              </span>
                            </div>
                            <Input
                              type="date"
                              value={t.validFrom?.split('T')[0] || ""}
                              onChange={(e) => handleChange(i, "validFrom", new Date(e.target.value).toISOString())}
                              className="col-span-2"
                            />
                            <div className="col-span-1 flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={t.isActive}
                                onChange={(e) => handleChange(i, "isActive", e.target.checked)}
                                className="w-4 h-4 accent-emerald-600"
                              />
                            </div>
                            <div className="col-span-1 flex justify-end">
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
                      disabled={saving || tiers.length === 0}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} />
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPriceTiers;
