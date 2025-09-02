import { useEffect, useState } from "react";
import { getMyExtraInfo } from "@/api/sellerCompanyExtraInfoService";
import { getMyDocuments } from "@/api/sellerCompanyDocumentService";
import { REQUIRED_DOC_TYPES } from "@/constants/companyDocuments";

// API hem sayı hem string enum döndürebilir; normalize edelim.
const TYPE_NAME_TO_CODE = {
  TaxCertificate: 1,
  TradeRegistry: 2,
  ChamberRegistration: 3,
  SignatureCircular: 4,
  Other: 99,
};

function normalizeDocType(v) {
  if (v == null) return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    // "3" → 3
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
    // "TaxCertificate" → 1
    return TYPE_NAME_TO_CODE[v] ?? null;
  }
  return null;
}

export default function useSellerSetupStatus() {
  const [loading, setLoading] = useState(true);
  const [hasExtraInfo, setHasExtraInfo] = useState(false);
  const [missingDocs, setMissingDocs] = useState([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      // ── Extra Info
      try {
        const ei = await getMyExtraInfo();

        // bazı backendler boş {} döndürür; anlamlı alan var mı kontrol et
        const meaningful =
          ei &&
          (ei.id || ei.companyId || ei.kepAddress || ei.authorizedPersonName || ei.authorizedPersonPhone);

        if (!cancelled) setHasExtraInfo(Boolean(meaningful));
      } catch {
        if (!cancelled) setHasExtraInfo(false);
      }

      // ── Belgeler
      try {
        const docs = await getMyDocuments();
        const list = Array.isArray(docs) ? docs : docs?.items || [];

        const codes = new Set(
          list
            .map((d) => normalizeDocType(d.documentType))
            .filter((x) => x != null)
        );

        const missing = REQUIRED_DOC_TYPES.filter((t) => !codes.has(t));
        if (!cancelled) setMissingDocs(missing);
      } catch {
        // hata varsa hepsini eksik kabul et
        if (!cancelled) setMissingDocs(REQUIRED_DOC_TYPES.slice());
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, hasExtraInfo, missingDocs };
}
