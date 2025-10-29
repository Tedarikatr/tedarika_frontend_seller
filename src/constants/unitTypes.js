// =============================
// unitTypes.js
// =============================
export const UNIT_TYPE_LABELS = {
  1: "Adet",
  2: "Ambalaj",
  3: "Bidon",
  4: "Çuval",
  5: "Düzine",
  6: "Galon",
  7: "Gram",
  8: "Gramaj",
  9: "Karat",
  10: "Kasa",
  11: "Kg",
  12: "Koli",
  13: "Litre",
  14: "Metre",
  15: "Metrekare",
  16: "Metreküp",
  17: "Mililitre",
  18: "Paket",
  19: "Palet",
  20: "Rulo",
  21: "Sandık",
  22: "Santimetre",
  23: "Şişe",
  24: "Tane",
  25: "Takım",
  26: "Ton",
};

// Listeyi select içinde kullanmak için dönüştürülmüş array
export const UNIT_TYPE_OPTIONS = Object.entries(UNIT_TYPE_LABELS).map(
  ([id, label]) => ({
    id: Number(id),
    label,
  })
);
