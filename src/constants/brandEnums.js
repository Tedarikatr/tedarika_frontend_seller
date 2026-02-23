// src/constants/brandEnums.js
// API ile uyumlu: SellerBrandController — BrandOwnershipStatus (0–4), BrandStatus (0–3), BrandOwnershipType (0–1)

export const BrandAuthorizationStatus = {
  0: "Pending",
  1: "Approved",
  2: "Revoked",
};

export const BrandComplaintStatus = {
  0: "Open",
  1: "In Review",
  2: "Resolved",
  3: "Rejected",
};

export const BrandDocumentType = {
  0: "Trademark Certificate",
  1: "Authorization Letter",
  2: "Distributor Invoice",
  3: "Other",
};

export const BrandLockStatus = {
  0: "None",
  1: "Owner Only",
  2: "Admin Override",
};

/** API: BrandOwnershipStatus — 0 Pending, 1 Approved, 2 Rejected, 3 Revoked, 4 Expired */
export const BrandOwnershipStatus = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
  3: "Revoked",
  4: "Expired",
};

/** Kullanıcı deneyimi: Onay / Red / Beklemede durumları Türkçe ve renk ile gösterim */
export const BrandOwnershipStatusDisplay = {
  0: { label: "Beklemede", color: "bg-amber-100 text-amber-800 border-amber-300", colorCard: "from-amber-50 to-orange-50 border-amber-300" },
  1: { label: "Onaylı", color: "bg-green-100 text-green-800 border-green-300", colorCard: "from-green-50 to-emerald-50 border-green-300" },
  2: { label: "Reddedildi", color: "bg-red-100 text-red-800 border-red-300", colorCard: "from-red-50 to-red-50 border-red-300" },
  3: { label: "İptal", color: "bg-gray-100 text-gray-800 border-gray-300", colorCard: "from-gray-50 to-gray-100 border-gray-300" },
  4: { label: "Süresi Dolmuş", color: "bg-orange-100 text-orange-800 border-orange-300", colorCard: "from-orange-50 to-amber-50 border-orange-300" },
};

export const BrandOwnershipType = {
  0: "Owner",
  1: "Authorized Reseller",
};

/** Türkçe sahiplik tipi etiketleri */
export const BrandOwnershipTypeTr = {
  0: "Sahip",
  1: "Yetkili Satıcı",
};

/** API: BrandStatus — marka onay durumu (admin) */
export const BrandStatus = {
  0: "Pending",
  1: "Approved",
  2: "Suspended",
  3: "Rejected",
};

/**
 * Sahiplik durumu sayı veya string gelirse normalize eder; Türkçe etiket ve renk döner.
 * @param {number|string} status - API'den gelen status (0-4 veya "Pending" vb.)
 * @returns {{ statusNum: number, label: string, color: string, colorCard: string }}
 */
export function getBrandOwnershipStatusDisplay(status) {
  const statusNum = typeof status === "number"
    ? status
    : Object.entries(BrandOwnershipStatus).find(([, v]) => v === status)?.[0];
  const num = statusNum !== undefined ? Number(statusNum) : 0;
  const display = BrandOwnershipStatusDisplay[num] || BrandOwnershipStatusDisplay[0];
  return { statusNum: num, label: display.label, color: display.color, colorCard: display.colorCard };
}
