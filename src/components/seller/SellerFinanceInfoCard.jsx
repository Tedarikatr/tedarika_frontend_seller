import React, { useEffect, useMemo, useState } from "react";
import {
  getPayoutProfile,
  savePayoutProfile,
  submitPayoutProfile,
  getPayoutProfileStatus,
} from "@/api/sellerPayoutProfileService";
import { CheckCircle, AlertTriangle, Loader2, Copy, Check, Pencil, X } from "lucide-react";

const EMPTY = { bankName: "", bankBranch: "", bankAccountHolderName: "", iban: "", swiftCode: "" };

const STATUS_LABELS = {
  Created: "Oluşturuldu",
  Pending: "Beklemede",
  Submitted: "İnceleme Bekliyor",
  Approved: "Onaylandı",
  Verified: "Doğrulandı",
  Rejected: "Reddedildi",
};

const isVerifiedStatus = (s) => ["Approved", "Verified"].includes((s || "").trim());
const isSubmittedStatus = (s) => (s || "").trim() === "Submitted";
const isRejectedStatus = (s) => (s || "").trim() === "Rejected";

// IBAN yardımcıları
const formatIban = (val = "") => val.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
const normalizeIban = (val = "") => val.replace(/\s+/g, "").toUpperCase();

const StatusBadge = ({ status }) => {
  const label = STATUS_LABELS[status] || status || "Bilinmiyor";
  const cls = isVerifiedStatus(status)
    ? "bg-emerald-100 text-emerald-700"
    : isRejectedStatus(status)
    ? "bg-rose-100 text-rose-700"
    : isSubmittedStatus(status)
    ? "bg-indigo-100 text-indigo-700"
    : "bg-amber-100 text-amber-700";
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};

function stringify(obj) {
  try { return typeof obj === "string" ? obj : JSON.stringify(obj); } catch { return String(obj); }
}

