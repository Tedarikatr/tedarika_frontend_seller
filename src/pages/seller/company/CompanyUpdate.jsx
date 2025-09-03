// src/pages/seller/company/CompanyUpdate.jsx
import { useEffect, useMemo, useState } from "react";
import { getMyCompany, updateCompany } from "@/api/sellerCompanyService";
import TaxOfficeSelect from "@/components/seller/TaxOfficeSelect";
import { Building2, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

// UI (numeric) → API (string enum) map
const COMPANY_TYPE_NUM2STR = {
  1: "SoleProprietorship",
  2: "Limited",
  3: "JointStock",
  4: "Cooperative",
  5: "BranchOffice",
  6: "ForeignCompany",
  99: "Other",
};

const companyTypeOptions = [
  { value: 1, label: "Şahıs" },
  { value: 2, label: "Limited Şirket" },
  { value: 3, label: "Anonim Şirket" },
  { value: 4, label: "Kooperatif" },
  { value: 5, label: "Şube" },
  { value: 6, label: "Yabancı Şirket" },
  { value: 99, label: "Diğer" },
];

const Field = ({ label, required, children, hint }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-rose-600">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
  </div>
);

export default function CompanyUpdate() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyCompany();

        // backend type hem number hem string gelebilir → UI numeric'e normalize et
        const str2num = Object.fromEntries(
          Object.entries(COMPANY_TYPE_NUM2STR).map(([k, v]) => [v, Number(k)])
        );
        const uiType =
          typeof data.type === "number"
            ? data.type
            : typeof data.type === "string"
            ? str2num[data.type] ?? ""
            : "";

        setForm({
          id: data.id,
          name: data.name || "",
          taxNumber: data.taxNumber || "",
          taxOffice: data.taxOffice || "",
          country: data.country || "",
          province: data.province || "",
          address: data.address || "",
          type: uiType,
        });
      } catch (err) {
        setMessage("❌ Şirket bilgileri alınamadı.");
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const requiredOk = useMemo(() => {
    if (!form) return false;
    return (
      form.name?.trim() &&
      form.taxNumber?.trim() &&
      form.taxOffice?.trim() &&
      form.country?.trim() &&
      form.province?.trim() &&
      form.address?.trim() &&
      (form.type !== "" && form.type !== null && form.type !== undefined)
    );
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!requiredOk) {
      setMessage("❌ Lütfen zorunlu alanları doldurun.");
      setLoading(false);
      return;
    }

    try {
      // UI numeric → API string enum (Swagger örneği)
      const num = Number(form.type);
      const apiType = Number.isNaN(num)
        ? form.type || "Other"
        : COMPANY_TYPE_NUM2STR[num] ?? "Other";

      await updateCompany({
        ...form,
        name: form.name.trim(),
        taxNumber: form.taxNumber.trim(),
        taxOffice: form.taxOffice.trim(),
        country: form.country.trim(),
        province: form.province.trim(),
        address: form.address.trim(),
        type: apiType,
      });

      setMessage("✅ Şirket bilgileri başarıyla güncellendi.");
    } catch (err) {
      setMessage("❌ " + (err?.message || "Güncelleme sırasında bir hata oluştu."));
    } finally {
      setLoading(false);
    }
  };

  if (initializing || !form) {
    return (
      <div className="px-6 py-10">
        <div className="max-w-6xl mx-auto bg-white border rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
            <div className="md:col-span-2 h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Şirket Adı", required: true },
    { name: "taxNumber", label: "Vergi No", required: true },
    { name: "country", label: "Ülke", required: true },
    { name: "province", label: "Şehir", required: true },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafa]">
      {/* Hero başlık - tam genişlik */}
      <header className="bg-gradient-to-r from-[#e9f0ee] to-[#f3f8f7]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#003636]/10 text-[#003636]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#003636]">Şirket Bilgilerini Güncelle</h2>
              <p className="text-sm text-gray-600 mt-1">Zorunlu alanları doldurun ve değişiklikleri kaydedin.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border"
        >
          {fields.map((f) => (
            <Field key={f.name} label={f.label} required={f.required}>
              <input
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.label}
                required={f.required}
                className="input"
              />
            </Field>
          ))}

          {/* Adres */}
          <div className="md:col-span-2">
            <Field label="Adres" required>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Adres"
                required
                rows={3}
                className="input min-h-[100px]"
              />
            </Field>
          </div>

          {/* Vergi Dairesi - JSON select */}
          <div className="md:col-span-1">
            <Field label="Vergi Dairesi" required>
              <TaxOfficeSelect
                name="taxOffice"
                value={form.taxOffice}
                onChange={handleChange}
                required
              />
            </Field>
          </div>

          {/* Şirket Türü */}
          <div className="md:col-span-1">
            <Field label="Şirket Türü" required>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="input bg-white"
              >
                <option value="">Seçiniz</option>
                {companyTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Aksiyonlar */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || !requiredOk}
              className="w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Güncelleniyor...</>) : "Güncelle"}
            </button>
            {message && (
              <div
                className={`text-center text-sm font-medium ${
                  message.startsWith("✅") ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-rose-700 bg-rose-50 border border-rose-200"
                } py-2 rounded-lg`}
              >
                {message}
              </div>
            )}
            {!requiredOk && (
              <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-xl">
                <AlertTriangle className="w-5 h-5 mt-0.5" />
                <p className="text-sm">Lütfen tüm zorunlu alanları doldurun.</p>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}