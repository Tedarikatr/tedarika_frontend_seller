// Kod, ad ve görünen etiketleri tek yerde tutalım
export const DOC_DEFS = [
  { code: 1, name: "TaxCertificate",     label: "Vergi Levhası" },
  { code: 2, name: "TradeRegistry",      label: "Ticaret Sicil Kaydı" },
  { code: 3, name: "ChamberRegistration",label: "Kuruluş Sicil Gazetesi" },
  { code: 4, name: "SignatureCircular",  label: "İmza Sirküleri (Ops.)" },
  { code: 99, name: "Other",             label: "Diğer" },
];

// Zorunlular (kod olarak)
export const REQUIRED_DOC_TYPES = [1, 2, 3];

// Hızlı erişim map’leri
export const CODE_BY_NAME = Object.fromEntries(DOC_DEFS.map(d => [d.name, d.code]));
export const NAME_BY_CODE = Object.fromEntries(DOC_DEFS.map(d => [d.code, d.name]));
export const DOC_LABELS   = Object.fromEntries(DOC_DEFS.map(d => [d.code, d.label]));

// Gelen documentType’ı (sayı/string) koda çevir
export function normalizeDocType(val) {
  if (val == null) return null;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val);
    if (!Number.isNaN(n)) return n;          // "3" -> 3
    return CODE_BY_NAME[val] ?? null;        // "TaxCertificate" -> 1
  }
  return null;
}