export default function SellerFinanceInfoCard() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState(null);
  const [statusObj, setStatusObj] = useState(null);

  const [form, setForm] = useState(EMPTY);
  const [mode, setMode] = useState("view"); // "view" | "edit"

  const statusText = statusObj?.status || profile?.verificationStatus || "Created";
  const statusError = statusObj?.success === false ? statusObj?.errorMessage : "";
  const verified = isVerifiedStatus(statusText);

  const hasAnyBankData = useMemo(() => {
    if (!profile) return false;
    return Boolean(
      profile.bankName ||
        profile.bankBranch ||
        profile.bankAccountHolderName ||
        profile.iban ||
        profile.swiftCode
    );
  }, [profile]);

  const canSubmit = useMemo(() => {
    const raw = normalizeIban(form.iban);
    const isTrIban = raw.startsWith("TR") && raw.length === 26;
    return form.bankName?.trim() && form.bankAccountHolderName?.trim() && isTrIban;
  }, [form]);

  const refresh = async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([getPayoutProfile(), getPayoutProfileStatus()]);
      setProfile(p || null);
      setStatusObj(s || null);
      setForm({
        bankName: p?.bankName || "",
        bankBranch: p?.bankBranch || "",
        bankAccountHolderName: p?.bankAccountHolderName || "",
        iban: formatIban(p?.iban || ""),
        swiftCode: p?.swiftCode || "",
      });
      setMode(p && (p.bankName || p.bankAccountHolderName || p.iban) ? "view" : "edit");
    } catch (e) {
      console.error("payout profile load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "iban") {
      const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      setForm((p) => ({ ...p, iban: formatIban(raw) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(normalizeIban(form.iban));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const onSave = async (e) => {
    e?.preventDefault?.();
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
      await refresh();
      setMode("view");
    } catch (err) {
      setMsg("❌ Kayıt sırasında hata oluştu: " + (err?.message || ""));
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async () => {
    setBusy(true);
    setMsg("");
    try {
      if (mode === "edit" && canSubmit) {
        await savePayoutProfile({
          bankName: form.bankName.trim(),
          bankBranch: form.bankBranch.trim(),
          bankAccountHolderName: form.bankAccountHolderName.trim(),
          iban: normalizeIban(form.iban),
          swiftCode: form.swiftCode.trim(),
        });
      }
      await submitPayoutProfile(); // success:false -> throw
      await refresh();
      setMode("view");
      setMsg("✔️ Profil doğrulama için gönderildi.");
    } catch (err) {
      const apiErr = err?.response?.data ?? err;
      setMode("edit"); // reddedildiyse edite bırak
      setMsg(`❌ Gönderim sırasında hata: ${stringify(apiErr)}`);
      if (apiErr?.status) {
        setStatusObj((prev) => ({
          ...(prev || {}),
          status: apiErr.status,
          success: false,
          errorMessage: apiErr.errorMessage,
        }));
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-6">Yükleniyor…</div>;

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#003636]">Ödeme Bilgileri</h2>
        <StatusBadge status={statusText} />
      </div>

      {/* Banner */}
      {verified ? (
        <Banner cls="text-emerald-700 bg-emerald-50" icon={<CheckCircle className="w-5 h-5" />}>
          Ödeme profiliniz doğrulandı. Alanlar salt-okunur durumdadır.
        </Banner>
      ) : isSubmittedStatus(statusText) ? (
        <Banner cls="text-indigo-700 bg-indigo-50" icon={<AlertTriangle className="w-5 h-5" />}>
          Profil incelemede. Gerekmedikçe değişiklik yapmayın.
        </Banner>
      ) : isRejectedStatus(statusText) ? (
        <Banner cls="text-rose-700 bg-rose-50" icon={<AlertTriangle className="w-5 h-5" />}>
          Profil reddedildi veya gönderim hatası oluştu.
          {statusError && <span className="block mt-1 text-rose-600">Sunucu: {statusError}</span>}
          {msg?.startsWith("❌") && <span className="block mt-1 text-rose-600">{msg}</span>}
          Lütfen bilgileri kontrol edip yeniden gönderin.
        </Banner>
      ) : (
        <Banner cls="text-amber-700 bg-amber-50" icon={<AlertTriangle className="w-5 h-5" />}>
          Ödeme profiliniz henüz doğrulanmadı. Bilgileri kaydedip “Doğrulama için Gönder”e tıklayın.
        </Banner>
      )}

      {/* === VIEW MODE === */}
      {mode === "view" && (
        <>
          <ViewRow label="Banka Adı" value={profile?.bankName} />
          <ViewRow label="Şube" value={profile?.bankBranch} />
          <ViewRow label="Hesap Sahibi" value={profile?.bankAccountHolderName} />
          <ViewRow label="IBAN" value={formatIban(profile?.iban || "")}>
            <button
              type="button"
              onClick={copyIban}
              className="ml-2 px-2 py-1 rounded border text-xs hover:bg-gray-50"
              title="Kopyala"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </ViewRow>
          <ViewRow label="Swift Kodu" value={profile?.swiftCode} />

          <div className="mt-4 flex flex-wrap gap-3">
            {!verified && (
              <>
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
                >
                  <Pencil className="w-4 h-4" /> Düzenle
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 text-sm disabled:opacity-50"
                  disabled={busy || !hasAnyBankData}
                >
                  {busy ? <Loader2 className="w-4 h-4 inline animate-spin" /> : "Doğrulama için Gönder"}
                </button>
                <button
                  type="button"
                  onClick={refresh}
                  className="text-xs px-3 py-1 rounded border hover:bg-gray-50"
                >
                  Durumu Yenile
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* === EDIT MODE === */}
      {mode === "edit" && (
        <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Banka Adı" name="bankName" value={form.bankName} onChange={onChange} required />
          <Field label="Şube" name="bankBranch" value={form.bankBranch} onChange={onChange} />
          <Field
            label="Hesap Sahibi"
            name="bankAccountHolderName"
            value={form.bankAccountHolderName}
            onChange={onChange}
            required
          />

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              IBAN <span className="text-rose-600">*</span>
            </label>
            <div className="flex gap-2">
              <input
                name="iban"
                value={form.iban}
                onChange={onChange}
                placeholder="TR__ ____ ____ ____ ____ ____"
                className="input flex-1 tracking-wider"
                required
              />
              <button
                type="button"
                onClick={copyIban}
                className="px-3 rounded-lg border text-sm flex items-center gap-1 hover:bg-gray-50"
                disabled={!form.iban}
                title="Kopyala"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              IBAN sistemde boşluksuz saklanır; girişte okunabilirlik için gruplandırılır.
            </p>
          </div>

          <Field label="Swift Kodu" name="swiftCode" value={form.swiftCode} onChange={onChange} />

          <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
            <button
              type="submit"
              disabled={busy}
              className="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-800 disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kaydet"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm({
                  bankName: profile?.bankName || "",
                  bankBranch: profile?.bankBranch || "",
                  bankAccountHolderName: profile?.bankAccountHolderName || "",
                  iban: formatIban(profile?.iban || ""),
                  swiftCode: profile?.swiftCode || "",
                });
                setMode("view");
                setMsg("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
            >
              <X className="w-4 h-4" /> Vazgeç
            </button>

            {!verified && (
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
      )}

      {profile && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div><b>Firma Ünvanı:</b> {profile.legalCompanyTitle}</div>
          <div><b>Vergi Dairesi / No:</b> {profile.taxOffice} / {profile.taxNumber}</div>
          <div><b>İrtibat:</b> {profile.contactNameSurname} • {profile.gsmNumber}</div>
          <div><b>E-posta:</b> {profile.email}</div>
          <div className="md:col-span-2"><b>Adres:</b> {profile.address}</div>
        </div>
      )}

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}

/* ------- yardımcı mini bileşenler ------- */

function Field({ label, name, value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        required={required}
        className="input"
      />
    </div>
  );
}

function ViewRow({ label, value, children }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-sm font-medium text-gray-900 flex items-center">
        {value || "-"} {children}
      </div>
    </div>
  );
}

function Banner({ cls, icon, children }) {
  return (
    <div className={`flex items-start gap-2 ${cls} p-3 rounded-xl mb-5`}>
      {icon}
      <p className="text-sm">{children}</p>
    </div>
  );
}
