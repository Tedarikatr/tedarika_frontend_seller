import React, { useEffect, useState, useMemo } from "react";
import {
  getPayoutProfile,
  savePayoutProfile,
  submitPayoutProfile,
  getPayoutProfileStatus,
} from "@/api/sellerPayoutProfileService";
import { CheckCircle, AlertTriangle, Loader2, Copy, Check } from "lucide-react";

const EMPTY = {
  bankName: "",
  bankBranch: "",
  bankAccountHolderName: "",
  iban: "",
  swiftCode: "",
};

const STATUS_LABELS = {
  Created: "Oluşturuldu",
  Pending: "Beklemede",
  Submitted: "İnceleme Bekliyor",
  Approved: "Onaylandı",
  Verified: "Doğrulandı",
  Rejected: "Reddedildi",
};

const isVerifiedStatus = (s) => ["Approved", "Verified"].includes((s || "").trim());

const StatusBadge = ({ status }) => {
  const verified = isVerifiedStatus(status);
  const label = STATUS_LABELS[status] || status || "Bilinmiyor";
  const cls = verified
    ? "bg-emerald-100 text-emerald-700"
    : status === "Rejected"
    ? "bg-rose-100 text-rose-700"
    : "bg-amber-100 text-amber-700";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
  );
};

// IBAN'ı görsel olarak 4'lü gruplara ayır
const formatIban = (val = "") => val.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
const normalizeIban = (val = "") => val.replace(/\s+/g, "").toUpperCase();

const SellerFinanceInfoCard = () => {
  const [form, setForm] = useState(EMPTY);
  const [statusObj, setStatusObj] = useState(null); // {success, subMerchantKey, status}
  const [profileMeta, setProfileMeta] = useState(null); // get-profile tüm alanlar
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const statusText = statusObj?.status || profileMeta?.verificationStatus;

  useEffect(() => {
    (async () => {
      try {
        const profile = await getPayoutProfile();
        setProfileMeta(profile || null);

        // bank alanlarını prefill et
        setForm({
          bankName: profile?.bankName || "",
          bankBranch: profile?.bankBranch || "",
          bankAccountHolderName: profile?.bankAccountHolderName || "",
          iban: formatIban(profile?.iban || ""),
          swiftCode: profile?.swiftCode || "",
        });

        const s = await getPayoutProfileStatus();
        setStatusObj(s || null);
      } catch (e) {
        console.error("payout profile load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "iban") {
      // yalnızca harf/rakam, boşlukları yönet
      const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      return setForm((p) => ({ ...p, iban: formatIban(raw) }));
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const canSubmit = useMemo(() => {
    return (
      form.bankName?.trim() &&
      form.bankAccountHolderName?.trim() &&
      normalizeIban(form.iban).length >= 16 // çok katı olmasın, min uzunluk kontrolü
    );
  }, [form]);

  const onSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await savePayoutProfile({
        bankName: form.bankName.trim(),
        bankBranch: form.bankBranch.trim(),
        bankAccountHolderName: form.bankAccountHolderName.trim(),
        iban: normalizeIban(form.iban),
        swiftCode: form.swiftCode.trim(),
      });
      setMsg("✔️ Ödeme bilgileri kaydedildi.");
    } catch (err) {
      setMsg("❌ Kayıt sırasında hata oluştu: " + (err.message || ""));
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async () => {
    setBusy(true);
    setMsg("");
    try {
      await submitPayoutProfile();
      const s = await getPayoutProfileStatus();
      setStatusObj(s || null);
      setMsg("✔️ Profil doğrulama için gönderildi.");
    } catch (err) {
      setMsg("❌ Gönderim sırasında hata: " + (err.message || ""));
    } finally {
      setBusy(false);
    }
  };

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(normalizeIban(form.iban));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  if (loading) return <div className="p-6">Yükleniyor…</div>;

  const verified = isVerifiedStatus(statusText);
  const readOnly = verified; // doğrulandıysa düzenlemeyi kilitle

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#003636]">Ödeme Bilgileri</h2>
        <StatusBadge status={statusText} />
      </div>

      {!verified ? (
        <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-xl mb-5">
          <AlertTriangle className="w-5 h-5 mt-0.5" />
          <p>Ödeme profiliniz henüz doğrulanmadı. Bilgileri kaydedip “Doğrulama için Gönder”e tıklayın.</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl mb-5">
          <CheckCircle className="w-5 h-5" />
          <p>Ödeme profiliniz doğrulandı. Alanlar salt-okunur durumdadır.</p>
        </div>
      )}

      {/* Banka formu */}
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Banka Adı<span className="text-rose-600">*</span></label>
          <input name="bankName" value={form.bankName} onChange={onChange} placeholder="Banka Adı" required disabled={readOnly} className={`input ${readOnly ? 'bg-gray-100' : ''}`} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Şube</label>
          <input name="bankBranch" value={form.bankBranch} onChange={onChange} placeholder="Şube" disabled={readOnly} className={`input ${readOnly ? 'bg-gray-100' : ''}`} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Hesap Sahibi<span className="text-rose-600">*</span></label>
          <input name="bankAccountHolderName" value={form.bankAccountHolderName} onChange={onChange} placeholder="Ad Soyad / Ünvan" required disabled={readOnly} className={`input ${readOnly ? 'bg-gray-100' : ''}`} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center justify-between">IBAN<span className="text-rose-600">*</span></label>
          <div className="flex gap-2">
            <input name="iban" value={form.iban} onChange={onChange} placeholder="TR__ ____ ____ ____ ____ ____" required disabled={readOnly} className={`input flex-1 tracking-wider ${readOnly ? 'bg-gray-100' : ''}`} />
            <button type="button" onClick={copyIban} className="px-3 rounded-lg border text-sm flex items-center gap-1 hover:bg-gray-50" disabled={!form.iban} title="Kopyala">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500">IBAN, sistemde boşluksuz saklanır; girişte okunabilirlik için gruplandırılır.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Swift Kodu</label>
          <input name="swiftCode" value={form.swiftCode} onChange={onChange} placeholder="Örn: TFKBTRIS" disabled={readOnly} className={`input ${readOnly ? 'bg-gray-100' : ''}`} />
        </div>

        {/* Aksiyonlar */}
        <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
          {!readOnly && (
            <button type="submit" disabled={busy} className="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-800 disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kaydet"}
            </button>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy || !canSubmit}
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 disabled:opacity-50"
            >
              Doğrulama için Gönder
            </button>
          )}
        </div>
      </form>

      {/* İsteğe bağlı: get-profile meta bilgileri (salt-okunur) */}
      {profileMeta && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div><b>Firma Ünvanı:</b> {profileMeta.legalCompanyTitle}</div>
          <div><b>Vergi Dairesi / No:</b> {profileMeta.taxOffice} / {profileMeta.taxNumber}</div>
          <div><b>İrtibat:</b> {profileMeta.contactNameSurname} • {profileMeta.gsmNumber}</div>
          <div><b>E-posta:</b> {profileMeta.email}</div>
          <div className="md:col-span-2"><b>Adres:</b> {profileMeta.address}</div>
        </div>
      )}

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
};

export default SellerFinanceInfoCard;