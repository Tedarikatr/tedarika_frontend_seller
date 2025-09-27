// src/pages/seller/company/SellerCompanyDocuments.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { getMyCompany } from "@/api/sellerCompanyService";
import { getMyDocuments, addDocument, deleteDocument } from "@/api/sellerCompanyDocumentService";
import { REQUIRED_DOC_TYPES, DOC_DEFS, DOC_LABELS, normalizeDocType } from "@/constants/companyDocuments";
import { Upload, CheckCircle, AlertTriangle, Trash2, Shield, Loader2, X } from "lucide-react";

export default function SellerCompanyDocuments() {
  const [company, setCompany] = useState(null);
  const [docs, setDocs] = useState([]);
  const [docTypeName, setDocTypeName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const dropRef = useRef(null);

  useEffect(() => {
    (async () => {
      const c = await getMyCompany().catch(() => null);
      setCompany(c);
      const d = await getMyDocuments();
      setDocs(Array.isArray(d) ? d : d?.items || []);
    })();
  }, []);

  const haveTypeCode = (code) => docs.some((x) => normalizeDocType(x.documentType) === code);

  const missingRequired = useMemo(() => REQUIRED_DOC_TYPES.filter((code) => !haveTypeCode(code)), [docs]);

  const pickFile = (f) => {
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) {
      setMsg("❌ Dosya 20MB limitini aşıyor.");
      return;
    }
    setFile(f);
  };

  const onFileChange = (e) => pickFile(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    pickFile(e.dataTransfer?.files?.[0]);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const refreshDocs = async () => {
    const d = await getMyDocuments();
    setDocs(Array.isArray(d) ? d : d?.items || []);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!docTypeName) return setMsg("Belge türü seçin.");
    if (!file) return setMsg("Lütfen dosya seçin.");

    setMsg("Kaydediliyor...");
    setSaving(true);
    try {
      await addDocument({ documentType: docTypeName, file, description: desc?.trim() });
      await refreshDocs();
      setDocTypeName("");
      setDesc("");
      setFile(null);
      setMsg("✔️ Belge eklendi.");
    } catch (err) {
      setMsg(`❌ ${err.message || "Belge kaydedilemedi."}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteDocument(id);
      await refreshDocs();
    } catch (e) {
      setMsg(`❌ Silinemedi: ${e.message || ""}`);
    }
  };

  return (
    <div className="w-full py-6">
      {/* Başlık */}
      <div className="px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-600/10 text-sky-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Şirket Belgeleri</h2>
            <p className="text-sm text-gray-600">Zorunlu belgeleri yükleyin ve mevcut belgeleri yönetin.</p>
          </div>
        </div>
      </div>

      {/* Eksik belgeler durumu */}
      <div className="px-6 mt-4">
        {missingRequired.length > 0 ? (
          <div className="flex items-start gap-2 text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-medium">Eksik zorunlu belgeler</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {missingRequired.map((code) => (
                  <span key={code} className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {DOC_LABELS[code]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <CheckCircle className="w-5 h-5" />
            <p>Tüm zorunlu belgeler mevcut.</p>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="px-6 mt-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Belge Türü */}
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-gray-700">
            Belge Türü<span className="text-rose-600">*</span>
          </label>
          <select className="mt-1 input w-full" value={docTypeName} onChange={(e) => setDocTypeName(e.target.value)} required>
            <option value="">Seçin…</option>
            {DOC_DEFS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dropzone */}
        <div className="lg:col-span-2">
          <label className="text-sm font-medium text-gray-700">Dosya</label>
          <div ref={dropRef} onDrop={onDrop} onDragOver={onDragOver} className="mt-1 rounded-xl border-2 border-dashed border-slate-300 bg-white p-4">
            <p className="text-sm text-slate-700">
              Dosyayı buraya sürükleyin veya
              <label className="mx-1 underline text-sky-700 cursor-pointer">
                bilgisayardan seçin
                <input type="file" onChange={onFileChange} accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden" />
              </label>
            </p>
            <p className="text-xs text-slate-500">Maks. 20MB • PDF / PNG / JPG / WEBP</p>
            {file && (
              <div className="mt-1 text-xs text-slate-600">
                Seçilen: <b>{file.name}</b> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                <button type="button" onClick={() => setFile(null)} className="ml-2 inline-flex items-center gap-1 text-rose-600">
                  <X className="w-3 h-3" /> Kaldır
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Açıklama */}
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-gray-700">Açıklama (ops.)</label>
          <input className="mt-1 input w-full" placeholder="Kısa açıklama" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div className="lg:col-span-4">
          <button className="w-full bg-sky-700 hover:bg-sky-800 transition text-white py-3 rounded-xl flex items-center gap-2 justify-center" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Kaydediliyor…
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" /> Kaydet
              </>
            )}
          </button>
        </div>
      </form>

      {msg && <p className="px-6 mt-3 text-sm">{msg}</p>}

      {/* Mevcut Belgeler */}
      <div className="px-6 mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {docs.map((d) => {
          const code = normalizeDocType(d.documentType);
          return (
            <div key={d.id} className="border rounded-2xl p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <div className="font-semibold truncate" title={DOC_LABELS[code] || d.documentType}>
                    {DOC_LABELS[code] || d.documentType}
                  </div>
                  <a className="text-sky-700 underline break-all" href={d.fileUrl} target="_blank" rel="noopener noreferrer">
                    Belgeyi Aç
                  </a>
                  {d.description && <div className="text-sm text-gray-600 mt-1 break-words">{d.description}</div>}
                </div>
                <button onClick={() => remove(d.id)} className="text-red-600 hover:text-red-700 p-2" title="Sil">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
        {docs.length === 0 && <div className="text-sm text-gray-600">Henüz bir belge eklenmedi.</div>}
      </div>
    </div>
  );
}
