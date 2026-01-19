/**
 * Kargo Şirketleri Enum
 * Backend CarrierCompany enum'una uyumlu
 */

export const CARRIER_COMPANIES = {
  Yurtiçi: "Yurtiçi",
  Aras: "Aras",
  Mng: "Mng",
  Sürat: "Sürat",
  Ptt: "Ptt",
  
  HepsiJet: "HepsiJet",
  TrendyolExpress: "TrendyolExpress",
  KolayGelsin: "KolayGelsin",
  Kargoist: "Kargoist",
  Jetizz: "Jetizz",
  
  ShipEntegra: "ShipEntegra",
  
  Scotty: "Scotty",
  BitaksiExpress: "BitaksiExpress",
  Octovan: "Octovan",
  PaketTaxi: "PaketTaxi",
  Cargon: "Cargon",
  
  DHL: "DHL",
  UPS: "UPS",
  FedEx: "FedEx",
  TNT: "TNT",
  GLS: "GLS",
  Aramex: "Aramex",
  
  Ceva: "Ceva",
  Horoz: "Horoz",
  Netlog: "Netlog",
  Ekol: "Ekol",
  BorusanLojistik: "BorusanLojistik",
};

// Geliver CarrierCompany enum tablosu (integer)
export const CARRIER_COMPANY_ENUMS = [
  { value: 0, label: "Yurtiçi" },
  { value: 1, label: "Aras" },
  { value: 2, label: "Mng" },
  { value: 3, label: "Sürat" },
  { value: 4, label: "Ptt" },
  { value: 5, label: "HepsiJet" },
  { value: 6, label: "TrendyolExpress" },
  { value: 7, label: "KolayGelsin" },
  { value: 8, label: "Kargoist" },
  { value: 9, label: "Jetizz" },
  { value: 10, label: "ShipEntegra" },
  { value: 11, label: "Scotty" },
  { value: 12, label: "BitaksiExpress" },
  { value: 13, label: "Octovan" },
  { value: 14, label: "PaketTaxi" },
  { value: 15, label: "Cargon" },
  { value: 16, label: "DHL" },
  { value: 17, label: "UPS" },
  { value: 18, label: "FedEx" },
  { value: 19, label: "TNT" },
  { value: 20, label: "GLS" },
  { value: 21, label: "Aramex" },
  { value: 22, label: "Ceva" },
  { value: 23, label: "Horoz" },
  { value: 24, label: "Netlog" },
  { value: 25, label: "Ekol" },
  { value: 26, label: "BorusanLojistik" },
];

// Select için options array
export const CARRIER_OPTIONS = Object.keys(CARRIER_COMPANIES).map(key => ({
  value: key,
  label: key
}));

// Gruplu görünüm için
export const CARRIER_GROUPS = {
  "Yerel Kargo": ["Yurtiçi", "Aras", "Mng", "Sürat", "Ptt"],
  "E-Ticaret Kargo": ["HepsiJet", "TrendyolExpress", "KolayGelsin", "Kargoist", "Jetizz"],
  "Entegratör": ["ShipEntegra"],
  "Hızlı Teslimat": ["Scotty", "BitaksiExpress", "Octovan", "PaketTaxi", "Cargon"],
  "Uluslararası": ["DHL", "UPS", "FedEx", "TNT", "GLS", "Aramex"],
  "Lojistik": ["Ceva", "Horoz", "Netlog", "Ekol", "BorusanLojistik"],
};
