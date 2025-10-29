// =============================
// SellerFinanceInfoCard.jsx (Final - Modern, Emojisiz, Kurumsal)
// =============================
import React, { useEffect, useMemo, useState } from "react";
import {
  getPayoutProfile,
  savePayoutProfile,
} from "@/api/sellerPayoutProfileService";
import { Loader2, Copy, Check, Pencil, X } from "lucide-react";

// Boş form şablonu
const EMPTY = {
  bankName: "",
  bankBranch: "",
  bankAccountHolderName: "",
  iban: "",
  swiftCode: "",
};

// IBAN yardımcıları
const formatIban = (val = "") => val.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
const normalizeIban = (val = "") => val.replace(/\s+/g, "").toUpperCase();

export default function SellerFinanceInfoCard() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [mode, setMode] = useState("view"); // "view" | "edit"

  // IBAN doğrulama
  const ibanValid = useMemo(() => {
    const raw = normalizeIban(form.iban);
    return raw.startsWith("TR") && raw.length === 26;
  }, [form.iban]);

  // API'den profil verisini al
  const refresh = async () => {
    setLoading(true);
    try {
      const p = await getPayoutProfile();
      setProfile(p || null);
      setForm({
        bankName: p?.bankName || "",
        bankBranch: p?.bankBranch || "",
        bankAccountHolderName: p?.bankAccountHolderName || "",
        iban: formatIban(p?.iban || ""),
        swiftCode: p?.swiftCode || "",
      });
      setMode(p && (p.bankName || p.iban) ? "view" : "edit");
    } catch (err) {
      console.error("Finance info fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Input değişim
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "iban") {
      const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      setForm((p) => ({ ...p, iban: formatIban(raw) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  // IBAN kopyalama
  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(normalizeIban(form.iban));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  // Kayıt işlemi
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
      setMsg("Ödeme bilgileri başarıyla kaydedildi.");
      await refresh();
      setMode("view");
    } catch (err) {
      setMsg("Kayıt sırasında hata oluştu: " + (err?.message || ""));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Bilgiler yükleniyor...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full transition">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Ödeme Bilgileri
        </h2>
        {msg && <span className="text-sm text-gray-600">{msg}</span>}
      </div>

      {/* === VIEW MODE === */}
      {mode === "view" && (
        <>
          <div className="divide-y divide-gray-100">
            <InfoRow label="Banka Adı" value={profile?.bankName} />
            <InfoRow label="Şube" value={profile?.bankBranch} />
            <InfoRow label="Hesap Sahibi" value={profile?.bankAccountHolderName} />
            <InfoRow label="IBAN" value={formatIban(profile?.iban || "")}>
              <button
                type="button"
                onClick={copyIban}
                className="ml-2 px-2 py-1 rounded border text-xs hover:bg-gray-50 transition"
                title="Kopyala"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </InfoRow>
            <InfoRow label="Swift Kodu" value={profile?.swiftCode} />
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setMode("edit")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Pencil className="w-4 h-4" /> Düzenle
            </button>
            <button
              type="button"
              onClick={refresh}
              className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-gray-600"
            >
              Yenile
            </button>
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

          {/* IBAN */}
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
                className={`flex-1 tracking-wider border rounded-md px-2 py-1 text-sm focus:ring-2 outline-none ${
                  ibanValid ? "border-emerald-400 focus:ring-emerald-500" : "border-gray-300 focus:ring-rose-400"
                }`}
                required
              />
              <button
                type="button"
                onClick={copyIban}
                className="px-3 rounded-md border text-sm flex items-center gap-1 hover:bg-gray-50"
                disabled={!form.iban}
                title="Kopyala"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {!ibanValid && (
              <p className="text-xs text-rose-600">Geçerli bir TR IBAN giriniz (26 karakter)</p>
            )}
          </div>

          <Field label="Swift Kodu" name="swiftCode" value={form.swiftCode} onChange={onChange} />

          {/* Butonlar */}
          <div className="md:col-span-2 flex flex-wrap gap-3 mt-3">
            <button
              type="submit"
              disabled={busy}
              className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 text-sm font-medium transition disabled:opacity-50"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4" /> Vazgeç
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ------- Yardımcı Bileşenler ------- */

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
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
      />
    </div>
  );
}

function InfoRow({ label, value, children }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-sm font-medium text-gray-900 flex items-center">
        {value || "-"} {children}
      </div>
    </div>
  );
}
