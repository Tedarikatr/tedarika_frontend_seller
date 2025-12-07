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
