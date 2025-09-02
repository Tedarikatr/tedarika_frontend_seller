import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCompany } from "@/api/sellerCompanyService";
import { getMyExtraInfo } from "@/api/sellerCompanyExtraInfoService";
import { getMyDocuments } from "@/api/sellerCompanyDocumentService";
import { DOC_LABELS, REQUIRED_DOC_TYPES } from "@/constants/companyDocuments";
import { FileText, AlertTriangle, CheckCircle2, Plus, FolderOpen, Building2 } from "lucide-react";

/** API string enum -> TR etiket */
const companyTypeOptions = {
  SoleProprietorship: "Şahıs",
  Limited: "Limited Şirket",
  JointStock: "Anonim Şirket",
  Cooperative: "Kooperatif",
  BranchOffice: "Şube",
  ForeignCompany: "Yabancı Şirket",
  Other: "Diğer",
};

const Badge = ({ children, color = "gray" }) => {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[color]}`}>{children}</span>
  );
};

const Field = ({ label, value, children }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm font-medium mb-1">{label}</span>
    {children || <span className="text-gray-800 break-words">{value || "-"}</span>}
  </div>
);

const RowKV = ({ k, v }) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <span className="text-gray-500">{k}</span>
    <span className="text-gray-800 font-medium truncate" title={v}>{v || "-"}</span>
  </div>
);

const CompanyInfoCard = () => {
  const nav = useNavigate();
  const [company, setCompany] = useState(null);
  const [extra, setExtra] = useState(null);         // SellerCompanyExtraInfo
  const [docs, setDocs] = useState([]);             // SellerCompanyDocument[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const c = await getMyCompany();
        setCompany(c || null);
        try {
          const ei = await getMyExtraInfo();
          if (ei && (ei.id || ei.companyId)) setExtra(ei);
        } catch {}
        try {
          const d = await getMyDocuments();
          setDocs(Array.isArray(d) ? d : d?.items || []);
        } catch {}
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const have = (t) => docs.some((x) => x.documentType === t);
  const missingDocs = useMemo(
    () => REQUIRED_DOC_TYPES.filter((t) => !have(t)),
    [docs]
  );

  if (loading || !company) return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-72 bg-gray-100 rounded" />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-50 rounded" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full space-y-8">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003636]/10 text-[#003636]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Şirket Bilgileri</h2>
            <p className="text-sm text-gray-500 mt-1">
              Şirket profilinizde kayıtlı olan bilgiler ve ek doğrulama öğeleri.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => nav("/seller/company-profile")}
            className="bg-gradient-to-r from-[#003636] to-[#006666] hover:brightness-110 text-white font-semibold text-sm py-2 px-4 rounded-lg"
          >
            Bilgileri Güncelle
          </button>
        </div>
      </div>

      {/* Temel şirket alanları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm text-gray-700">
        <Field label="Şirket Adı" value={company.name} />
        <Field label="Vergi No" value={company.taxNumber} />
        <Field label="Vergi Dairesi" value={company.taxOffice} />
        <Field label="Ülke" value={company.country} />
        <Field label="Şehir" value={company.province} />
        <Field label="Adres" value={company.address} />
        <Field label="Şirket No" value={company.companyNumber} />
        <Field label="Şirket Türü" value={companyTypeOptions[company.type] || company.type} />

        <Field label="Doğrulama">
          <Badge color={company.isVerified ? "blue" : "amber"}>
            {company.isVerified ? "Doğrulandı" : "Bekliyor"}
          </Badge>
        </Field>
        <Field label="Durum">
          <Badge color={company.isActive ? "green" : "red"}>
            {company.isActive ? "Aktif" : "Pasif"}
          </Badge>
        </Field>
      </div>

      {/* Ekstra Bilgiler (özet) */}
      <section className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Ekstra Bilgiler</h3>
          <button
            onClick={() => nav("/seller/profile/extra-info")}
            className="text-sm flex items-center gap-1 text-[#006666] hover:underline"
          >
            <Plus className="w-4 h-4" /> Görüntüle / Düzenle
          </button>
        </div>

        {!extra ? (
          <div className="flex items-start gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div className="text-sm">
              Henüz ekstra şirket bilgileri girilmemiş. KEP adresi, yetkili kişi ve yetkili telefon
              bilgilerini eklemeniz önerilir.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
            <RowKV k="KEP Adresi" v={extra.kepAddress} />
            <RowKV k="Yetkili Kişi" v={extra.authorizedPersonName} />
            <RowKV k="Yetkili Telefonu" v={extra.authorizedPersonPhone} />
            <RowKV k="MERSİS No" v={extra.mersisNumber} />
            <RowKV k="Ticaret Sicil No" v={extra.tradeRegistryNumber} />
            <RowKV k="Ticaret Odası" v={extra.chamberOfCommerce} />
            <RowKV k="Kuruluş Yılı" v={extra.foundationYear} />
            <RowKV k="NACE Kodu" v={extra.naceCode} />
            <RowKV k="Faaliyet Kodu" v={extra.activityCode} />
            <RowKV k="Şirket Ölçeği" v={extra.companyScale} />
            <RowKV k="Web Sitesi" v={extra.website} />
          </div>
        )}
      </section>

      {/* Belgeler (özet) */}
      <section className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Belgeler</h3>
          <button
            onClick={() => nav("/seller/company-documents")}
            className="text-sm flex items-center gap-1 text-[#006666] hover:underline"
          >
            <FolderOpen className="w-4 h-4" /> Tüm Belgeleri Yönet
          </button>
        </div>

        {/* Durum kutusu */}
        {missingDocs.length > 0 ? (
          <div className="flex items-start gap-2 text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 mb-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div className="text-sm">
              Eksik zorunlu belgeler:
              <span className="ml-1 font-medium">
                {missingDocs.map((t) => DOC_LABELS[t]).join(", ")}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm">Tüm zorunlu belgeler mevcut.</p>
          </div>
        )}

        {/* Son eklenen 3 belge */}
        {docs.length === 0 ? (
          <div className="text-sm text-gray-600">Henüz belge eklenmemiş.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {docs.slice(0, 3).map((d) => (
              <li key={d.id} className="p-3 rounded-xl border bg-white flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold line-clamp-1" title={DOC_LABELS[d.documentType] || d.documentType}>
                    {DOC_LABELS[d.documentType] || d.documentType}
                  </div>
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-sky-700 underline break-all"
                  >
                    Belgeyi Aç
                  </a>
                  {d.description && (
                    <div className="text-xs text-gray-500 mt-0.5 break-words">{d.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default CompanyInfoCard;